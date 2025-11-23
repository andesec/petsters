'use client';

import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

export default function Header() {
  return (
    <header className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-3 py-1.5 md:py-2.5 z-[1200] shadow-lg">
      <div className="flex items-center justify-between max-w-[2000px] mx-auto">
        {/* Left: Hamburger (Always visible) */}
        <div>
          <button
            className="text-white text-lg md:text-xl hover:scale-110 transition-transform"
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
