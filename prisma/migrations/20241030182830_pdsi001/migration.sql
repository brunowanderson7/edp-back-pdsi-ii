-- CreateEnum
CREATE TYPE "MeterStatus" AS ENUM ('SCHEDULED', 'RECEIVED', 'TESTING', 'REHEARSED', 'APPROVED', 'DISCARDED');

-- CreateEnum
CREATE TYPE "Reason" AS ENUM ('SH', 'CR', 'WS', 'DM');

-- CreateTable
CREATE TABLE "token" (
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "manager" BOOLEAN NOT NULL DEFAULT false,
    "date" BOOLEAN NOT NULL DEFAULT false,
    "schedule" BOOLEAN NOT NULL DEFAULT false,
    "reschedule" BOOLEAN NOT NULL DEFAULT false,
    "ratm" BOOLEAN NOT NULL DEFAULT false,
    "model" BOOLEAN NOT NULL DEFAULT false,
    "discard" BOOLEAN NOT NULL DEFAULT false,
    "consult" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "is_user_approved" BOOLEAN NOT NULL DEFAULT false,
    "is_email_approved" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "is_banned" BOOLEAN NOT NULL DEFAULT false,
    "is_Ower" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "model" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "voltage" TEXT NOT NULL,
    "current" TEXT NOT NULL,
    "wires" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "constant" TEXT NOT NULL,

    CONSTRAINT "model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meter" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "instalation" TEXT NOT NULL,
    "toi" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "csd" TEXT NOT NULL,
    "customer_data" TEXT NOT NULL,
    "customer_present" BOOLEAN NOT NULL,
    "scheduled_observations" TEXT,
    "model_id" INTEGER,
    "storage_location" TEXT,
    "delivered_by" TEXT,
    "entry_observations" TEXT,

    CONSTRAINT "meter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "date" (
    "date" TEXT NOT NULL,
    "schedules" JSONB[]
);

-- CreateTable
CREATE TABLE "schedule" (
    "id" SERIAL NOT NULL,
    "meter_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "date_date" TEXT NOT NULL,
    "schedule" TEXT NOT NULL,
    "status" "MeterStatus" DEFAULT 'SCHEDULED',
    "reason" "Reason" NOT NULL,
    "history" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ratm" (
    "id" TEXT NOT NULL,
    "analyzeOrder" TEXT NOT NULL,
    "client_accompanied" BOOLEAN NOT NULL,
    "rehearsal_visual" TEXT NOT NULL,
    "dielectric" TEXT NOT NULL,
    "seal_involucro" TEXT NOT NULL,
    "status_involucro" TEXT NOT NULL,
    "seal1" TEXT NOT NULL,
    "status_lacre1" TEXT NOT NULL,
    "seal2" TEXT NOT NULL,
    "status_lacre2" TEXT NOT NULL,
    "reading_meter" TEXT NOT NULL,
    "table_test" TEXT NOT NULL,
    "cn" TEXT NOT NULL,
    "ci" TEXT NOT NULL,
    "cp" TEXT NOT NULL,
    "cnri" TEXT NOT NULL,
    "cnrc" TEXT NOT NULL,
    "march" TEXT NOT NULL,
    "register" TEXT NOT NULL,
    "phase_interrupted" TEXT NOT NULL,
    "code_irregularity" TEXT NOT NULL,
    "description_irregularity" TEXT NOT NULL,
    "observations_irregularity" TEXT NOT NULL,
    "meter_broken" BOOLEAN NOT NULL,
    "display_off" BOOLEAN NOT NULL,
    "ease_access" BOOLEAN NOT NULL,
    "coil_damaged" BOOLEAN NOT NULL,
    "apparently_order" BOOLEAN NOT NULL,
    "failed_dielectric" BOOLEAN NOT NULL,
    "strange_body" BOOLEAN NOT NULL,
    "burnt_borne" BOOLEAN NOT NULL,
    "photo_urls" TEXT[],
    "updated_at" TIMESTAMP(3) NOT NULL,
    "meter_id" TEXT NOT NULL,

    CONSTRAINT "ratm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "signature" (
    "token" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "ratm_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "token_user_id_key" ON "token"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_user_id_key" ON "permissions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "model_name_key" ON "model"("name");

-- CreateIndex
CREATE UNIQUE INDEX "meter_number_key" ON "meter"("number");

-- CreateIndex
CREATE UNIQUE INDEX "date_date_key" ON "date"("date");

-- CreateIndex
CREATE UNIQUE INDEX "schedule_meter_id_key" ON "schedule"("meter_id");

-- CreateIndex
CREATE UNIQUE INDEX "signature_token_key" ON "signature"("token");

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meter" ADD CONSTRAINT "meter_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "model"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule" ADD CONSTRAINT "schedule_meter_id_fkey" FOREIGN KEY ("meter_id") REFERENCES "meter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule" ADD CONSTRAINT "schedule_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule" ADD CONSTRAINT "schedule_date_date_fkey" FOREIGN KEY ("date_date") REFERENCES "date"("date") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratm" ADD CONSTRAINT "ratm_meter_id_fkey" FOREIGN KEY ("meter_id") REFERENCES "meter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "signature" ADD CONSTRAINT "signature_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "signature" ADD CONSTRAINT "signature_ratm_id_fkey" FOREIGN KEY ("ratm_id") REFERENCES "ratm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
