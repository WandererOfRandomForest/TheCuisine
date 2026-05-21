"use client";

import React, { useState } from "react";
import { X, Minus, Plus, Loader2, MessageSquare, CheckCircle } from "lucide-react";
import { createDbOrder } from "../actions/checkout";

interface DishData {
  id: string;
  name: string;
  description?: string | null;
  price?: number | null;
  image?: string | null;
}

interface CheckoutModalProps {
  dish: DishData;
  stateName: string;
  onClose: () => void;
}

export default function CheckoutModal({ dish, stateName, onClose }: CheckoutModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState(stateName);
  const [pincode, setPincode] = useState("");

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");

  const dishPrice = dish.price || 0;
  const netPrice = dishPrice * quantity;

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !address || !city || !state || !pincode) {
      alert("Please fill in all the details.");
      return;
    }

    setLoading(true);

    try {
      const res = await createDbOrder({
        dishId: dish.id,
        quantity,
        customerName: name,
        email,
        phone,
        billingAddress: address,
        billingCity: city,
        billingState: state,
        billingPincode: pincode,
      });

      if (res.success && res.orderId) {
        setCreatedOrderId(res.orderId);
        
        // Build the WhatsApp message
        const rawNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";
        const whatsappNumber = rawNumber.replace(/\D/g, "");
        const formattedDate = new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });

        const messageText = 
