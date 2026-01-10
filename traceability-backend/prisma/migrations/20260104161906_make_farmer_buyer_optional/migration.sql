/*
  Warnings:

  - You are about to drop the `farmer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "buyer_farmer" DROP CONSTRAINT "buyer_farmer_farmer_id_fkey";

-- DropForeignKey
ALTER TABLE "farmbook" DROP CONSTRAINT "farmbook_farmer_id_fkey";

-- DropForeignKey
ALTER TABLE "farmer" DROP CONSTRAINT "farmer_buyer_id_fkey";

-- DropForeignKey
ALTER TABLE "plot" DROP CONSTRAINT "plot_farmer_id_fkey";

-- DropForeignKey
ALTER TABLE "receiving_transaction" DROP CONSTRAINT "receiving_transaction_farmer_id_fkey";

-- DropTable
DROP TABLE "farmer";

-- CreateTable
CREATE TABLE "Farmer" (
    "farmerId" BIGSERIAL NOT NULL,
    "prefix" TEXT NOT NULL,
    "farmerName" TEXT NOT NULL,
    "farmerSurname" TEXT NOT NULL,
    "citizenId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "buyerBuyerId" BIGINT,

    CONSTRAINT "Farmer_pkey" PRIMARY KEY ("farmerId")
);

-- AddForeignKey
ALTER TABLE "Farmer" ADD CONSTRAINT "Farmer_buyerBuyerId_fkey" FOREIGN KEY ("buyerBuyerId") REFERENCES "buyer"("buyer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plot" ADD CONSTRAINT "plot_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "Farmer"("farmerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farmbook" ADD CONSTRAINT "farmbook_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "Farmer"("farmerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receiving_transaction" ADD CONSTRAINT "receiving_transaction_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "Farmer"("farmerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buyer_farmer" ADD CONSTRAINT "buyer_farmer_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "Farmer"("farmerId") ON DELETE RESTRICT ON UPDATE CASCADE;
