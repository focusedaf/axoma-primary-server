/*
  Warnings:

  - Added the required column `scheduledOn` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Exam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "scheduledOn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;
