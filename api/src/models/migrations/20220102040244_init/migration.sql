/*
  Warnings:

  - You are about to alter the column `deviceId` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - A unique constraint covering the columns `[id]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Contact` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "Contact_userId_recordID_key";

-- DropIndex
DROP INDEX "User_deviceId_key";

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Contact_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "mobile" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "deviceId" SET DATA TYPE VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "Contact_id_key" ON "Contact"("id");
