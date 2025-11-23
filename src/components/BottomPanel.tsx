'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function BottomPanel() {
    const pathname = usePathname();
    const [isExpanded, setIsExpanded] = useState(true);

    // Only show on map page
    if (pathname !== '/map') {
        return null;
    }

    // Map page has content
    return (
        <div className="md:hidden fixed bottom-2 left-2 right-2 z-[80] bg-[#1a1f2e] border border-border/50 rounded-xl shadow-2xl transition-all duration-300">
            {isExpanded ? (
                <div className="p-3 pb-safe">
                    <button
                        onClick={() => setIsExpanded(false)}
                        className="absolute top-2 right-2 text-white/50 hover:text-white/90 text-xs"
                    >
                        <i className="fas fa-chevron-down"></i>
                    </button>
                    <div className="flex flex-col gap-1.5 text-white/90 text-xs">
                        <p className="font-medium">A wild Rokémon appeared!</p>
                        <p className="text-white/70">An NPC is nearby</p>
                        <p className="text-white/70">A building is nearby</p>
                        <p className="text-white/70">Find the hidden treasure</p>
                        <p className="text-white/70">Defeat the dungeon boss</p>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsExpanded(true)}
                    className="w-full p-2 text-white/70 hover:text-white/90 text-xs flex items-center justify-center gap-2"
                >
                    <i className="fas fa-chevron-up"></i>
                    <span>Show Updates</span>
                </button>
            )}
        </div>
    );
}
