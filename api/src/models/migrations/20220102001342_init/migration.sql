/*
  Warnings:

  - You are about to drop the column `firstInstallTime` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Device` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[deviceId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Device" DROP CONSTRAINT "Device_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "firstInstallTime",
ADD COLUMN     "deviceId" TEXT;

-- DropTable
DROP TABLE "Device";

-- DropEnum
DROP TYPE "TokenType";

-- CreateIndex
CREATE UNIQUE INDEX "User_deviceId_key" ON "User"("deviceId");
