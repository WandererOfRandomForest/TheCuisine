"use client";

import { useState } from "react";
import IndiaMap from "./components/IndiaMap";
import DishList from "./components/DishList";
import { getDishesByState, Dish } from "./lib/data";
import { createRazorpayOrder, generateShiprocketOrder } from "./actions/checkout";

export default function Home() {
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  const [selectedStateName, setSelectedStateName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStateClick = (stateId: string, stateName: string) => {
    setSelectedStateId(stateId);
    setSelectedStateName(stateName);
    
    // Smooth scroll down to dishes
    setTimeout(() => {
      document.getElementById("dishes-section")?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleBuyNow = async (dish: Dish) => {
    try {
      setIsProcessing(true);
      alert(`[Frontend] Initiating Checkout for ${dish.name}...`);
      
      const order = await createRazorpayOrder(dish.id, dish.price);
      
      if (order.success && order.orderId) {
        alert(`[Frontend] Razorpay Order Created: ${order.orderId}. Simulating successful payment...`);
        
        // Simulate Webhook / Frontend callback after successful payment window
        const shipment = await generateShiprocketOrder(`pay_mock_${Math.random().toString(36).substring(2)}`, { name: "User", address: "Localhost 3000" });
        alert(`[Frontend] Success! Shiprocket Shipment ID: ${shipment.shipment_id}`);
      }
    } catch (e) {
      alert("Error during checkout.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 text-center max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold font-outfit text-gray-900 mb-6 tracking-tight">
          Discover the authentic taste of <span className="text-amber-500">The Cuisine</span>
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Hover over the map to select a state and explore traditional dishes crafted with local ingredients and rich history. Hand-picked premium selections shipped directly to you.
        </p>
      </section>

      {/* Map Section */}
      <section id="map" className="py-8 px-6">
        <IndiaMap onStateClick={handleStateClick} />
        {!selectedStateName && (
          <p className="text-center text-sm text-gray-400 mt-6 animate-pulse">
            Click on a state (e.g. Odisha) to view regional cuisine.
          </p>
        )}
      </section>

      {/* Dishes Section */}
      {selectedStateId && selectedStateName && (
        <section id="dishes-section" className="py-12 bg-white">
          <DishList 
            stateName={selectedStateName} 
            dishes={getDishesByState(selectedStateId)} 
            onBuyNow={handleBuyNow} 
          />
        </section>
      )}
    </div>
  );
}
