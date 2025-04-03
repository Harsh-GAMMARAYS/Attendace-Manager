import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const attendanceRecords = await prisma.attendanceRecord.findMany({
      where: {
        attendance: {
          uploadedAt: {
            gte: startDate ? new Date(startDate) : undefined,
            lte: endDate ? new Date(endDate) : undefined,
          },
        },
      },
      select: {
        id: true,
        studentID: true,
        status: true,
        attentiveness: true,
        student: {
          select: {
            name: true,
            surname: true,
            class: {
              select: {
                name: true,
              },
            },
          },
        },
        attendance: {
          select: {
            uploadedAt: true,
          },
        },
      },
      orderBy: {
        attendance: {
          uploadedAt: 'desc',
        },
      },
    });

    return NextResponse.json(attendanceRecords);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance data' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 