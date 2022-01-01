/*
  Warnings:

  - You are about to drop the column `session` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_session_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "session";

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "tokenExpiresAt" DATE NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_id_key" ON "Session"("id");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
