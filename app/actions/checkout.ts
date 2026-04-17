"use server";

interface CheckoutResult {
  success: boolean;
  orderId?: string;
  amount?: number;
  currency?: string;
  message?: string;
}

/**
 * MOCK: Initiate a Razorpay Order
 * In a real scenario, you'd use razorpay-node:
 * const instance = new Razorpay({ key_id: '...', key_secret: '...' });
 * instance.orders.create({ amount: dish.price * 100, currency: "INR" })
 */
export async function createRazorpayOrder(dishId: string, price: number): Promise<CheckoutResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  console.log(`[Backend] Creating Razorpay order for Dish: ${dishId} | Amount: ₹${price}`);

  return {
    success: true,
    orderId: `order_mock_${Math.random().toString(36).substring(2, 10)}`, // Dummy Order ID
    amount: price * 100, // Razorpay takes amounts in lowest denominator (paise)
    currency: "INR",
  };
}

/**
 * MOCK: Create Shiprocket Shipment
 * In a real scenario, you would trigger this via a Razorpay Webhook after successful payment.
 */
export async function generateShiprocketOrder(paymentId: string, userDetails: Record<string, unknown>) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  console.log(`[Backend] Payment ${paymentId} verified. Generating Shiprocket Order...`);
  console.log(`[Shiprocket] Forwarding to API with User Details:`, userDetails);

  return {
    success: true,
    shipment_id: `ship_${Math.random().toString(36).substring(2, 10)}`,
    message: "Shipment generated successfully.",
  };
}
