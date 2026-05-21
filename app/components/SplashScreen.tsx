"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen() {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only run on client
    setMounted(true);
    // Trigger fade-in after a micro-delay to let the DOM paint
    const showTimeout = setTimeout(() => {
      setShow(true);
    }, 50);

    // Fade out splash screen after 3.2s
    const hideTimeout = setTimeout(() => {
      setShow(false);
    }, 3200);

    // Completely unmount splash screen after 4.2s (allowing fade transition)
    const cleanupTimeout = setTimeout(() => {
      setMounted(false);
    }, 4200);

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
      clearTimeout(cleanupTimeout);
    };
  }, []);

  // SSR will bypass this completely, rendering the homepage content underneath.
  // This guarantees that if client JS fails or takes time to load, the homepage
  // is still visible and never permanently blocked behind a black screen.
  if (!mounted) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#380903] transition-opacity duration-1000 ease-in-out ${
        show ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <style>{`
        @keyframes scale-fade-reveal {
          0% { 
            transform: scale(0.9); 
            opacity: 0; 
          }
          100% { 
            transform: scale(1); 
            opacity: 1; 
          }
        }
      `}</style>
      
      <Image
        src="/images/Logo.jpeg"
        alt="The Cuisine Loading"
        width={400}
        height={200}
        className="h-32 md:h-48 w-auto object-contain drop-shadow-xl"
        style={{
          animation: 'scale-fade-reveal 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          opacity: 0
        }}
        priority
      />
    </div>
  );
}
