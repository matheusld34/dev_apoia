/*
  Warnings:

  - You are about to drop the `Donations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Donations" DROP CONSTRAINT "Donations_userdId_fkey";

-- DropTable
DROP TABLE "public"."Donations";

-- CreateTable
CREATE TABLE "public"."Donation" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "donorName" TEXT NOT NULL,
    "donorMessage" TEXT NOT NULL,
    "userdId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."PaymanetStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Donation" ADD CONSTRAINT "Donation_userdId_fkey" FOREIGN KEY ("userdId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
