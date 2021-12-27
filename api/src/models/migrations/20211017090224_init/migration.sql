/*
  Warnings:

  - Made the column `mobile` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pin` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "mobile" SET NOT NULL,
ALTER COLUMN "pin" SET NOT NULL;
