/*
  Warnings:

  - Added the required column `userHash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userHash" VARCHAR(255) NOT NULL;
