-- AlterTable
ALTER TABLE "missions" ADD COLUMN     "contactInfo" JSONB,
ADD COLUMN     "fullDescription" TEXT,
ADD COLUMN     "isUrgent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "whatToBring" TEXT,
ADD COLUMN     "whatVolunteersDo" TEXT,
ADD COLUMN     "whoCanApply" TEXT;
