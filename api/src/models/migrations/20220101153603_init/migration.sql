/*
  Warnings:

  - You are about to drop the column `userHash` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tempToken]` on the table `Token` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Token" ALTER COLUMN "tempToken" DROP NOT NULL,
ALTER COLUMN "tempToken" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "userHash";

-- CreateIndex
CREATE UNIQUE INDEX "Token_tempToken_key" ON "Token"("tempToken");
