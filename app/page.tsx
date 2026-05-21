"use client";

import { useState } from "react";
import IndiaMap from "./components/IndiaMap";
import DishList from "./components/DishList";
import { ChevronDown, MapPin, Phone, Mail } from "lucide-react";
import { getProductsByState } from "./actions/products";
import CheckoutModal from "./components/CheckoutModal";

interface DishData {
  id: string;
  name: string;
  description?: string | null;
  price?: number | null;
  image?: string | null;
}

export default function Home() {
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  const [selectedStateName, setSelectedStateName] = useState<string | null>(null);
  const [dbDishes, setDbDishes] = useState<DishData[]>([]);
  const [checkoutDish, setCheckoutDish] = useState<DishData | null>(null);

  const handleStateClick = async (stateId: string, stateName: string) => {
    setSelectedStateId(stateId);
    setSelectedStateName(stateName);
    
    // Fetch newly seeded products from DB
    try {
      const dbProducts = await getProductsByState(stateName);
      setDbDishes(dbProducts as DishData[]);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }

    // Smooth scroll down to dishes
    setTimeout(() => {
      document.getElementById("dishes-section")?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleBuyNow = (dish: DishData) => {
    setCheckoutDish(dish);
  };

  return (
    <div className="min-h-screen bg-[#FAF3E7] text-[#1A1A1A]">
      {/* Hero Section */}
      <div className="bg-[#FFE170] text-[#380903] min-h-[calc(100vh-88px)] flex flex-col justify-center overflow-hidden">
        <section className="px-6 text-center max-w-4xl mx-auto flex flex-col items-center py-8">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold font-playfair mb-4 tracking-tight leading-tight opacity-0 animate-[fade-in-up_1s_ease-out_forwards]">
            Discover the authentic taste of <br className="hidden md:block" />
            <span className="text-[#380903]">The Cuisine</span>
          </h1>
          <p className="text-base md:text-xl opacity-0 animate-[fade-in-up_1s_ease-out_0.3s_forwards] leading-relaxed max-w-2xl font-medium mb-8 text-[#380903]/90">
            Hover over the map to select a state and explore traditional dishes crafted with local ingredients and rich history. Hand-picked premium selections shipped directly to you.
          </p>
          <div className="opacity-0 animate-[fade-in-up_1s_ease-out_0.6s_forwards]">
            <a href="#map" className="inline-flex items-center justify-center p-3 rounded-full bg-[#380903]/10 hover:bg-[#380903]/20 transition-all hover:scale-110 group">
              <ChevronDown className="w-6 h-6 text-[#380903] animate-bounce group-hover:animate-none" />
            </a>
          </div>
        </section>
      </div>

      {/* Map Section */}
      <section id="map" className="scroll-mt-[88px] min-h-[calc(100vh-88px)] flex flex-col items-center justify-center py-8 px-6">
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center">
          <IndiaMap onStateClick={handleStateClick} />
          {!selectedStateName && (
            <p className="text-center text-sm mt-8 animate-pulse text-[#380903]/70 font-medium">
              Click on a state (e.g. Odisha) to view regional cuisine.
            </p>
          )}
        </div>
      </section>

      {/* Dishes Section */}
      {selectedStateId && selectedStateName && (
        <section id="dishes-section" className="scroll-mt-[88px] py-12 bg-[#FAF3E7]">
          <DishList 
            stateName={selectedStateName} 
            dishes={dbDishes} 
            onBuyNow={handleBuyNow} 
          />
        </section>
      )}

      {checkoutDish && selectedStateName && (
        <CheckoutModal
          dish={checkoutDish}
          stateName={selectedStateName}
          onClose={() => setCheckoutDish(null)}
        />
      )}

      {/* Contact Us Section */}
      <section id="contact" className="py-20 px-6 bg-[#380903] text-[#FAF3E7] scroll-mt-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#FFE170] font-semibold tracking-wider text-sm uppercase">Get in touch</span>
            <h2 className="text-4xl md:text-5xl font-bold font-playfair text-[#FFE170] mt-4">
              Contact Us
            </h2>
            <p className="mt-6 text-lg opacity-90 max-w-2xl mx-auto">
              We&apos;re passionate about bringing authentic regional flavors straight to your table. Having trouble with an order or just want to say hi? We&apos;d love to hear from you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-8 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <MapPin className="w-8 h-8 mb-4 text-[#FFE170]" strokeWidth={1.5} />
              <h3 className="text-xl font-bold font-playfair mb-3 text-white">Our Kitchen</h3>
              <p className="opacity-80 font-medium">123 Spice Route, New Delhi<br/>India 110001</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-8 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <Phone className="w-8 h-8 mb-4 text-[#FFE170]" strokeWidth={1.5} />
              <h3 className="text-xl font-bold font-playfair mb-3 text-white">Phone</h3>
              <p className="opacity-80 font-medium">+91 98765 43210<br/>Mon-Fri, 9am - 6pm</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-8 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <Mail className="w-8 h-8 mb-4 text-[#FFE170]" strokeWidth={1.5} />
              <h3 className="text-xl font-bold font-playfair mb-3 text-white">Email</h3>
              <p className="opacity-80 font-medium">hello@thecuisine.com<br/>Support 24/7</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
