"use client"

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import MainContent from './MainContent';
import BottomPanel from './BottomPanel';

export default function GameLayout({ children }: { children: React.ReactNode }) {
    const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
    const pathname = usePathname();

    // Make toggle function available globally via window object for Header to call
    useEffect(() => {
        if (typeof window !== 'undefined') {
            (window as any).toggleLeftSidebar = () => setIsLeftSidebarOpen(prev => !prev);
        }
    }, []);

    // Determine if bottom panel is visible (only on map page on mobile)
    const hasBottomPanel = pathname === '/map';

    return (
        <div className={`flex h-[calc(100vh-60px)] gap-2 p-2 ${hasBottomPanel ? 'pb-40' : 'pb-2'} md:gap-3 md:p-3 md:pb-3 relative overflow-hidden bg-gradient-to-br from-background via-background to-secondary/20`}>
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

            {/* Mobile Right Sidebar Drawer (Updates) - NO BACKDROP */}
            {isRightSidebarOpen && (
                <div className="md:hidden">
                    {/* Right Drawer */}
                    <div className="fixed top-0 right-0 bottom-0 z-[95] w-[280px] bg-card/95 backdrop-blur-xl border-l border-border shadow-2xl">
                        <div className="h-full flex flex-col p-3 pt-14 overflow-hidden">
                            <button
                                onClick={() => setIsRightSidebarOpen(false)}
                                className="absolute top-3 right-3 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <i className="fas fa-times text-sm"></i>
                            </button>
                            <div className="flex-1 overflow-y-auto">
                                <RightSidebar className="border-none shadow-none bg-transparent" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
                <MainContent>{children}</MainContent>
            </div>

            {/* Desktop Right Sidebar - Always visible */}
            <div className="hidden md:block md:w-[280px] lg:w-[320px] flex-shrink-0">
                <RightSidebar />
            </div>

            {/* Mobile Bottom Panel - Shows game updates/notifications */}
            <BottomPanel />
        </div>
    );
}
