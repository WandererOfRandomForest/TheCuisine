"use client";

import Image from "next/image";
import { ShoppingBag } from "lucide-react";

interface DishData {
  id: string;
  name: string;
  description?: string | null;
  price?: number | null;
  image?: string | null;
}

interface DishListProps {
  stateName: string;
  dishes: DishData[];
  onBuyNow: (dish: DishData) => void;
}

export default function DishList({ stateName, dishes, onBuyNow }: DishListProps) {
  if (dishes.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto py-12 px-6 text-center">
        <h2 className="text-3xl font-bold font-playfair mb-4 text-[#1A1A1A]">
          Dishes from {stateName}
        </h2>
        <div className="premium-card p-12 bg-gray-50 flex flex-col items-center justify-center text-gray-400">
          <ShoppingBag size={48} className="mb-4 opacity-20" />
          <p className="text-lg">No dishes available for {stateName} yet.</p>
          <p className="text-sm mt-2">Check back soon as we add more authentic recipes!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-6">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <span className="text-[#FFE170] font-semibold tracking-wider text-sm uppercase">Authentic Selection</span>
          <h2 className="text-5xl font-bold font-playfair text-[#1A1A1A] mt-2">
            Taste of {stateName}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {dishes.map((dish) => (
          <div key={dish.id} className="premium-card flex flex-col overflow-hidden group">
            <div className="h-64 overflow-hidden relative bg-gray-100">
              <Image 
                src={dish.image || "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80"} 
                alt={dish.name} 
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-3xl font-bold font-playfair text-[#1A1A1A]">{dish.name}</h3>
                <span className="text-xl font-semibold text-[#FFE170]">
                  {dish.price ? `₹${dish.price}` : "ND"}
                </span>
              </div>
              
              <p className="text-gray-600 flex-1 leading-relaxed">{dish.description || "Fresh local authentic delivery."}</p>
              
              <button 
                onClick={() => onBuyNow(dish)}
                className="mt-6 w-full py-3 bg-[#FFE170] text-[#380903] rounded-xl font-semibold hover:bg-[#FFD100] transition-colors shadow-lg shadow-[#FFE170]/20 active:scale-[0.98]"
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
