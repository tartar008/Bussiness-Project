/*
  Warnings:

  - You are about to drop the column `farmbook_type_id` on the `farmbook` table. All the data in the column will be lost.
  - You are about to drop the column `deed_type` on the `plot` table. All the data in the column will be lost.
  - You are about to drop the `farmbook_type` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "farmbook" DROP CONSTRAINT "farmbook_farmbook_type_id_fkey";

-- DropForeignKey
ALTER TABLE "plot" DROP CONSTRAINT "plot_land_document_id_fkey";

-- AlterTable
ALTER TABLE "farmbook" DROP COLUMN "farmbook_type_id",
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "plot" DROP COLUMN "deed_type",
ALTER COLUMN "land_document_id" DROP NOT NULL;

-- DropTable
DROP TABLE "farmbook_type";

-- CreateTable
CREATE TABLE "land_document_type" (
    "land_document_type_id" BIGSERIAL NOT NULL,
    "name_th" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "land_document_type_pkey" PRIMARY KEY ("land_document_type_id")
);

-- AddForeignKey
ALTER TABLE "plot" ADD CONSTRAINT "plot_land_document_id_fkey" FOREIGN KEY ("land_document_id") REFERENCES "land_document"("land_document_id") ON DELETE SET NULL ON UPDATE CASCADE;
