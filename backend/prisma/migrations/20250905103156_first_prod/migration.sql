/*
  Warnings:

  - Added the required column `css` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `html` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `js` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('user', 'assistant');

-- AlterTable
ALTER TABLE "public"."Project" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "css" JSON NOT NULL,
ADD COLUMN     "html" JSON NOT NULL,
ADD COLUMN     "js" JSON NOT NULL;

-- CreateTable
CREATE TABLE "public"."Message" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "role" "public"."Role" NOT NULL,
    "parts" JSON NOT NULL,
    "projectId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
