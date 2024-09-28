/*
  Warnings:

  - You are about to drop the column `delivered` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "delivered",
ADD COLUMN     "isDelivered" BOOLEAN NOT NULL DEFAULT false;
