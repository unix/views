/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[name]` on the table `Page`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Page.name_unique" ON "Page"("name");
