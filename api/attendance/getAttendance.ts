import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAttendance = async () => {
  try {
    // Fetch attendance records
    const attendanceRecords = await prisma.attendanceRecord.findMany({
      select: {
        studentID: true,
        status: true,
        attentiveness: true,
      },
    });

    return attendanceRecords;
  } catch (error) {
    console.error("Error fetching attendance:", error);
    throw new Error("Failed to fetch attendance data");
  }
};
