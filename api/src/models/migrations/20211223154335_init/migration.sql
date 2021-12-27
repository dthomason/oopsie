/*
  Warnings:

  - The primary key for the `Contact` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `mobile` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Contact` table. All the data in the column will be lost.
  - Added the required column `emailAddresses` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumbers` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recordID` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userID` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Made the column `lastName` on table `Contact` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_userId_fkey";

-- DropIndex
DROP INDEX "Contact_mobile_key";

-- AlterTable
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_pkey",
DROP COLUMN "id",
DROP COLUMN "mobile",
DROP COLUMN "userId",
ADD COLUMN     "emailAddresses" JSON NOT NULL,
ADD COLUMN     "phoneNumbers" JSON NOT NULL,
ADD COLUMN     "recordID" VARCHAR(255) NOT NULL,
ADD COLUMN     "userID" TEXT NOT NULL,
ALTER COLUMN "lastName" SET NOT NULL,
ADD CONSTRAINT "Contact_pkey" PRIMARY KEY ("userID", "recordID");

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
