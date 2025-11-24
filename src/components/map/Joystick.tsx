'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { throttle } from 'lodash';
import eventBus from '@/eventBus';

export default function Joystick() {
    const knobPos = { x: 28, y: 28 };
    const [knobPosition, setKnobPosition] = useState(knobPos);
    const [dragging, setDragging] = useState(false);
    const joystickBaseRef = useRef<HTMLDivElement>(null);
    const centerRef = useRef(knobPos);
    const radius = knobPos.x;
    const fireEventIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const lastDirectionRef = useRef('');

    const emitDirection = useCallback((x: number, y: number) => {
        let direction = '';

        // Calculate absolute values
        const absX = Math.abs(x);
        const absY = Math.abs(y);

        // Require minimum movement threshold
        const threshold = 5;
        if (absX < threshold && absY < threshold) return;

        // Only allow cardinal directions (no diagonals)
        // Choose the axis with greater magnitude
        if (absX > absY) {
            // Horizontal movement only
            direction = x > 0 ? 'right' : 'left';
        } else {
            // Vertical movement only
            direction = y > 0 ? 'down' : 'up';
        }

        if (direction) {
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
        setKnobPosition({ x: knobPos.x, y: knobPos.y });
        lastDirectionRef.current = '';
        eventBus.emit('map-stop');
    }, []);

    const handleKeyPress = useCallback((event: KeyboardEvent) => {
        const directions: Record<string, { x: number; y: number }> = {
            ArrowUp: { x: knobPos.x, y: 0 },
            ArrowDown: { x: knobPos.x, y: knobPos.y * 2 },
            ArrowLeft: { x: 0, y: knobPos.y },
            ArrowRight: { x: knobPos.x * 2, y: knobPos.y },
        };

        if (event.key in directions && !fireEventIntervalRef.current) {
            const { x, y } = directions[event.key];
            setKnobPosition({ x, y });
            startContinuousEvents(x - knobPos.x, y - knobPos.y);
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

        // Start continuous movement based on joystick position
        if (!fireEventIntervalRef.current) {
            startContinuousEvents(newX, newY);
        }
    };

    const endDrag = () => {
        setDragging(false);
        stopContinuousEvents();
    };

    return (
        <div className="flex flex-col items-center gap-[5px] outline-none">
            <p className="text-sm text-muted-foreground mb-3 md:block text-center">Use the arrow keys, or drag the joystick on mobile devices to move on the map.</p>
            <div
                className="relative w-[60px] h-[60px]"
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
                    className="absolute top-0 left-0 w-full h-full rounded-full border-[2px] border-border shadow-md"
                    style={{ background: 'radial-gradient(circle, hsl(var(--muted)), hsl(var(--muted-foreground) / 0.3))' }}
                >
                    <div
                        className="absolute w-[24px] h-[24px] rounded-full border-[2px] border-primary cursor-grab shadow-md"
                        style={{
                            background: 'var(--color-primary)',
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
