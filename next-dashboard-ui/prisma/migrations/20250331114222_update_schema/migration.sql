/*
  Warnings:

  - A unique constraint covering the columns `[studentID]` on the table `AttendanceRecord` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "AttendanceRecord" DROP CONSTRAINT "AttendanceRecord_attendanceID_fkey";

-- DropForeignKey
ALTER TABLE "AttendanceRecord" DROP CONSTRAINT "AttendanceRecord_studentID_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceRecord_studentID_key" ON "AttendanceRecord"("studentID");

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_studentID_fkey" FOREIGN KEY ("studentID") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_attendanceID_fkey" FOREIGN KEY ("attendanceID") REFERENCES "Attendance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