`*THE CUISINE - ORDER INVOICE* 🧾
---------------------------------------
*Order ID:* #${res.orderId}
*Date:* ${formattedDate}

*ORDER DETAILS:*
• *Item:* ${dish.name}
• *Quantity:* ${quantity} package(s)
• *Price:* ₹${dishPrice} per package
• *Total Amount:* *₹${netPrice}*

*CUSTOMER DETAILS:*
• *Name:* ${name}
• *Phone:* ${phone}
• *Email:* ${email}

*DELIVERY ADDRESS:*
${address}
${city}, ${state} - ${pincode}
---------------------------------------
_This is an automated order request. Please confirm availability and delivery details._`;

        const encodedMessage = encodeURIComponent(messageText);
        const waUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;
        
        setWhatsappUrl(waUrl);
        setOrderSuccess(true);

        // Open WhatsApp in a new window/tab
        window.open(waUrl, "_blank");
      } else {
        alert(res.message || "Failed to place order. Please try again.");
      }
    } catch (err) {
      console.error("Checkout submission error:", err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#380903]/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-[#FAF3E7] w-full max-w-lg rounded-3xl overflow-hidden border border-[#380903]/10 shadow-[0_20px_50px_rgba(56,9,3,0.3)] max-h-[90vh] flex flex-col relative animate-[fade-in-up_0.3s_ease-out_forwards]">
        
        {/* Header */}
        <div className="p-6 border-b border-[#380903]/10 flex items-center justify-between bg-white/30 backdrop-blur-sm sticky top-0 z-10">
          <div>
            <h3 className="text-2xl font-bold font-playfair text-[#380903]">
              {orderSuccess ? "Order Confirmed!" : "Checkout Order"}
            </h3>
            <p className="text-xs text-[#380903]/60 font-medium uppercase tracking-wider mt-1">
              {dish.name} from {stateName}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#380903]/5 text-[#380903] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {orderSuccess ? (
          /* Success Screen */
          <div className="p-8 flex-1 overflow-y-auto flex flex-col items-center justify-center text-center">
            <CheckCircle className="w-16 h-16 text-[#380903] mb-4 animate-bounce" />
            <h4 className="text-2xl font-bold font-playfair text-[#380903] mb-2">
              Order Placed Successfully!
            </h4>
            <p className="text-gray-600 mb-6 max-w-sm">
              Your order ID is <strong className="text-[#380903]">#{createdOrderId}</strong>. We are redirecting you to WhatsApp to complete your purchase details.
            </p>
            
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-[#FFE170] text-[#380903] hover:bg-[#FFD100] rounded-2xl font-bold tracking-wide transition-all shadow-lg shadow-[#FFE170]/20 active:scale-[0.98] flex items-center justify-center gap-2 mb-4"
            >
              <MessageSquare size={18} />
              Open WhatsApp Manually
            </a>
            
            <button 
              onClick={onClose}
              className="text-sm font-semibold text-[#380903] hover:underline"
            >
              Back to Dishes
            </button>
          </div>
        ) : (
          /* Form Screen */
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            
            {/* Dish Summary & Quantity */}
            <div className="bg-white/50 border border-[#380903]/5 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">{dish.name}</p>
                <p className="text-sm text-gray-500">₹{dishPrice} per package</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="w-8 h-8 rounded-full border border-[#380903]/20 flex items-center justify-center text-[#380903] hover:bg-[#380903]/5 active:scale-90 transition-all font-bold"
                >
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center font-bold text-[#380903]">{quantity}</span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="w-8 h-8 rounded-full border border-[#380903]/20 flex items-center justify-center text-[#380903] hover:bg-[#380903]/5 active:scale-90 transition-all font-bold"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#380903] uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-3 rounded-xl border border-[#380903]/20 bg-white/70 focus:border-[#380903] focus:ring-1 focus:ring-[#380903] outline-none transition-all placeholder:text-gray-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#380903] uppercase tracking-wider mb-2">
                    WhatsApp Phone Number
                  </label>
                  <input 
                    type="tel" 
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full px-4 py-3 rounded-xl border border-[#380903]/20 bg-white/70 focus:border-[#380903] focus:ring-1 focus:ring-[#380903] outline-none transition-all placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#380903] uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. john@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-[#380903]/20 bg-white/70 focus:border-[#380903] focus:ring-1 focus:ring-[#380903] outline-none transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#380903] uppercase tracking-wider mb-2">
                  Delivery Address
                </label>
                <input 
                  type="text" 
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Flat/House No., Street Name, Locality"
                  className="w-full px-4 py-3 rounded-xl border border-[#380903]/20 bg-white/70 focus:border-[#380903] focus:ring-1 focus:ring-[#380903] outline-none transition-all placeholder:text-gray-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#380903] uppercase tracking-wider mb-2">
                    City
                  </label>
                  <input 
                    type="text" 
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Bhubaneswar"
                    className="w-full px-4 py-3 rounded-xl border border-[#380903]/20 bg-white/70 focus:border-[#380903] focus:ring-1 focus:ring-[#380903] outline-none transition-all placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#380903] uppercase tracking-wider mb-2">
                    State
                  </label>
                  <input 
                    type="text" 
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Odisha"
                    className="w-full px-4 py-3 rounded-xl border border-[#380903]/20 bg-white/70 focus:border-[#380903] focus:ring-1 focus:ring-[#380903] outline-none transition-all placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#380903] uppercase tracking-wider mb-2">
                    Pincode
                  </label>
                  <input 
                    type="text" 
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="751001"
                    className="w-full px-4 py-3 rounded-xl border border-[#380903]/20 bg-white/70 focus:border-[#380903] focus:ring-1 focus:ring-[#380903] outline-none transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Price Summary & Submit */}
            <div className="pt-6 pb-2 border-t border-[#380903]/10 space-y-4 bg-[#FAF3E7] sticky bottom-0 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500 font-sans">Net Total Price</p>
                  <p className="text-xs text-gray-400">Includes packaging & GST</p>
                </div>
                <p className="text-3xl font-extrabold text-[#380903] font-sans">
                  ₹{netPrice}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#FFE170] text-[#380903] hover:bg-[#FFD100] disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-bold tracking-wide transition-all shadow-lg shadow-[#FFE170]/10 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing Order...
                  </>
                ) : (
                  <>
                    <MessageSquare size={18} />
                    Confirm Order via WhatsApp
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
