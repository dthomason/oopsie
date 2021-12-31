/*
  Warnings:

  - Added the required column `countryCode` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "countryCode" VARCHAR(10) NOT NULL,
ALTER COLUMN "mobile" SET DATA TYPE VARCHAR(15),
ALTER COLUMN "pin" DROP NOT NULL;
