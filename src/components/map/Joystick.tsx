'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { throttle } from 'lodash';
import eventBus from '@/eventBus';

export default function Joystick() {
    const [knobPosition, setKnobPosition] = useState({ x: 50, y: 50 });
    const [dragging, setDragging] = useState(false);
    const joystickBaseRef = useRef<HTMLDivElement>(null);
    const centerRef = useRef({ x: 50, y: 50 });
    const radius = 50;
    const fireEventIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const lastDirectionRef = useRef('');

    const emitDirection = useCallback((x: number, y: number) => {
        let direction = '';

        if (y > 0) direction = 'down';
        else if (y < 0) direction = 'up';
        if (x > 0) direction = 'right';
        else if (x < 0) direction = 'left';

        if (direction) {
            // Always emit if we are moving, MapService handles continuous movement
            eventBus.emit('map-move', direction);
        }
    }, []);

    const emitDirectionThrottled = useCallback(throttle((x: number, y: number) => {
        emitDirection(x, y);
    }, 50), [emitDirection]); // Faster throttle for smoother movement

    const startContinuousEvents = useCallback((x: number, y: number) => {
        emitDirection(x, y);
        if (fireEventIntervalRef.current) clearInterval(fireEventIntervalRef.current);
        fireEventIntervalRef.current = setInterval(() => {
            emitDirection(x, y);
        }, 50); // Faster interval
    }, [emitDirection]);

    const stopContinuousEvents = useCallback(() => {
        if (fireEventIntervalRef.current) {
            clearInterval(fireEventIntervalRef.current);
            fireEventIntervalRef.current = null;
        }
        setKnobPosition({ x: 50, y: 50 });
        lastDirectionRef.current = '';
        eventBus.emit('map-stop');
    }, []);

    const handleKeyPress = useCallback((event: KeyboardEvent) => {
        const directions: Record<string, { x: number; y: number }> = {
            ArrowUp: { x: 50, y: 0 },
            ArrowDown: { x: 50, y: 100 },
            ArrowLeft: { x: 0, y: 50 },
            ArrowRight: { x: 100, y: 50 },
        };

        if (event.key in directions && !fireEventIntervalRef.current) {
            const { x, y } = directions[event.key];
            setKnobPosition({ x, y });
            startContinuousEvents(x - 50, y - 50);
        }
    }, [startContinuousEvents]);

    const handleKeyUp = useCallback(() => {
        stopContinuousEvents();
    }, [stopContinuousEvents]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            window.removeEventListener('keyup', handleKeyUp);
            stopContinuousEvents();
        };
    }, [handleKeyPress, handleKeyUp, stopContinuousEvents]);

    const startDrag = (clientX: number, clientY: number) => {
        setDragging(true);
        if (joystickBaseRef.current) {
            const rect = joystickBaseRef.current.getBoundingClientRect();
            centerRef.current = { x: rect.width / 2, y: rect.height / 2 };
            const x = clientX - rect.left - centerRef.current.x;
            const y = clientY - rect.top - centerRef.current.y;
            startContinuousEvents(x, y);
        }
    };

    const drag = (clientX: number, clientY: number) => {
        if (!dragging || !joystickBaseRef.current) return;

        const rect = joystickBaseRef.current.getBoundingClientRect();
        const x = clientX - rect.left - centerRef.current.x;
        const y = clientY - rect.top - centerRef.current.y;

        const distance = Math.sqrt(x ** 2 + y ** 2);
        let newX = x;
        let newY = y;

        if (distance > radius) {
            const scale = radius / distance;
            newX = x * scale;
            newY = y * scale;
        }

        setKnobPosition({
            x: centerRef.current.x + newX,
            y: centerRef.current.y + newY,
        });

        emitDirectionThrottled(newX, newY);
    };

    const endDrag = () => {
        setDragging(false);
        stopContinuousEvents();
    };

    return (
        <div className="flex flex-col items-center gap-[10px] outline-none">
            <h2 className="text-xl font-bold">Map Controls</h2>
            <p className="text-[14px] text-[#666]">Use the arrow keys, touch, or drag the joystick to move the map.</p>
            <br />
            <div
                className="relative w-[100px] h-[100px]"
                onTouchStart={(e) => startDrag(e.touches[0].clientX, e.touches[0].clientY)}
                onTouchMove={(e) => drag(e.touches[0].clientX, e.touches[0].clientY)}
                onTouchEnd={endDrag}
                onMouseDown={(e) => startDrag(e.clientX, e.clientY)}
                onMouseMove={(e) => drag(e.clientX, e.clientY)}
                onMouseUp={endDrag}
                onMouseLeave={endDrag}
            >
                <div
                    ref={joystickBaseRef}
                    className="absolute top-0 left-0 w-full h-full rounded-full border-[3px] border-[#666] shadow-[0_5px_15px_rgba(0,0,0,0.2)]"
                    style={{ background: 'radial-gradient(circle, #cccccc, #999999)' }}
                >
                    <div
                        className="absolute w-[40px] h-[40px] rounded-full border-[2px] border-[#111] cursor-grab shadow-[0_3px_10px_rgba(0,0,0,0.2)]"
                        style={{
                            background: 'radial-gradient(circle, #555, #333)',
                            left: `${knobPosition.x}px`,
                            top: `${knobPosition.y}px`,
                            transform: 'translate(-50%, -50%)',
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
}
