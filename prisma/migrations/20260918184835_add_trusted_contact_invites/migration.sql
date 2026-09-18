/*
  Warnings:

  - A unique constraint covering the columns `[inviteToken]` on the table `TrustedContact` will be added. If there are existing duplicate values, this will fail.
  - The required column `inviteToken` was added to the `TrustedContact` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "TrustedContact" ADD COLUMN     "inviteToken" TEXT NOT NULL,
ADD COLUMN     "viewerUserId" TEXT,
ALTER COLUMN "sharing" SET DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "TrustedContact_inviteToken_key" ON "TrustedContact"("inviteToken");

-- AddForeignKey
ALTER TABLE "TrustedContact" ADD CONSTRAINT "TrustedContact_viewerUserId_fkey" FOREIGN KEY ("viewerUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
