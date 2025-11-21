'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-5 py-3 z-[1200] shadow-lg">
      <div className="flex items-center justify-between max-w-[2000px] mx-auto">
        <div className="flex items-center gap-4">
          <h1 className="text-white text-2xl font-bold tracking-tight">Petsters</h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/map" className="text-white/90 no-underline text-sm font-medium hover:text-white hover:scale-105 transition-all duration-200">Map</Link>
          <Link href="/profile" className="text-white/90 no-underline text-sm font-medium hover:text-white hover:scale-105 transition-all duration-200">Profile</Link>
          <Link href="/gyms" className="text-white/90 no-underline text-sm font-medium hover:text-white hover:scale-105 transition-all duration-200">Gyms</Link>
          <Link href="/party" className="text-white/90 no-underline text-sm font-medium hover:text-white hover:scale-105 transition-all duration-200">Party</Link>
          <div className="ml-2 border-l border-white/20 pl-4">
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile Controls */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <button
            className="text-white text-2xl hover:scale-110 transition-transform"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <i className={mobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <nav className="absolute top-full left-0 right-0 bg-indigo-600/95 backdrop-blur-lg flex flex-col md:hidden shadow-xl border-t border-white/10">
          <Link
            href="/map"
            className="text-white no-underline text-base px-5 py-3 hover:bg-white/10 border-b border-white/10 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Map
          </Link>
          <Link
            href="/profile"
            className="text-white no-underline text-base px-5 py-3 hover:bg-white/10 border-b border-white/10 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Profile
          </Link>
          <Link
            href="/gyms"
            className="text-white no-underline text-base px-5 py-3 hover:bg-white/10 border-b border-white/10 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Gyms
          </Link>
          <Link
            href="/party"
            className="text-white no-underline text-base px-5 py-3 hover:bg-white/10 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Party
          </Link>
        </nav>
      )}
    </header>
  );
}
