/*
  Warnings:

  - Added the required column `birthday` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birthday` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_supervisorID_fkey";

-- AlterTable
ALTER TABLE "Class" ALTER COLUMN "supervisorID" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "birthday" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "birthday" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_supervisorID_fkey" FOREIGN KEY ("supervisorID") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;
