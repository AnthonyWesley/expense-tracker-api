-- DropForeignKey
ALTER TABLE "records" DROP CONSTRAINT "records_accountId_fkey";

-- AddForeignKey
ALTER TABLE "records" ADD CONSTRAINT "records_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
