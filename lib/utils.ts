import { FullProduct } from "@/app/(dashboard)/[storeId]/(routes)/orders/[orderId]/components/order-product-item";
import { OrderItem } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export const formatter = new Intl.NumberFormat('en-US', {
//   style: 'currency',
//   currency: 'USD',
// });

export const formatter = new Intl.NumberFormat("en-GH", {
  style: "currency",
  currency: "GHS",
});

export const getProductPrice = (
  originalPrice: any,
  discountedPrice: any
): number => {
  const dp = discountedPrice as number;
  if (discountedPrice > 0) {
    return discountedPrice;
  }
  return originalPrice;
};

export const calcOrderSubtotal = (order: FullProduct[]): number => {
  let total = 0;
  for (let index = 0; index < order.length; index++) {
    const element = order[index];
    total = total + parseInt(element.product.price.toString());
  }
  return total;
};

export const calcTotalDiscount = (order: FullProduct[]): number => {
  let total = 0;
  for (let index = 0; index < order.length; index++) {
    const element = order[index];
    if (element.product.discountedPrice == null) {
      continue;
    }
    total = total + parseInt(element.product.discountedPrice.toString());
  }
  return total;
};
