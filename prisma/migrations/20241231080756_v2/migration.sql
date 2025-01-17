-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('ACCEPTED', 'DECLINED', 'UNDER_REVIEW', 'VERIFIED');

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "address" TEXT,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Attribute" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "url" TEXT,
    "storeId" TEXT NOT NULL,

    CONSTRAINT "Attribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kyc" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "selfieImage" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "identityDocumentFront" TEXT NOT NULL,
    "identityDocumentBack" TEXT,
    "document_id" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "other_names" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "sex" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "dateIssued" TEXT NOT NULL,
    "dateOfExpire" TEXT NOT NULL,
    "status" "KycStatus" NOT NULL DEFAULT 'ACCEPTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kyc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttributeForm" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttributeForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormComponent" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "inputType" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormComponent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Attribute_storeId_idx" ON "Attribute"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "Kyc_storeId_key" ON "Kyc"("storeId");
