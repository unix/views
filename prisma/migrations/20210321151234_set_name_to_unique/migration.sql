/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[name]` on the table `View`. If there are existing duplicate values, the migration will fail.
  - Added the required column `name` to the `View` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "View" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "View.name_unique" ON "View"("name");
