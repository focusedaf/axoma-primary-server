-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN     "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "examType" TEXT,
ADD COLUMN     "questions" JSONB;
