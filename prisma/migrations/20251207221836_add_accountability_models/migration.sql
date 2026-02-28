-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'STATE_NODAL', 'PANCHAYAT', 'CHC_OWNER', 'FARMER');

-- CreateEnum
CREATE TYPE "MachineStatus" AS ENUM ('active', 'idle', 'maintenance', 'offline');

-- CreateEnum
CREATE TYPE "MachineType" AS ENUM ('baler', 'mulcher', 'seeder', 'harvester', 'tiller', 'happy_seeder', 'zero_till_drill');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('underutilization', 'maintenance', 'geofence', 'offline', 'fuel_low', 'anomaly', 'booking_request', 'system_update', 'GEOFENCE_BREACH', 'LOW_UTILIZATION', 'SOS_BURNING', 'SESSION_ANOMALY');

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('low', 'medium', 'high', 'critical');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('open', 'acknowledged', 'resolved', 'dismissed');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "NewsCategory" AS ENUM ('milestone', 'announcement', 'achievement', 'event');

-- CreateEnum
CREATE TYPE "TelemetryStatus" AS ENUM ('IDLE', 'ACTIVE', 'MOVING', 'OFFLINE');

-- CreateEnum
CREATE TYPE "ComplaintType" AS ENUM ('STUBBLE_BURNING', 'MACHINE_NOT_WORKING', 'OPERATOR_ABSENT', 'BOOKING_NOT_HONORED', 'OTHER');

