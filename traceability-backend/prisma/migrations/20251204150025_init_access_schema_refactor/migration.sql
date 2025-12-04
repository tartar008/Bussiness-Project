-- CreateTable
CREATE TABLE "province" (
    "province_id" BIGSERIAL NOT NULL,
    "name_th" TEXT,

    CONSTRAINT "province_pkey" PRIMARY KEY ("province_id")
);

-- CreateTable
CREATE TABLE "district" (
    "district_id" BIGSERIAL NOT NULL,
    "province_id" BIGINT,
    "name_th" TEXT,

    CONSTRAINT "district_pkey" PRIMARY KEY ("district_id")
);

-- CreateTable
CREATE TABLE "status" (
    "status_id" BIGSERIAL NOT NULL,
    "farmbook_id" VARCHAR(255),
    "plot_id" VARCHAR(255),
    "added_at" VARCHAR(255),
    "name_th" TEXT,
    "description" TEXT,

    CONSTRAINT "status_pkey" PRIMARY KEY ("status_id")
);

-- CreateTable
CREATE TABLE "status_receiving_transaction" (
    "status_receiving_id" BIGSERIAL NOT NULL,
    "status_receiving_name" TEXT,
    "description" TEXT,

    CONSTRAINT "status_receiving_transaction_pkey" PRIMARY KEY ("status_receiving_id")
);

-- CreateTable
CREATE TABLE "farmbook_type" (
    "farmbook_type_id" BIGSERIAL NOT NULL,
    "name_th" TEXT,
    "description" TEXT,

    CONSTRAINT "farmbook_type_pkey" PRIMARY KEY ("farmbook_type_id")
);

-- CreateTable
CREATE TABLE "buyer" (
    "buyer_id" BIGSERIAL NOT NULL,
    "buyer_name" TEXT,
    "license_number" TEXT,
    "contact_person" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "province_id" BIGINT,
    "district_id" BIGINT,
    "subdistrict_id" BIGINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "buyer_pkey" PRIMARY KEY ("buyer_id")
);

-- CreateTable
CREATE TABLE "farmer" (
    "farmer_id" BIGSERIAL NOT NULL,
    "farmer_name" TEXT,
    "farmer_surname" TEXT,
    "citizen_id" TEXT,
    "phone" TEXT,
    "buyer_id" BIGINT,
    "address" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "farmer_pkey" PRIMARY KEY ("farmer_id")
);

-- CreateTable
CREATE TABLE "plot" (
    "plot_id" BIGSERIAL NOT NULL,
    "farmer_id" BIGINT,
    "land_code" TEXT,
    "province_id" BIGINT,
    "district_id" BIGINT,
    "subdistrict_id" BIGINT,
    "land_document_id" BIGINT,
    "deed_type" TEXT,
    "area_rai" INTEGER,
    "area_ngan" INTEGER,
    "area_wah" INTEGER,
    "area_acre" INTEGER,
    "geometry_type" TEXT,
    "is_owned_before_2020" BOOLEAN,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "plot_pkey" PRIMARY KEY ("plot_id")
);

-- CreateTable
CREATE TABLE "land_document" (
    "land_document_id" BIGSERIAL NOT NULL,
    "document_number" TEXT,
    "document_type" TEXT,
    "issued_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3),

    CONSTRAINT "land_document_pkey" PRIMARY KEY ("land_document_id")
);

-- CreateTable
CREATE TABLE "vehicle" (
    "vehicle_id" BIGSERIAL NOT NULL,
    "buyer_id" BIGINT,
    "plate_number" TEXT,
    "vehicle_type" TEXT,
    "brand" TEXT,
    "model" TEXT,
    "created_at" TIMESTAMP(3),

    CONSTRAINT "vehicle_pkey" PRIMARY KEY ("vehicle_id")
);

-- CreateTable
CREATE TABLE "driver" (
    "driver_id" BIGSERIAL NOT NULL,
    "buyer_id" BIGINT,
    "driver_name" TEXT,
    "driver_surname" TEXT,
    "license_number" TEXT,
    "phone" TEXT,
    "created_at" TIMESTAMP(3),

    CONSTRAINT "driver_pkey" PRIMARY KEY ("driver_id")
);

-- CreateTable
CREATE TABLE "plot_document" (
    "doc_id" BIGSERIAL NOT NULL,
    "plot_id" BIGINT,
    "file_name" TEXT,
    "file_type" TEXT,
    "file_url" TEXT,
    "created_at" TIMESTAMP(3),

    CONSTRAINT "plot_document_pkey" PRIMARY KEY ("doc_id")
);

-- CreateTable
CREATE TABLE "plot_geometry" (
    "geometry_id" BIGSERIAL NOT NULL,
    "plot_id" BIGINT,
    "coordinates" TEXT,
    "created_at" TIMESTAMP(3),

    CONSTRAINT "plot_geometry_pkey" PRIMARY KEY ("geometry_id")
);

-- CreateTable
CREATE TABLE "farmbook" (
    "farmbook_id" BIGSERIAL NOT NULL,
    "farmer_id" BIGINT,
    "farmbook_type_id" BIGINT,
    "farmbook_number" TEXT,
    "created_at" TIMESTAMP(3),

    CONSTRAINT "farmbook_pkey" PRIMARY KEY ("farmbook_id")
);

