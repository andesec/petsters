'use client';

import { usePathname } from 'next/navigation';
import BattleUpdates from '@/components/battle/BattleUpdates';
import Joystick from '@/components/map/Joystick';

export default function RightSidebar({ className }: { className?: string }) {
    const pathname = usePathname();

    // Determine content based on current page
    let content = null;

    if (pathname === '/battle') {
        content = <BattleUpdates />;
    } else if (pathname === '/map') {
        content = <Joystick />;
    }

    // Don't render anything if no content
    if (!content) return null;

    return (
        <div className={`
            ${className || 'flex-[0_0_calc(35%-0.25rem)] md:flex-[0_0_auto] md:w-[280px] lg:w-[320px]'}
            bg-card/95 backdrop-blur-xl
            shadow-2xl md:shadow-lg
            rounded-xl
            overflow-hidden
        `}>
            <div className="p-3 md:p-5 h-full overflow-y-auto">
                {content}
            </div>
        </div>
    );
}
