'use client';

import { usePathname } from 'next/navigation';
import BattleUpdates from '@/components/battle/BattleUpdates';
import Joystick from '@/components/map/Joystick';

export default function RightSidebar() {
    const pathname = usePathname();

    return (
        <div className="w-full md:w-[25%] bg-white border border-slate-400 shadow-md rounded-[10px] p-[10px] overflow-y-auto h-auto md:h-full">
            {pathname === '/battle' && <BattleUpdates />}
            {pathname === '/map' && <Joystick />}
            {pathname !== '/battle' && pathname !== '/map' && <div>Right Sidebar</div>}
        </div>
    );
}
