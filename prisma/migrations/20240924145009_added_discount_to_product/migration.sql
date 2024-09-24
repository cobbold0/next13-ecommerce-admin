-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "discount" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
ADD COLUMN     "discountedPrice" DECIMAL(65,30);
