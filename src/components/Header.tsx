'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Check sidebar state periodically
  useEffect(() => {
    const checkSidebarState = () => {
      if (typeof window !== 'undefined' && (window as any).isLeftSidebarOpen) {
        setIsSidebarOpen((window as any).isLeftSidebarOpen());
      }
    };

    // Check immediately and set up interval
    checkSidebarState();
    const interval = setInterval(checkSidebarState, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 dark:from-slate-900 dark:via-indigo-950 dark:to-purple-950 px-3 py-1.5 md:py-2.5 z-[1200] shadow-lg">
      <div className="flex items-center justify-between max-w-[1496px] mx-auto">
        {/* Left: Hamburger (Always visible) */}
        <div>
          <button
            className={`text-white text-lg md:text-xl transition-all duration-300 p-2 hover:scale-110 hover:brightness-150 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] ${isSidebarOpen
              ? 'bg-white/20 scale-110 rounded-lg'
              : ''
              }`}
            onClick={() => {
              if (typeof window !== 'undefined' && (window as any).toggleLeftSidebar) {
                (window as any).toggleLeftSidebar();
              }
            }}
            aria-label="Toggle menu"
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>

        {/* Center: Title (Always centered) */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <h1 className="text-white text-base md:text-xl font-bold tracking-tight">Petsters</h1>
        </div>

        {/* Right: Theme Toggle */}
        <div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
