import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Prevent build-time data fetching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    console.log('Fetching all attendance records...');

    const attendanceRecords = await prisma.attendanceRecord.findMany({
      include: {
        student: {
          include: {
            class: true
          }
        },
        attendance: true
      },
      orderBy: {
        attendance: {
          uploadedAt: 'desc',
        },
      },
    });

    console.log('Found attendance records:', attendanceRecords.length);
    console.log('First record sample:', JSON.stringify(attendanceRecords[0], null, 2));

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