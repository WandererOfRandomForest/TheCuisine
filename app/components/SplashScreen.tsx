"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen() {
  const [show, setShow] = useState(true);
  const [render, setRender] = useState(true);

  useEffect(() => {
    // Total animation: 
    // 11 letters * 0.08s = ~0.9s + 0.6s animation time = 1.5s total typing time
    // Slowed down animation: 3.0s duration + 0.2s delay = 3.2s.
    // Let it rest for 0.8s. Hide at 4.0s.
    const hideTimer = setTimeout(() => {
      setShow(false);
    }, 4000);

    const cleanupTimer = setTimeout(() => {
      setRender(false);
    }, 5000); // wait for 1s opacity transition

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(cleanupTimer);
    };
  }, []);

  if (!render) return null;



  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#380903] transition-opacity duration-1000 ease-in-out ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      {/* 
        Instead of guessing fonts, we use the actual logo file and apply a CSS mask (clip-path) 
        to reveal it from left to right, mimicking a writing/unveiling effect! 
      */}
      <style>{`
        @keyframes wipe-reveal {
          0% { clip-path: polygon(0 0, 0 0, 0 100%, 0% 100%); opacity: 0; }
          1% { opacity: 1; }
          100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%); opacity: 1; }
        }
      `}</style>
      
      <Image
        src="/images/Logo.jpeg"
        alt="The Cuisine Loading"
        width={400}
        height={200}
        className="h-32 md:h-48 w-auto object-contain drop-shadow-xl"
        style={{
          animation: 'wipe-reveal 3s cubic-bezier(0.25, 1, 0.5, 1) forwards',
          animationDelay: '0.2s',
          opacity: 0 // Start hidden until animation begins
        }}
        priority
      />
    </div>
  );
}
