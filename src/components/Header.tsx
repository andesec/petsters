'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="flex items-center justify-between bg-[#3f51b5] px-5 py-2.5 relative z-[1200]">
      <h1 className="text-white text-2xl font-bold">Petsters</h1>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-[15px]">
        <Link href="/map" className="text-white no-underline text-base hover:underline">Map</Link>
        <Link href="/profile" className="text-white no-underline text-base hover:underline">Profile</Link>
        <Link href="/gyms" className="text-white no-underline text-base hover:underline">Gyms</Link>
        <Link href="/party" className="text-white no-underline text-base hover:underline">Party</Link>
      </nav>

      {/* Mobile Hamburger Button */}
      <button
        className="md:hidden text-white text-2xl"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <i className={mobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
      </button>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <nav className="absolute top-full left-0 right-0 bg-[#3f51b5] flex flex-col md:hidden shadow-lg">
          <Link
            href="/map"
            className="text-white no-underline text-base px-5 py-3 hover:bg-[#303f9f] border-b border-[#303f9f]"
            onClick={() => setMobileMenuOpen(false)}
          >
            Map
          </Link>
          <Link
            href="/profile"
            className="text-white no-underline text-base px-5 py-3 hover:bg-[#303f9f] border-b border-[#303f9f]"
            onClick={() => setMobileMenuOpen(false)}
          >
            Profile
          </Link>
          <Link
            href="/gyms"
            className="text-white no-underline text-base px-5 py-3 hover:bg-[#303f9f] border-b border-[#303f9f]"
            onClick={() => setMobileMenuOpen(false)}
          >
            Gyms
          </Link>
          <Link
            href="/party"
            className="text-white no-underline text-base px-5 py-3 hover:bg-[#303f9f]"
            onClick={() => setMobileMenuOpen(false)}
          >
            Party
          </Link>
        </nav>
      )}
    </header>
  );
}
