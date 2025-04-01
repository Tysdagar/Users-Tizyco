/*
  Warnings:

  - Added the required column `verified` to the `MultifactorMethod` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user"."MultifactorMethod" ADD COLUMN     "verified" BOOLEAN NOT NULL;
