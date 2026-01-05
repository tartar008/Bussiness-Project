/*
  Warnings:

  - A unique constraint covering the columns `[name_th]` on the table `province` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "province_name_th_key" ON "province"("name_th");