-- CreateTable
CREATE TABLE "farmbook_plot" (
    "farmbook_plot_id" BIGSERIAL NOT NULL,
    "farmbook_id" BIGINT,
    "plot_id" BIGINT,
    "created_at" TIMESTAMP(3),

    CONSTRAINT "farmbook_plot_pkey" PRIMARY KEY ("farmbook_plot_id")
);

-- CreateTable
CREATE TABLE "receiving_transaction" (
    "transaction_id" BIGSERIAL NOT NULL,
    "transaction_date" TIMESTAMP(3),
    "buyer_id" BIGINT,
    "farmer_id" BIGINT,
    "plot_id" BIGINT,
    "vehicle_id" BIGINT,
    "driver_id" BIGINT,
    "weight_raw" DOUBLE PRECISION,
    "weight_after_calc" DOUBLE PRECISION,
    "quality_score" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3),

    CONSTRAINT "receiving_transaction_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateTable
CREATE TABLE "buyer_farmer" (
    "buyer_farmer_id" BIGSERIAL NOT NULL,
    "buyer_id" BIGINT,
    "farmer_id" BIGINT,
    "created_at" TIMESTAMP(3),

    CONSTRAINT "buyer_farmer_pkey" PRIMARY KEY ("buyer_farmer_id")
);

-- CreateTable
CREATE TABLE "vehicle_driver" (
    "vehicle_driver_id" BIGSERIAL NOT NULL,
    "vehicle_id" BIGINT,
    "driver_id" BIGINT,
    "buyer_id" BIGINT,
    "assigned_date" TIMESTAMP(3),
    "released_date" TIMESTAMP(3),

    CONSTRAINT "vehicle_driver_pkey" PRIMARY KEY ("vehicle_driver_id")
);

-- CreateTable
CREATE TABLE "plot_status_link" (
    "plot_id" BIGINT NOT NULL,
    "status_id" BIGINT NOT NULL,
    "status_value" INTEGER,

    CONSTRAINT "plot_status_link_pkey" PRIMARY KEY ("plot_id","status_id")
);

-- CreateTable
CREATE TABLE "validations" (
    "validation_id" BIGSERIAL NOT NULL,
    "plot_id" BIGINT,
    "date" TIMESTAMP(3),
    "result" TEXT,
    "officer" TEXT,
    "remark" TEXT,

    CONSTRAINT "validations_pkey" PRIMARY KEY ("validation_id")
);

-- AddForeignKey
ALTER TABLE "district" ADD CONSTRAINT "district_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "province"("province_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farmer" ADD CONSTRAINT "farmer_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "buyer"("buyer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plot" ADD CONSTRAINT "plot_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "farmer"("farmer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plot" ADD CONSTRAINT "plot_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "province"("province_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plot" ADD CONSTRAINT "plot_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "district"("district_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plot" ADD CONSTRAINT "plot_land_document_id_fkey" FOREIGN KEY ("land_document_id") REFERENCES "land_document"("land_document_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle" ADD CONSTRAINT "vehicle_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "buyer"("buyer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "driver" ADD CONSTRAINT "driver_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "buyer"("buyer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plot_document" ADD CONSTRAINT "plot_document_plot_id_fkey" FOREIGN KEY ("plot_id") REFERENCES "plot"("plot_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plot_geometry" ADD CONSTRAINT "plot_geometry_plot_id_fkey" FOREIGN KEY ("plot_id") REFERENCES "plot"("plot_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farmbook" ADD CONSTRAINT "farmbook_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "farmer"("farmer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farmbook" ADD CONSTRAINT "farmbook_farmbook_type_id_fkey" FOREIGN KEY ("farmbook_type_id") REFERENCES "farmbook_type"("farmbook_type_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farmbook_plot" ADD CONSTRAINT "farmbook_plot_farmbook_id_fkey" FOREIGN KEY ("farmbook_id") REFERENCES "farmbook"("farmbook_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farmbook_plot" ADD CONSTRAINT "farmbook_plot_plot_id_fkey" FOREIGN KEY ("plot_id") REFERENCES "plot"("plot_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receiving_transaction" ADD CONSTRAINT "receiving_transaction_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "buyer"("buyer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receiving_transaction" ADD CONSTRAINT "receiving_transaction_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "farmer"("farmer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receiving_transaction" ADD CONSTRAINT "receiving_transaction_plot_id_fkey" FOREIGN KEY ("plot_id") REFERENCES "plot"("plot_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receiving_transaction" ADD CONSTRAINT "receiving_transaction_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicle"("vehicle_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receiving_transaction" ADD CONSTRAINT "receiving_transaction_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "driver"("driver_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buyer_farmer" ADD CONSTRAINT "buyer_farmer_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "buyer"("buyer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buyer_farmer" ADD CONSTRAINT "buyer_farmer_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "farmer"("farmer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_driver" ADD CONSTRAINT "vehicle_driver_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicle"("vehicle_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_driver" ADD CONSTRAINT "vehicle_driver_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "driver"("driver_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_driver" ADD CONSTRAINT "vehicle_driver_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "buyer"("buyer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plot_status_link" ADD CONSTRAINT "plot_status_link_plot_id_fkey" FOREIGN KEY ("plot_id") REFERENCES "plot"("plot_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plot_status_link" ADD CONSTRAINT "plot_status_link_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "status"("status_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "validations" ADD CONSTRAINT "validations_plot_id_fkey" FOREIGN KEY ("plot_id") REFERENCES "plot"("plot_id") ON DELETE SET NULL ON UPDATE CASCADE;
