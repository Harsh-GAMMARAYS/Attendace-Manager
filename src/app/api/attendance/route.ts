import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Prevent build-time data fetching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    console.log('Fetching attendance records with params:', { startDate, endDate });

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

    console.log('Found attendance records:', attendanceRecords.length);

    return NextResponse.json(attendanceRecords);
  } catch (error) {
    console.error('Detailed error fetching attendance:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: 'Failed to fetch attendance data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 