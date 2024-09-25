import { Decimal } from "@prisma/client/runtime/library";

/**
 * Calculates the discounted price based on the original price and discount percentage.
 * @param originalPrice - The original price of the product.
 * @param discountPercent - The discount percentage to be applied.
 * @returns The discounted price.
 */
export function calculateDiscountPrice(
  originalPrice: number,
  discountPercent: number
): number {
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error(
      "Invalid discount percentage. It must be between 0 and 100."
    );
  }

  if (discountPercent == 0) {
    return 0;
  }

  const discountAmount = (originalPrice * discountPercent) / 100;
  return originalPrice - discountAmount;
}

export const checkForProductAmount = (
  originalPrice: Decimal,
  discountedPrice: Decimal | null
): any => {
  if (discountedPrice != null && discountedPrice.gt(0)) {
    return discountedPrice;
  }
  return originalPrice;
};
