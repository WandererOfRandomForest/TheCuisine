"use server";

import { prisma } from "../lib/prisma";

interface OrderInput {
  dishId: string;
  quantity: number;
  customerName: string;
  email: string;
  phone: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingPincode: string;
}

interface CreateOrderResult {
  success: boolean;
  orderId?: string;
  amount?: number;
  message?: string;
}

/**
 * Creates an Order in the local PostgreSQL database
 */
export async function createDbOrder(input: OrderInput): Promise<CreateOrderResult> {
  try {
    console.log(`[Backend] Creating DB order for Dish ID: ${input.dishId} | Qty: ${input.quantity}`);

    const product = await prisma.product.findUnique({
      where: { id: input.dishId },
    });

    if (!product) {
      return { success: false, message: "Product not found" };
    }

    const productPrice = product.price;
    if (productPrice === null) {
      return { success: false, message: "Product price is not determined" };
    }

    const netPrice = productPrice * input.quantity;

    // Create order and order item in a database transaction
    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          amount: netPrice,
          paymentStatus: "PENDING", // PENDING since payment is completed manual/whatsapp
          orderStatus: "NEW",
          productName: product.name,
          productPrice: productPrice,
          productQuantity: input.quantity,
          customerFirstName: input.customerName,
          email: input.email,
          phone: input.phone,
          billingAddress: input.billingAddress,
          billingCity: input.billingCity,
          billingState: input.billingState,
          billingPincode: input.billingPincode,
          billingCountry: "India",
        },
      });

      await tx.orderItem.create({
        data: {
          orderId: createdOrder.id,
          productId: product.id,
          quantity: input.quantity,
          priceAtPurchase: productPrice,
        },
      });

      return createdOrder;
    });

    return {
      success: true,
      orderId: order.id,
      amount: netPrice,
    };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Order Creation Error:", err);
    return {
      success: false,
      message: err.message || "Failed to create order in database",
    };
  }
}
