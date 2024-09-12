/*
  Warnings:

  - You are about to drop the column `customerId` on the `OrderItem` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "OrderItem_customerId_idx";

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "customerId";
