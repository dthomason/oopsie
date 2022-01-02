/*
  Warnings:

  - The primary key for the `Contact` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Contact` table. All the data in the column will be lost.
  - You are about to alter the column `mobile` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `VarChar(15)`.
  - A unique constraint covering the columns `[userId,recordID]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('TEMP', 'API');

-- DropIndex
DROP INDEX "Contact_id_key";

-- AlterTable
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_pkey",
DROP COLUMN "id";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "firstInstallTime" INTEGER,
ALTER COLUMN "mobile" SET DATA TYPE VARCHAR(15);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "TokenType" NOT NULL,
    "tempToken" TEXT,
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "expiration" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Token_id_key" ON "Token"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Token_tempToken_key" ON "Token"("tempToken");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_userId_recordID_key" ON "Contact"("userId", "recordID");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
