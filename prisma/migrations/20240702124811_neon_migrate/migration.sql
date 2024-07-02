/*
  Warnings:

  - You are about to drop the column `userId` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `accountId` on the `records` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `account_id` to the `records` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_userId_fkey";

-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_userId_fkey";

-- DropForeignKey
ALTER TABLE "records" DROP CONSTRAINT "records_accountId_fkey";

-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "records" DROP COLUMN "accountId",
ADD COLUMN     "account_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "records" ADD CONSTRAINT "records_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
