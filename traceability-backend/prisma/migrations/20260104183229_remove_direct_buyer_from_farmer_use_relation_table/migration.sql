/*
  Warnings:

  - You are about to drop the column `buyerBuyerId` on the `Farmer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Farmer" DROP CONSTRAINT "Farmer_buyerBuyerId_fkey";

-- AlterTable
ALTER TABLE "Farmer" DROP COLUMN "buyerBuyerId";
