'use client';

import { useState, useEffect } from 'react';

interface HamburgerMenuProps {
    children: React.ReactNode;
    side?: 'left' | 'right';
    defaultOpen?: boolean;
}

export default function HamburgerMenu({
    children,
    side = 'left',
    defaultOpen = false
}: HamburgerMenuProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [isMobile, setIsMobile] = useState(false);

    // Handle window resize to detect mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setIsOpen(false); // Default to closed on mobile
            } else {
                setIsOpen(defaultOpen); // Reset to default on desktop
            }
        };

        // Initial check
        checkMobile();

        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [defaultOpen]);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Toggle Button (Visible when closed or on mobile) */}
            <button
                onClick={toggleMenu}
                className={`fixed z-[100] top-4 ${side === 'left' ? 'left-4' : 'right-4'} 
                p-3 rounded-xl bg-card/80 backdrop-blur-md border border-border shadow-lg 
                hover:bg-accent hover:text-accent-foreground transition-all duration-300
                ${isOpen && !isMobile ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                aria-label="Toggle Menu"
            >
                <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>

            {/* Backdrop (Mobile only) */}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] animate-in fade-in duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Drawer */}
            <div
                className={`fixed top-0 bottom-0 z-[95] w-[320px] bg-card/95 backdrop-blur-xl border-r border-border shadow-2xl
                transition-transform duration-300 ease-in-out
                ${side === 'left' ? 'left-0 border-r' : 'right-0 border-l'}
                ${isOpen ? 'translate-x-0' : side === 'left' ? '-translate-x-full' : 'translate-x-full'}
                `}
            >
                <div className="h-full flex flex-col p-4 pt-16 overflow-hidden">
                    {/* Close Button (Desktop internal) */}
                    {!isMobile && (
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>
                    )}

                    <div className="flex-1 overflow-y-auto">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
