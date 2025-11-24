"use client"

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import MainContent from './MainContent';

export default function GameLayout({ children }: { children: React.ReactNode }) {
    const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
    const pathname = usePathname();

    // Make toggle function available globally via window object for Header to call
    useEffect(() => {
        if (typeof window !== 'undefined') {
            (window as any).toggleLeftSidebar = () => setIsLeftSidebarOpen(prev => !prev);
            (window as any).isLeftSidebarOpen = () => isLeftSidebarOpen;
        }
    }, [isLeftSidebarOpen]);

    // Determine if right sidebar has content for this page
    const hasRightSidebar = pathname === '/battle' || pathname === '/map';

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-60px)] gap-2 p-2 md:gap-3 md:p-3 relative overflow-hidden bg-gradient-to-br from-background via-background to-secondary/20">
            {/* Left Sidebar - Floating overlay matching header theme */}
            <div
                className={`
                    fixed top-0 bottom-0 left-0 z-[90] w-[280px] md:w-[320px]
                    bg-gradient-to-b from-blue-500/95 via-indigo-500/95 to-purple-500/95 
                    dark:from-slate-900/95 dark:via-purple-950/95 dark:to-slate-900/95
                    backdrop-blur-xl 
                    border-r border-white/10
                    shadow-2xl
                    rounded-r-2xl
                    transition-transform duration-300 ease-in-out
                    ${isLeftSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="h-full flex flex-col p-3 pt-[68px] overflow-hidden">
                    <div className="flex-1 overflow-y-auto text-white">
                        <LeftSidebar />
                    </div>
                </div>
            </div>

            {/* Main Content - Takes remaining space after accounting for sidebar */}
            <div className={`
                ${hasRightSidebar ? 'flex-[0_0_calc(65%-0.25rem)]' : 'flex-1'} 
                md:flex-1 
                overflow-hidden
            `}>
                <MainContent>{children}</MainContent>
            </div>

            {/* Right Sidebar - Takes 35% on mobile when present, normal width on desktop */}
            <RightSidebar />
        </div>
    );
}
