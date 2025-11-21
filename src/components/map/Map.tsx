'use client';

import { useEffect, useRef, useState } from 'react';
import MapService from '@/services/MapService';
import eventBus from '@/eventBus';

export default function Map() {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapServiceRef = useRef<MapService | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);

    // Ensure we're only rendering on client
    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;

        let mounted = true;

        const initMap = async () => {
            if (mapContainerRef.current && !mapServiceRef.current && mounted) {
                try {
                    setIsLoading(true);
                    setError(null);

                    const service = new MapService('map-container');
                    mapServiceRef.current = service;

                    await service.init();

                    // Subscribe to joystick or movement events
                    const handleMove = (direction: string) => {
                        service.move(direction);
                    };

                    const handleStop = () => {
                        service.stop();
                    };

                    eventBus.on('map-move', handleMove);
                    eventBus.on('map-stop', handleStop);

                    // Save location on navigation
                    const handleUnload = () => service.saveCurrentLocation();
                    window.addEventListener('beforeunload', handleUnload);

                    setIsLoading(false);

                    return () => {
                        eventBus.off('map-move', handleMove);
                        eventBus.off('map-stop', handleStop);
                        window.removeEventListener('beforeunload', handleUnload);
                        if (mounted) {
                            service.destroy();
                            mapServiceRef.current = null;
                        }
                    };
                } catch (err) {
                    console.error('Failed to initialize map:', err);
                    setError('Failed to load map. Please refresh the page.');
                    setIsLoading(false);
                }
            }
        };

        initMap();

        return () => {
            mounted = false;
            if (mapServiceRef.current) {
                mapServiceRef.current.destroy();
                mapServiceRef.current = null;
            }
        };
    }, [isClient]);

    if (!isClient) {
        return (
            <div className="flex items-center justify-center p-[20px] bg-[#8794e3] rounded-[10px] w-full min-h-[600px]">
                <p className="text-white text-xl">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-[20px] bg-[#8794e3] rounded-[10px] w-full min-h-[600px]">
                <div className="text-white text-center">
                    <p className="text-xl font-bold mb-2">⚠️ {error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-white text-[#8794e3] px-4 py-2 rounded-lg hover:bg-gray-100"
                    >
                        Reload Page
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#8794e3] rounded-[10px] z-10">
                    <p className="text-white text-xl">Loading map...</p>
                </div>
            )}
            <div
                id="map-container"
                ref={mapContainerRef}
                className="flex items-center justify-center p-[5px] bg-[#8794e3] rounded-[10px] w-full min-h-[600px] max-h-[600px] overflow-hidden"
            >
                {/* PixiJS will append canvas here */}
            </div>
        </div>
    );
}
