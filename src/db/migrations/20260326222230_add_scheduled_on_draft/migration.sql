-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "scheduledOnDraft" TEXT,
ALTER COLUMN "scheduledOn" DROP NOT NULL;
