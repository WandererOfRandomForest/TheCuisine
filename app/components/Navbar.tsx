"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      setScrolled(scrollPos > 20);
    };
    
    // Check initial position
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("touchmove", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchmove", handleScroll);
    };
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 px-6 md:px-8 py-4 flex justify-between items-center backdrop-blur-md transition-all duration-300 ease-in-out ${
        scrolled || isMenuOpen
          ? "bg-[#380903]/95 border-b border-[#FFE170]/20 shadow-lg" 
          : "bg-[#FFE170] border-b border-transparent shadow-none"
      }`}
    >
      <Link href="/" className="flex items-center shrink-0">
        <Image 
          src="/images/Logo.jpeg" 
          alt="The Cuisine Logo" 
          width={120}
          height={48}
          className="h-12 w-auto object-contain rounded-lg shadow-sm"
          priority
        />
      </Link>
      
      {/* Desktop Menu */}
      <nav className={`hidden md:flex gap-8 text-sm font-medium transition-colors duration-300 ease-in-out ${
        scrolled ? "text-[#FFE170]" : "text-[#380903]"
      }`}>
        <Link href="/" className="hover:opacity-60 transition-opacity">Home</Link>
        <a href="#map" className="hover:opacity-60 transition-opacity">Explore States</a>
        <a href="#contact" className="hover:opacity-60 transition-opacity">Contact</a>
      </nav>

      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden p-2 rounded-lg hover:bg-black/5 active:scale-95 transition-all focus:outline-none"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <X className={`w-6 h-6 transition-colors duration-300 ${scrolled || isMenuOpen ? "text-[#FFE170]" : "text-[#380903]"}`} />
        ) : (
          <Menu className={`w-6 h-6 transition-colors duration-300 ${scrolled || isMenuOpen ? "text-[#FFE170]" : "text-[#380903]"}`} />
        )}
      </button>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`absolute top-full left-0 w-full md:hidden bg-[#380903]/98 border-t border-[#FFE170]/10 shadow-2xl backdrop-blur-lg transition-all duration-300 ease-in-out origin-top ${
          isMenuOpen 
            ? "opacity-100 scale-y-100 pointer-events-auto" 
            : "opacity-0 scale-y-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col p-6 gap-5 text-base font-semibold text-[#FFE170]">
          <Link 
            href="/" 
            className="hover:opacity-80 pb-2 border-b border-white/5 active:scale-98 transition-all"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <a 
            href="#map" 
            className="hover:opacity-80 pb-2 border-b border-white/5 active:scale-98 transition-all"
            onClick={() => setIsMenuOpen(false)}
          >
            Explore States
          </a>
          <a 
            href="#contact" 
            className="hover:opacity-80 active:scale-98 transition-all"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
