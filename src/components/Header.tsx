'use client';

import { useEffect, useMemo, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from './auth/AuthProvider';

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Check sidebar state periodically
  useEffect(() => {
    const checkSidebarState = () => {
      if (typeof window !== 'undefined') {
        const sidebarApi = window as typeof window & {
          isLeftSidebarOpen?: () => boolean;
        };

        if (sidebarApi.isLeftSidebarOpen) {
          setIsSidebarOpen(sidebarApi.isLeftSidebarOpen());
        }
      }
    };

    // Check immediately and set up interval
    checkSidebarState();
    const interval = setInterval(checkSidebarState, 100);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const userLabel = useMemo(() => {
    if (!user || typeof user !== 'object') return 'Guest';

    const name = typeof (user as Record<string, unknown>).name === 'string' ? (user as Record<string, string>).name : null;
    const email = typeof (user as Record<string, unknown>).email === 'string' ? (user as Record<string, string>).email : null;
    const username = typeof (user as Record<string, unknown>).username === 'string'
      ? (user as Record<string, string>).username
      : null;

    return name || email || username || 'User';
  }, [user]);

  const statusLabel = loading ? 'Checking session...' : isAuthenticated ? 'Online' : 'Logged out';

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
                if (typeof window !== 'undefined') {
                  const sidebarApi = window as typeof window & {
                    toggleLeftSidebar?: () => void;
                  };

                  sidebarApi.toggleLeftSidebar?.();
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

        {/* Right: User Status + Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 text-white">
          <div className="hidden sm:flex flex-col items-end leading-tight">
            <span className="text-xs md:text-sm font-semibold drop-shadow-sm">{userLabel}</span>
            <span className="text-[11px] md:text-xs text-white/85">{statusLabel}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleLogout}
              disabled={loading || isLoggingOut || !isAuthenticated}
              className="px-3 py-1 text-xs md:text-sm font-semibold rounded-lg bg-white/15 hover:bg-white/25 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {isLoggingOut ? 'Signing out...' : 'Logout'}
            </button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
