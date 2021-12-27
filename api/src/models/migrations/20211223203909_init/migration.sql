/*
  Warnings:

  - The `emailAddresses` column on the `Contact` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `phoneNumbers` column on the `Contact` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "emailAddresses",
ADD COLUMN     "emailAddresses" JSON[],
DROP COLUMN "phoneNumbers",
ADD COLUMN     "phoneNumbers" JSON[];
