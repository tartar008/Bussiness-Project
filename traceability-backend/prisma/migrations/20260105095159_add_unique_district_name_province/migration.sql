/*
  Warnings:

  - A unique constraint covering the columns `[name_th,province_id]` on the table `district` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "district_name_th_province_id_key" ON "district"("name_th", "province_id");
