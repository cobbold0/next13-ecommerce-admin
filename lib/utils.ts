import { OrderDetailsProduct } from "@/types/OrderDetails";
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

export const calcOrderSubtotal = (order: OrderDetailsProduct[]): number => {
  let total = 0;
  for (let index = 0; index < order.length; index++) {
    const element = order[index];
    total = total + element.price;
  }
  return total;
};

export const calcTotalDiscountPrice = (order: OrderDetailsProduct[]): number => {
  let total = 0;
  for (let index = 0; index < order.length; index++) {
    const element = order[index];
    total = total + getProductPrice(element.price, element.discountedPrice);
  }
  return total;
};

const getValidDiscountPrice = (price?: number | null) => {
  return price || 0.0
}