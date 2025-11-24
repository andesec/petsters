'use client';

import { usePathname } from 'next/navigation';
import BattleUpdates from '@/components/battle/BattleUpdates';
import Joystick from '@/components/map/Joystick';

export default function RightSidebar({ className }: { className?: string }) {
    const pathname = usePathname();

    // Determine content based on current page
    let content = null;
    let title = '';

    if (pathname === '/battle') {
        content = <BattleUpdates />;
        title = 'Battle Updates';
    } else if (pathname === '/map') {
        content = <Joystick />;
        title = 'Map Controls';
    }

    // Don't render anything if no content
    if (!content) return null;

    return (
        <div className={`
            flex-[0_0_calc(35%-0.25rem)] md:flex-[0_0_auto]
            md:w-[280px] lg:w-[320px]
            bg-card/95 backdrop-blur-xl
            border border-border/50 md:border-border
            shadow-2xl md:shadow-lg
            rounded-xl
            overflow-hidden
            ${className || ''}
        `}>
            <div className="p-3 md:p-5 h-full overflow-y-auto">
                {/* Mobile: Show title inline, Desktop: Component handles its own title */}
                <div className="md:hidden mb-2">
                    <p className="font-medium text-sm text-foreground">{title}</p>
                </div>

                {content}
            </div>
        </div>
    );
}
