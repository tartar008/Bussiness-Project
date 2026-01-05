/*
  Warnings:

  - Made the column `buyer_name` on table `buyer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `license_number` on table `buyer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contact_person` on table `buyer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `buyer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `buyer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `province_id` on table `buyer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `district_id` on table `buyer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `buyer_id` on table `buyer_farmer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `farmer_id` on table `buyer_farmer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `buyer_farmer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `province_id` on table `district` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name_th` on table `district` required. This step will fail if there are existing NULL values in that column.
  - Made the column `buyer_id` on table `driver` required. This step will fail if there are existing NULL values in that column.
  - Made the column `driver_name` on table `driver` required. This step will fail if there are existing NULL values in that column.
  - Made the column `driver_surname` on table `driver` required. This step will fail if there are existing NULL values in that column.
  - Made the column `license_number` on table `driver` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `driver` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `driver` required. This step will fail if there are existing NULL values in that column.
  - Made the column `farmer_id` on table `farmbook` required. This step will fail if there are existing NULL values in that column.
  - Made the column `farmbook_type_id` on table `farmbook` required. This step will fail if there are existing NULL values in that column.
  - Made the column `farmbook_number` on table `farmbook` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `farmbook` required. This step will fail if there are existing NULL values in that column.
  - Made the column `farmbook_id` on table `farmbook_plot` required. This step will fail if there are existing NULL values in that column.
  - Made the column `plot_id` on table `farmbook_plot` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `farmbook_plot` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name_th` on table `farmbook_type` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `farmbook_type` required. This step will fail if there are existing NULL values in that column.
  - Made the column `farmer_name` on table `farmer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `farmer_surname` on table `farmer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `citizen_id` on table `farmer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `farmer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `buyer_id` on table `farmer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `farmer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `farmer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `farmer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `prifix` on table `farmer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `document_number` on table `land_document` required. This step will fail if there are existing NULL values in that column.
  - Made the column `document_type` on table `land_document` required. This step will fail if there are existing NULL values in that column.
  - Made the column `issued_date` on table `land_document` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `land_document` required. This step will fail if there are existing NULL values in that column.
  - Made the column `farmer_id` on table `plot` required. This step will fail if there are existing NULL values in that column.
  - Made the column `land_code` on table `plot` required. This step will fail if there are existing NULL values in that column.
  - Made the column `province_id` on table `plot` required. This step will fail if there are existing NULL values in that column.
  - Made the column `district_id` on table `plot` required. This step will fail if there are existing NULL values in that column.
  - Made the column `land_document_id` on table `plot` required. This step will fail if there are existing NULL values in that column.
  - Made the column `deed_type` on table `plot` required. This step will fail if there are existing NULL values in that column.
  - Made the column `area_rai` on table `plot` required. This step will fail if there are existing NULL values in that column.
  - Made the column `area_ngan` on table `plot` required. This step will fail if there are existing NULL values in that column.
  - Made the column `area_wah` on table `plot` required. This step will fail if there are existing NULL values in that column.
  - Made the column `area_acre` on table `plot` required. This step will fail if there are existing NULL values in that column.
  - Made the column `geometry_type` on table `plot` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_owned_before_2020` on table `plot` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `plot` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `plot` required. This step will fail if there are existing NULL values in that column.
  - Made the column `plot_id` on table `plot_document` required. This step will fail if there are existing NULL values in that column.
  - Made the column `file_name` on table `plot_document` required. This step will fail if there are existing NULL values in that column.
  - Made the column `file_type` on table `plot_document` required. This step will fail if there are existing NULL values in that column.
  - Made the column `file_url` on table `plot_document` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `plot_document` required. This step will fail if there are existing NULL values in that column.
  - Made the column `plot_id` on table `plot_geometry` required. This step will fail if there are existing NULL values in that column.
  - Made the column `coordinates` on table `plot_geometry` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `plot_geometry` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status_value` on table `plot_status_link` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name_th` on table `province` required. This step will fail if there are existing NULL values in that column.
  - Made the column `transaction_date` on table `receiving_transaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `buyer_id` on table `receiving_transaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `farmer_id` on table `receiving_transaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `plot_id` on table `receiving_transaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vehicle_id` on table `receiving_transaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `driver_id` on table `receiving_transaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `weight_raw` on table `receiving_transaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `weight_after_calc` on table `receiving_transaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quality_score` on table `receiving_transaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `receiving_transaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `farmbook_id` on table `status` required. This step will fail if there are existing NULL values in that column.
  - Made the column `plot_id` on table `status` required. This step will fail if there are existing NULL values in that column.
  - Made the column `added_at` on table `status` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name_th` on table `status` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `status` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status_receiving_name` on table `status_receiving_transaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `status_receiving_transaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `plot_id` on table `validations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `date` on table `validations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `result` on table `validations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `officer` on table `validations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `remark` on table `validations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `buyer_id` on table `vehicle` required. This step will fail if there are existing NULL values in that column.
  - Made the column `plate_number` on table `vehicle` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vehicle_type` on table `vehicle` required. This step will fail if there are existing NULL values in that column.
  - Made the column `brand` on table `vehicle` required. This step will fail if there are existing NULL values in that column.
  - Made the column `model` on table `vehicle` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `vehicle` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vehicle_id` on table `vehicle_driver` required. This step will fail if there are existing NULL values in that column.
  - Made the column `driver_id` on table `vehicle_driver` required. This step will fail if there are existing NULL values in that column.
  - Made the column `buyer_id` on table `vehicle_driver` required. This step will fail if there are existing NULL values in that column.
  - Made the column `assigned_date` on table `vehicle_driver` required. This step will fail if there are existing NULL values in that column.
  - Made the column `released_date` on table `vehicle_driver` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "buyer_farmer" DROP CONSTRAINT "buyer_farmer_buyer_id_fkey";

-- DropForeignKey
ALTER TABLE "buyer_farmer" DROP CONSTRAINT "buyer_farmer_farmer_id_fkey";

-- DropForeignKey
ALTER TABLE "district" DROP CONSTRAINT "district_province_id_fkey";

-- DropForeignKey
ALTER TABLE "driver" DROP CONSTRAINT "driver_buyer_id_fkey";

-- DropForeignKey
ALTER TABLE "farmbook" DROP CONSTRAINT "farmbook_farmbook_type_id_fkey";

-- DropForeignKey
ALTER TABLE "farmbook" DROP CONSTRAINT "farmbook_farmer_id_fkey";

-- DropForeignKey
ALTER TABLE "farmbook_plot" DROP CONSTRAINT "farmbook_plot_farmbook_id_fkey";

-- DropForeignKey
ALTER TABLE "farmbook_plot" DROP CONSTRAINT "farmbook_plot_plot_id_fkey";

-- DropForeignKey
ALTER TABLE "farmer" DROP CONSTRAINT "farmer_buyer_id_fkey";

-- DropForeignKey
ALTER TABLE "plot" DROP CONSTRAINT "plot_district_id_fkey";

-- DropForeignKey
ALTER TABLE "plot" DROP CONSTRAINT "plot_farmer_id_fkey";

-- DropForeignKey
ALTER TABLE "plot" DROP CONSTRAINT "plot_land_document_id_fkey";

-- DropForeignKey
ALTER TABLE "plot" DROP CONSTRAINT "plot_province_id_fkey";

-- DropForeignKey
ALTER TABLE "plot_document" DROP CONSTRAINT "plot_document_plot_id_fkey";

-- DropForeignKey
ALTER TABLE "plot_geometry" DROP CONSTRAINT "plot_geometry_plot_id_fkey";

-- DropForeignKey
ALTER TABLE "receiving_transaction" DROP CONSTRAINT "receiving_transaction_buyer_id_fkey";

-- DropForeignKey
ALTER TABLE "receiving_transaction" DROP CONSTRAINT "receiving_transaction_driver_id_fkey";

-- DropForeignKey
ALTER TABLE "receiving_transaction" DROP CONSTRAINT "receiving_transaction_farmer_id_fkey";

-- DropForeignKey
ALTER TABLE "receiving_transaction" DROP CONSTRAINT "receiving_transaction_plot_id_fkey";

-- DropForeignKey
ALTER TABLE "receiving_transaction" DROP CONSTRAINT "receiving_transaction_vehicle_id_fkey";

-- DropForeignKey
ALTER TABLE "validations" DROP CONSTRAINT "validations_plot_id_fkey";

-- DropForeignKey
ALTER TABLE "vehicle" DROP CONSTRAINT "vehicle_buyer_id_fkey";

-- DropForeignKey
ALTER TABLE "vehicle_driver" DROP CONSTRAINT "vehicle_driver_buyer_id_fkey";

-- DropForeignKey
ALTER TABLE "vehicle_driver" DROP CONSTRAINT "vehicle_driver_driver_id_fkey";

-- DropForeignKey
ALTER TABLE "vehicle_driver" DROP CONSTRAINT "vehicle_driver_vehicle_id_fkey";

-- AlterTable
ALTER TABLE "buyer" ALTER COLUMN "buyer_name" SET NOT NULL,
ALTER COLUMN "license_number" SET NOT NULL,
ALTER COLUMN "contact_person" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "province_id" SET NOT NULL,
ALTER COLUMN "district_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "buyer_farmer" ALTER COLUMN "buyer_id" SET NOT NULL,
ALTER COLUMN "farmer_id" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "district" ALTER COLUMN "province_id" SET NOT NULL,
ALTER COLUMN "name_th" SET NOT NULL;

-- AlterTable
ALTER TABLE "driver" ALTER COLUMN "buyer_id" SET NOT NULL,
ALTER COLUMN "driver_name" SET NOT NULL,
ALTER COLUMN "driver_surname" SET NOT NULL,
ALTER COLUMN "license_number" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "farmbook" ALTER COLUMN "farmer_id" SET NOT NULL,
ALTER COLUMN "farmbook_type_id" SET NOT NULL,
ALTER COLUMN "farmbook_number" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "farmbook_plot" ALTER COLUMN "farmbook_id" SET NOT NULL,
ALTER COLUMN "plot_id" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "farmbook_type" ALTER COLUMN "name_th" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "farmer" ALTER COLUMN "farmer_name" SET NOT NULL,
ALTER COLUMN "farmer_surname" SET NOT NULL,
ALTER COLUMN "citizen_id" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "buyer_id" SET NOT NULL,
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "prifix" SET NOT NULL;

-- AlterTable
ALTER TABLE "land_document" ALTER COLUMN "document_number" SET NOT NULL,
ALTER COLUMN "document_type" SET NOT NULL,
ALTER COLUMN "issued_date" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "plot" ALTER COLUMN "farmer_id" SET NOT NULL,
ALTER COLUMN "land_code" SET NOT NULL,
ALTER COLUMN "province_id" SET NOT NULL,
ALTER COLUMN "district_id" SET NOT NULL,
ALTER COLUMN "land_document_id" SET NOT NULL,
ALTER COLUMN "deed_type" SET NOT NULL,
ALTER COLUMN "area_rai" SET NOT NULL,
ALTER COLUMN "area_ngan" SET NOT NULL,
ALTER COLUMN "area_wah" SET NOT NULL,
ALTER COLUMN "area_acre" SET NOT NULL,
ALTER COLUMN "geometry_type" SET NOT NULL,
ALTER COLUMN "is_owned_before_2020" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "plot_document" ALTER COLUMN "plot_id" SET NOT NULL,
ALTER COLUMN "file_name" SET NOT NULL,
ALTER COLUMN "file_type" SET NOT NULL,
ALTER COLUMN "file_url" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "plot_geometry" ALTER COLUMN "plot_id" SET NOT NULL,
ALTER COLUMN "coordinates" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "plot_status_link" ALTER COLUMN "status_value" SET NOT NULL;

-- AlterTable
ALTER TABLE "province" ALTER COLUMN "name_th" SET NOT NULL;

-- AlterTable
ALTER TABLE "receiving_transaction" ALTER COLUMN "transaction_date" SET NOT NULL,
ALTER COLUMN "buyer_id" SET NOT NULL,
ALTER COLUMN "farmer_id" SET NOT NULL,
ALTER COLUMN "plot_id" SET NOT NULL,
ALTER COLUMN "vehicle_id" SET NOT NULL,
ALTER COLUMN "driver_id" SET NOT NULL,
ALTER COLUMN "weight_raw" SET NOT NULL,
ALTER COLUMN "weight_after_calc" SET NOT NULL,
ALTER COLUMN "quality_score" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "status" ALTER COLUMN "farmbook_id" SET NOT NULL,
ALTER COLUMN "plot_id" SET NOT NULL,
ALTER COLUMN "added_at" SET NOT NULL,
ALTER COLUMN "name_th" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "status_receiving_transaction" ALTER COLUMN "status_receiving_name" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "validations" ALTER COLUMN "plot_id" SET NOT NULL,
ALTER COLUMN "date" SET NOT NULL,
ALTER COLUMN "result" SET NOT NULL,
ALTER COLUMN "officer" SET NOT NULL,
ALTER COLUMN "remark" SET NOT NULL;

-- AlterTable
ALTER TABLE "vehicle" ALTER COLUMN "buyer_id" SET NOT NULL,
ALTER COLUMN "plate_number" SET NOT NULL,
ALTER COLUMN "vehicle_type" SET NOT NULL,
ALTER COLUMN "brand" SET NOT NULL,
ALTER COLUMN "model" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "vehicle_driver" ALTER COLUMN "vehicle_id" SET NOT NULL,
ALTER COLUMN "driver_id" SET NOT NULL,
ALTER COLUMN "buyer_id" SET NOT NULL,
ALTER COLUMN "assigned_date" SET NOT NULL,
ALTER COLUMN "released_date" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "district" ADD CONSTRAINT "district_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "province"("province_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farmer" ADD CONSTRAINT "farmer_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "buyer"("buyer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plot" ADD CONSTRAINT "plot_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "district"("district_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plot" ADD CONSTRAINT "plot_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "farmer"("farmer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plot" ADD CONSTRAINT "plot_land_document_id_fkey" FOREIGN KEY ("land_document_id") REFERENCES "land_document"("land_document_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plot" ADD CONSTRAINT "plot_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "province"("province_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle" ADD CONSTRAINT "vehicle_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "buyer"("buyer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "driver" ADD CONSTRAINT "driver_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "buyer"("buyer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plot_document" ADD CONSTRAINT "plot_document_plot_id_fkey" FOREIGN KEY ("plot_id") REFERENCES "plot"("plot_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farmbook" ADD CONSTRAINT "farmbook_farmbook_type_id_fkey" FOREIGN KEY ("farmbook_type_id") REFERENCES "farmbook_type"("farmbook_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farmbook" ADD CONSTRAINT "farmbook_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "farmer"("farmer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farmbook_plot" ADD CONSTRAINT "farmbook_plot_farmbook_id_fkey" FOREIGN KEY ("farmbook_id") REFERENCES "farmbook"("farmbook_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farmbook_plot" ADD CONSTRAINT "farmbook_plot_plot_id_fkey" FOREIGN KEY ("plot_id") REFERENCES "plot"("plot_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receiving_transaction" ADD CONSTRAINT "receiving_transaction_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "buyer"("buyer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receiving_transaction" ADD CONSTRAINT "receiving_transaction_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "driver"("driver_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receiving_transaction" ADD CONSTRAINT "receiving_transaction_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "farmer"("farmer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receiving_transaction" ADD CONSTRAINT "receiving_transaction_plot_id_fkey" FOREIGN KEY ("plot_id") REFERENCES "plot"("plot_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receiving_transaction" ADD CONSTRAINT "receiving_transaction_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicle"("vehicle_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buyer_farmer" ADD CONSTRAINT "buyer_farmer_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "buyer"("buyer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buyer_farmer" ADD CONSTRAINT "buyer_farmer_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "farmer"("farmer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_driver" ADD CONSTRAINT "vehicle_driver_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "buyer"("buyer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_driver" ADD CONSTRAINT "vehicle_driver_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "driver"("driver_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_driver" ADD CONSTRAINT "vehicle_driver_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicle"("vehicle_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "validations" ADD CONSTRAINT "validations_plot_id_fkey" FOREIGN KEY ("plot_id") REFERENCES "plot"("plot_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plot_geometry" ADD CONSTRAINT "plot_geometry_plot_id_fkey" FOREIGN KEY ("plot_id") REFERENCES "plot"("plot_id") ON DELETE RESTRICT ON UPDATE CASCADE;
