/*
  Warnings:

  - A unique constraint covering the columns `[walletAddress]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `walletAddress` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "walletAddress" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Admin_walletAddress_key" ON "Admin"("walletAddress");
