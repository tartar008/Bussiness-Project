-- DropForeignKey
ALTER TABLE "farmer" DROP CONSTRAINT "farmer_buyer_id_fkey";

-- AlterTable
ALTER TABLE "farmer" ALTER COLUMN "buyer_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "farmer" ADD CONSTRAINT "farmer_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "buyer"("buyer_id") ON DELETE SET NULL ON UPDATE CASCADE;
