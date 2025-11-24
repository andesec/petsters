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
        }
    }, []);

    // Determine if right sidebar has content for this page
    const hasRightSidebar = pathname === '/battle' || pathname === '/map';

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-60px)] gap-2 p-2 md:gap-3 md:p-3 relative overflow-hidden bg-gradient-to-br from-background via-background to-secondary/20">
            {/* Mobile Left Sidebar Drawer (Only rendered on mobile when open) - NO BACKDROP */}
            {isLeftSidebarOpen && (
                <div className="md:hidden">
                    {/* Left Drawer */}
                    <div className="fixed top-0 left-0 bottom-0 z-[95] w-[280px] bg-card/95 backdrop-blur-xl border-r border-border shadow-2xl">
                        <div className="h-full flex flex-col p-3 pt-14 overflow-hidden">
                            {/* Close Button */}
                            <button
                                onClick={() => setIsLeftSidebarOpen(false)}
                                className="absolute top-3 right-3 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <i className="fas fa-times text-sm"></i>
                            </button>
                            <div className="flex-1 overflow-y-auto">
                                <LeftSidebar />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop Left Sidebar - Toggleable */}
            {isLeftSidebarOpen && (
                <div className="hidden md:block md:w-[280px] lg:w-[320px] flex-shrink-0">
                    <div className="h-full bg-card/95 backdrop-blur-xl border border-border shadow-lg rounded-xl p-3 overflow-hidden relative">
                        <button
                            onClick={() => setIsLeftSidebarOpen(false)}
                            className="absolute top-2 right-2 z-10 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <i className="fas fa-times text-sm"></i>
                        </button>
                        <div className="h-full overflow-y-auto">
                            <LeftSidebar />
                        </div>
                    </div>
                </div>
            )}

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
