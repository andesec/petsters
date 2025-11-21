'use client';

import { usePathname } from 'next/navigation';
import BattleUpdates from '@/components/battle/BattleUpdates';
import Joystick from '@/components/map/Joystick';

export default function RightSidebar({ className }: { className?: string }) {
    const pathname = usePathname();

    return (
        <div className={`bg-card/95 backdrop-blur-sm border border-border shadow-lg rounded-xl p-5 overflow-y-auto h-auto md:h-full ${className || ''}`}>
            {pathname === '/battle' && <BattleUpdates />}
            {pathname === '/map' && <Joystick />}
            {pathname !== '/battle' && pathname !== '/map' && (
                <div className="text-muted-foreground text-center py-8">
                    <i className="fas fa-info-circle text-4xl mb-3 opacity-50"></i>
                    <p>Right Sidebar</p>
                </div>
            )}
        </div>
    );
}
