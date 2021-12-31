-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "countryCode" VARCHAR(10) NOT NULL,
    "deviceId" VARCHAR(255),
    "email" VARCHAR(255),
    "firstInstallTime" INTEGER,
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "mobile" VARCHAR(15) NOT NULL,
    "pin" VARCHAR(255),
    "session" VARCHAR(255),
    "verifiedEmail" BOOLEAN NOT NULL,
    "verifiedMobile" BOOLEAN NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "phoneNumbers" JSON[],
    "emailAddresses" JSON[],
    "recordID" VARCHAR(255) NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_mobile_key" ON "User"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "User_session_key" ON "User"("session");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_userId_recordID_key" ON "Contact"("userId", "recordID");

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
