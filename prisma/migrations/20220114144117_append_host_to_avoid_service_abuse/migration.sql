-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_view_id_fkey";

-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "page" TEXT;

-- AlterTable
ALTER TABLE "View" ADD COLUMN     "host" TEXT;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_view_id_fkey" FOREIGN KEY ("view_id") REFERENCES "View"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "Page.name_unique" RENAME TO "Page_name_key";

-- RenameIndex
ALTER INDEX "View.name_unique" RENAME TO "View_name_key";