-- CreateEnum
CREATE TYPE "ComplaintStatus" AS ENUM ('OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'DISMISSED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'FARMER',
    "phone" TEXT,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "panchayat_id" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Machine" (
    "id" TEXT NOT NULL,
    "registration_number" TEXT NOT NULL,
    "machine_type" "MachineType" NOT NULL,
    "chc_id" TEXT NOT NULL,
    "status" "MachineStatus" NOT NULL DEFAULT 'idle',
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "district" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "total_hours" INTEGER NOT NULL DEFAULT 0,
    "fuel_efficiency" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "utilization_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fuel_level" DOUBLE PRECISION,
    "make" TEXT,
    "model" TEXT,
    "year" INTEGER,
    "purchase_date" TIMESTAMP(3),
    "warranty_expiry" TIMESTAMP(3),
    "gps_device_id" TEXT,
    "sim_card_number" TEXT,
    "operator_id" TEXT,
    "last_active" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Machine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MachinePosition" (
    "id" TEXT NOT NULL,
    "machine_id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "speed" DOUBLE PRECISION,
    "heading" DOUBLE PRECISION,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MachinePosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomHiringCentre" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "district" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "contact_number" TEXT NOT NULL,
    "email" TEXT,
    "owner_name" TEXT,
    "total_machines" INTEGER NOT NULL DEFAULT 0,
    "performance_rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "revenue_this_month" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "panchayat_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomHiringCentre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Operator" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "chc_id" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "total_hours_worked" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Operator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsageLog" (
    "id" TEXT NOT NULL,
    "machine_id" TEXT NOT NULL,
    "operator_id" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "district" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "area_covered" DOUBLE PRECISION NOT NULL,
    "fuel_consumed" DOUBLE PRECISION NOT NULL,
    "farmer_name" TEXT,
    "farmer_contact" TEXT,
    "village" TEXT,
    "notes" TEXT,
    "photo_urls" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UsageLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "machine_id" TEXT,
    "chc_id" TEXT,
    "panchayat_id" TEXT,
    "alert_type" "AlertType" NOT NULL,
    "severity" "AlertSeverity" NOT NULL,
    "status" "AlertStatus" NOT NULL DEFAULT 'open',
    "message" TEXT NOT NULL,
    "description" TEXT,
    "affected_resource" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "acknowledged_at" TIMESTAMP(3),
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertComment" (
    "id" TEXT NOT NULL,
    "alert_id" TEXT NOT NULL,
    "user_id" TEXT,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlertComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertRule" (
    "id" TEXT NOT NULL,
    "rule_name" TEXT NOT NULL,
    "trigger_condition" TEXT NOT NULL,
    "threshold_value" DOUBLE PRECISION,
    "alert_type" "AlertType" NOT NULL,
    "severity" "AlertSeverity" NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "notification_channels" TEXT[] DEFAULT ARRAY['in_app']::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AlertRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationPreference" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "alert_types" "AlertType"[] DEFAULT ARRAY[]::"AlertType"[],
    "channels" TEXT[] DEFAULT ARRAY['in_app']::TEXT[],
    "quiet_hours_start" TEXT,
    "quiet_hours_end" TEXT,
    "daily_digest" BOOLEAN NOT NULL DEFAULT false,
    "sound_enabled" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "machine_id" TEXT NOT NULL,
    "farmer_name" TEXT NOT NULL,
    "farmer_contact" TEXT NOT NULL,
    "chc_id" TEXT NOT NULL,
    "machine_type" "MachineType" NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "land_area" DOUBLE PRECISION NOT NULL,
    "estimated_cost" DOUBLE PRECISION NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'pending',
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "district" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceRecord" (
    "id" TEXT NOT NULL,
    "machine_id" TEXT NOT NULL,
    "service_type" TEXT NOT NULL,
    "service_date" TIMESTAMP(3) NOT NULL,
    "next_due_date" TIMESTAMP(3),
    "cost" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "technician" TEXT,
    "parts_replaced" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaintenanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuccessStory" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "farmer_name" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "district" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "image_url" TEXT,
    "impact_metric" TEXT,
    "published_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SuccessStory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "News" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "NewsCategory" NOT NULL DEFAULT 'announcement',
    "published_date" TIMESTAMP(3) NOT NULL,
    "image_url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "action" TEXT NOT NULL,
    "resource_type" TEXT NOT NULL,
    "resource_id" TEXT,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Panchayat" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "block" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "boundary_polygon" JSONB,
    "total_machines" INTEGER NOT NULL DEFAULT 0,
    "active_machine_hours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "utilization_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rank" INTEGER,
    "officer_name" TEXT,
    "officer_phone" TEXT,
    "officer_email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Panchayat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TelemetryLog" (
    "id" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "machine_id" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "altitude" DOUBLE PRECISION,
    "gps_accuracy" DOUBLE PRECISION,
    "ignition" BOOLEAN NOT NULL DEFAULT false,
    "vibration" DOUBLE PRECISION,
    "engine_rpm" DOUBLE PRECISION,
    "fuel_level" DOUBLE PRECISION,
    "temperature" DOUBLE PRECISION,
    "status" "TelemetryStatus" NOT NULL DEFAULT 'IDLE',
    "recorded_at" TIMESTAMP(3) NOT NULL,
    "received_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TelemetryLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UtilizationSession" (
    "id" TEXT NOT NULL,
    "machine_id" TEXT NOT NULL,
    "panchayat_id" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3),
    "total_minutes" INTEGER,
    "start_lat" DOUBLE PRECISION NOT NULL,
    "start_lng" DOUBLE PRECISION NOT NULL,
    "end_lat" DOUBLE PRECISION,
    "end_lng" DOUBLE PRECISION,
    "acres_covered" DOUBLE PRECISION,
    "distance_traveled" DOUBLE PRECISION,
    "verified_by_panchayat" BOOLEAN NOT NULL DEFAULT false,
    "farmer_name" TEXT,
    "farmer_phone" TEXT,
    "subsidy_eligible" BOOLEAN NOT NULL DEFAULT true,
    "subsidy_amount" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UtilizationSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Complaint" (
    "id" TEXT NOT NULL,
    "type" "ComplaintType" NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "district" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "panchayat_id" TEXT,
    "description" TEXT NOT NULL,
    "photo_urls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "reporter_name" TEXT,
    "reporter_phone" TEXT,
    "status" "ComplaintStatus" NOT NULL DEFAULT 'OPEN',
    "assigned_to" TEXT,
    "resolution_notes" TEXT,
    "resolved_at" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Machine_registration_number_key" ON "Machine"("registration_number");

-- CreateIndex
CREATE INDEX "Machine_chc_id_idx" ON "Machine"("chc_id");

-- CreateIndex
CREATE INDEX "Machine_status_idx" ON "Machine"("status");

-- CreateIndex
CREATE INDEX "Machine_gps_device_id_idx" ON "Machine"("gps_device_id");

-- CreateIndex
CREATE INDEX "MachinePosition_machine_id_idx" ON "MachinePosition"("machine_id");

-- CreateIndex
CREATE INDEX "MachinePosition_timestamp_idx" ON "MachinePosition"("timestamp");

-- CreateIndex
CREATE INDEX "CustomHiringCentre_state_idx" ON "CustomHiringCentre"("state");

-- CreateIndex
CREATE INDEX "CustomHiringCentre_district_idx" ON "CustomHiringCentre"("district");

-- CreateIndex
CREATE INDEX "CustomHiringCentre_panchayat_id_idx" ON "CustomHiringCentre"("panchayat_id");

-- CreateIndex
CREATE INDEX "Operator_chc_id_idx" ON "Operator"("chc_id");

-- CreateIndex
CREATE INDEX "UsageLog_machine_id_idx" ON "UsageLog"("machine_id");

-- CreateIndex
CREATE INDEX "UsageLog_operator_id_idx" ON "UsageLog"("operator_id");

-- CreateIndex
CREATE INDEX "UsageLog_start_time_idx" ON "UsageLog"("start_time");

-- CreateIndex
CREATE INDEX "Alert_machine_id_idx" ON "Alert"("machine_id");

-- CreateIndex
CREATE INDEX "Alert_chc_id_idx" ON "Alert"("chc_id");

-- CreateIndex
CREATE INDEX "Alert_panchayat_id_idx" ON "Alert"("panchayat_id");

-- CreateIndex
CREATE INDEX "Alert_severity_idx" ON "Alert"("severity");

-- CreateIndex
CREATE INDEX "Alert_status_idx" ON "Alert"("status");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationPreference_user_id_key" ON "NotificationPreference"("user_id");

-- CreateIndex
CREATE INDEX "Booking_machine_id_idx" ON "Booking"("machine_id");

-- CreateIndex
CREATE INDEX "Booking_chc_id_idx" ON "Booking"("chc_id");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_machine_id_idx" ON "MaintenanceRecord"("machine_id");

-- CreateIndex
CREATE INDEX "ActivityLog_user_id_idx" ON "ActivityLog"("user_id");

-- CreateIndex
CREATE INDEX "ActivityLog_resource_type_idx" ON "ActivityLog"("resource_type");

-- CreateIndex
CREATE INDEX "Panchayat_district_idx" ON "Panchayat"("district");

-- CreateIndex
CREATE INDEX "Panchayat_state_idx" ON "Panchayat"("state");

-- CreateIndex
CREATE INDEX "Panchayat_rank_idx" ON "Panchayat"("rank");

-- CreateIndex
CREATE INDEX "TelemetryLog_device_id_idx" ON "TelemetryLog"("device_id");

-- CreateIndex
CREATE INDEX "TelemetryLog_machine_id_idx" ON "TelemetryLog"("machine_id");

-- CreateIndex
CREATE INDEX "TelemetryLog_recorded_at_idx" ON "TelemetryLog"("recorded_at");

-- CreateIndex
CREATE INDEX "TelemetryLog_status_idx" ON "TelemetryLog"("status");

-- CreateIndex
CREATE INDEX "UtilizationSession_machine_id_idx" ON "UtilizationSession"("machine_id");

-- CreateIndex
CREATE INDEX "UtilizationSession_panchayat_id_idx" ON "UtilizationSession"("panchayat_id");

-- CreateIndex
CREATE INDEX "UtilizationSession_start_time_idx" ON "UtilizationSession"("start_time");

-- CreateIndex
CREATE INDEX "UtilizationSession_verified_by_panchayat_idx" ON "UtilizationSession"("verified_by_panchayat");

-- CreateIndex
CREATE INDEX "Complaint_panchayat_id_idx" ON "Complaint"("panchayat_id");

-- CreateIndex
CREATE INDEX "Complaint_status_idx" ON "Complaint"("status");

-- CreateIndex
CREATE INDEX "Complaint_type_idx" ON "Complaint"("type");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_panchayat_id_fkey" FOREIGN KEY ("panchayat_id") REFERENCES "Panchayat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Machine" ADD CONSTRAINT "Machine_chc_id_fkey" FOREIGN KEY ("chc_id") REFERENCES "CustomHiringCentre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Machine" ADD CONSTRAINT "Machine_operator_id_fkey" FOREIGN KEY ("operator_id") REFERENCES "Operator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachinePosition" ADD CONSTRAINT "MachinePosition_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "Machine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomHiringCentre" ADD CONSTRAINT "CustomHiringCentre_panchayat_id_fkey" FOREIGN KEY ("panchayat_id") REFERENCES "Panchayat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operator" ADD CONSTRAINT "Operator_chc_id_fkey" FOREIGN KEY ("chc_id") REFERENCES "CustomHiringCentre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageLog" ADD CONSTRAINT "UsageLog_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "Machine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageLog" ADD CONSTRAINT "UsageLog_operator_id_fkey" FOREIGN KEY ("operator_id") REFERENCES "Operator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "Machine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_chc_id_fkey" FOREIGN KEY ("chc_id") REFERENCES "CustomHiringCentre"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_panchayat_id_fkey" FOREIGN KEY ("panchayat_id") REFERENCES "Panchayat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertComment" ADD CONSTRAINT "AlertComment_alert_id_fkey" FOREIGN KEY ("alert_id") REFERENCES "Alert"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "Machine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_chc_id_fkey" FOREIGN KEY ("chc_id") REFERENCES "CustomHiringCentre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceRecord" ADD CONSTRAINT "MaintenanceRecord_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "Machine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelemetryLog" ADD CONSTRAINT "TelemetryLog_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "Machine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UtilizationSession" ADD CONSTRAINT "UtilizationSession_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "Machine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UtilizationSession" ADD CONSTRAINT "UtilizationSession_panchayat_id_fkey" FOREIGN KEY ("panchayat_id") REFERENCES "Panchayat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_panchayat_id_fkey" FOREIGN KEY ("panchayat_id") REFERENCES "Panchayat"("id") ON DELETE SET NULL ON UPDATE CASCADE;
