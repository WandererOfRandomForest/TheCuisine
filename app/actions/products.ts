"use server";
import { prisma } from "../lib/prisma";

export async function getProductsByState(stateName: string) {
  const products = await prisma.product.findMany({
    where: {
      state: stateName
    }
  });

  return products;
}
