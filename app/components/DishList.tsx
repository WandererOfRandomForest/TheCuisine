"use client";

import React from "react";
import { Dish } from "../lib/data";
import { ShoppingBag } from "lucide-react";

interface DishListProps {
  stateName: string;
  dishes: Dish[];
  onBuyNow: (dish: Dish) => void;
}

export default function DishList({ stateName, dishes, onBuyNow }: DishListProps) {
  if (dishes.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto py-12 px-6 text-center">
        <h2 className="text-3xl font-bold font-outfit mb-4 text-gray-800">
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
          <span className="text-amber-600 font-semibold tracking-wider text-sm uppercase">Authentic Selection</span>
          <h2 className="text-4xl font-bold font-outfit text-gray-900 mt-1">
            Taste of {stateName}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {dishes.map((dish) => (
          <div key={dish.id} className="premium-card flex flex-col overflow-hidden group">
            <div className="h-64 overflow-hidden relative bg-gray-100">
              <img 
                src={dish.image} 
                alt={dish.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold font-outfit text-gray-900">{dish.name}</h3>
                <span className="text-lg font-semibold text-amber-600">₹{dish.price}</span>
              </div>
              
              <p className="text-gray-600 flex-1 leading-relaxed">{dish.description}</p>
              
              <button 
                onClick={() => onBuyNow(dish)}
                className="mt-6 w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors shadow-lg shadow-amber-600/20 active:scale-[0.98]"
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
