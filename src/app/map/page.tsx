'use client';

import dynamic from 'next/dynamic';

// Dynamically import Map component with no SSR to avoid Pixi.js issues
const Map = dynamic(() => import('@/components/map/Map'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center p-[20px] bg-[#8794e3] rounded-[10px] w-full min-h-[600px]">
            <p className="text-white text-xl">Loading map...</p>
        </div>
    ),
});

export default function MapPage() {
    return (
        <div className="w-full h-full overflow-hidden">
            <Map />
        </div>
    );
}
