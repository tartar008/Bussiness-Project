/*
  Warnings:

  - You are about to drop the column `subdistrict_id` on the `buyer` table. All the data in the column will be lost.
  - You are about to drop the column `subdistrict_id` on the `plot` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "buyer" DROP COLUMN "subdistrict_id";

-- AlterTable
ALTER TABLE "plot" DROP COLUMN "subdistrict_id";

-- AlterTable
ALTER TABLE "status" ALTER COLUMN "farmbook_id" SET DATA TYPE TEXT,
ALTER COLUMN "plot_id" SET DATA TYPE TEXT,
ALTER COLUMN "added_at" SET DATA TYPE TEXT;
