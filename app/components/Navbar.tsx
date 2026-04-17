"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    
    // Check initial position
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 px-8 py-4 flex justify-between items-center backdrop-blur-md transition-all duration-700 ease-in-out ${
        scrolled 
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
      <nav className={`hidden md:flex gap-8 text-sm font-medium transition-colors duration-700 ease-in-out ${
        scrolled ? "text-[#FFE170]" : "text-[#380903]"
      }`}>
        <Link href="/" className="hover:opacity-60 transition-opacity">Home</Link>
        <a href="#map" className="hover:opacity-60 transition-opacity">Explore States</a>
        <a href="#contact" className="hover:opacity-60 transition-opacity">Contact</a>
      </nav>
    </header>
  );
}
