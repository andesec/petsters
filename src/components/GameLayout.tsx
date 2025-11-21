"use client"

import { useState } from 'react';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import MainContent from './MainContent';

export default function GameLayout({ children }: { children: React.ReactNode }) {
    const [isLeftSidebarFloating, setIsLeftSidebarFloating] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [mobileSidebarView, setMobileSidebarView] = useState<'left' | 'right'>('left');

    const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

    return (
        <div className="flex h-[calc(100vh-60px)] gap-3 p-3 relative overflow-hidden bg-gradient-to-br from-background via-background to-secondary/20">
            {/* Mobile Search/Sidebar Toggle Button - Search icon when closed */}
            <button
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                className="md:hidden fixed bottom-6 right-6 z-50 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
                aria-label="Toggle search"
            >
                <i className={`fas fa-search text-xl`}></i>
            </button>

            {/* Mobile Sidebar Backdrop */}
            {isMobileSidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/70 z-[60] backdrop-blur-md animate-in fade-in duration-300"
                    onClick={closeMobileSidebar}
                ></div>
            )}

            {/* Mobile Sidebar - Centered Popup Modal */}
            {isMobileSidebarOpen && (
                <div className="md:hidden fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
                    <div className="w-full max-w-md max-h-[85vh] bg-[#f0f4f8] dark:bg-[#1e293b] rounded-2xl shadow-2xl pointer-events-auto animate-in zoom-in-95 fade-in duration-300 flex flex-col overflow-hidden border border-border/50">
                        {/* Header with Close Button */}
                        <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
                            <h2 className="text-lg font-bold text-foreground">Search & Info</h2>
                            <button
                                onClick={closeMobileSidebar}
                                className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive"
                                aria-label="Close"
                            >
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>

                        {/* Tab Switcher - Refined Design */}
                        <div className="flex p-3 gap-2 bg-muted/30">
                            <button
                                onClick={() => setMobileSidebarView('left')}
                                className={`flex-1 py-2.5 px-4 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${mobileSidebarView === 'left'
                                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                                    : 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-accent'
                                    }`}
                            >
                                <i className="fas fa-search text-sm"></i>
                                <span>Search</span>
                            </button>
                            <button
                                onClick={() => setMobileSidebarView('right')}
                                className={`flex-1 py-2.5 px-4 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${mobileSidebarView === 'right'
                                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                                    : 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-accent'
                                    }`}
                            >
                                <i className="fas fa-bell text-sm"></i>
                                <span>Updates</span>
                            </button>
                        </div>

                        {/* Sidebar Content */}
                        <div className="flex-1 overflow-auto p-4">
                            {mobileSidebarView === 'left' ? (
                                <div className="h-full">
                                    <LeftSidebar isFloating={false} />
                                </div>
                            ) : (
                                <div className="h-full">
                                    <RightSidebar />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Left Sidebar - Desktop only */}
            {!isLeftSidebarFloating && (
                <div className="hidden md:block md:w-[280px] lg:w-[320px] flex-shrink-0">
                    <LeftSidebar
                        isFloating={false}
                        toggleFloating={() => setIsLeftSidebarFloating(true)}
                    />
                </div>
            )}

            {/* Floating Sidebar - rendered outside flex flow */}
            {isLeftSidebarFloating && (
                <LeftSidebar
                    isFloating={true}
                    toggleFloating={() => setIsLeftSidebarFloating(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
                <MainContent>{children}</MainContent>
            </div>

            {/* Right Sidebar - Desktop only */}
            <div className="hidden md:block md:w-[280px] lg:w-[320px] flex-shrink-0">
                <RightSidebar />
            </div>
        </div>
    );
}
