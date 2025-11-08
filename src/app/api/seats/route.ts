import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');
    const status = searchParams.get('status');

    const where: any = {};
    if (roomId) where.roomId = roomId;
    if (status) where.status = status;

    const seats = await prisma.seat.findMany({
      where,
      include: {
        room: {
          select: {
            id: true,
            name: true,
            type: true,
            floor: true,
          },
        },
      },
      orderBy: {
        seatNumber: 'asc',
      },
    });

    return NextResponse.json({ success: true, data: seats });
  } catch (error) {
    console.error('Error fetching seats:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch seats' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const newSeat = await prisma.seat.create({
      data: {
        roomId: data.roomId,
        seatNumber: data.seatNumber,
        row: data.row || data.seatNumber.charAt(0), // Extract row from seatNumber (e.g., "A1" -> "A")
        seatType: data.seatType || 'STANDARD',
        status: data.status || 'AVAILABLE',
        pricePerHour: data.pricePerHour,
        amenities: data.amenities || [],
      },
      include: {
        room: true,
      },
    });

    return NextResponse.json({ success: true, data: newSeat }, { status: 201 });
  } catch (error) {
    console.error('Error creating seat:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create seat' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Seat ID is required' },
        { status: 400 }
      );
    }

    const data = await request.json();

    const updatedSeat = await prisma.seat.update({
      where: { id },
      data: {
        seatNumber: data.seatNumber,
        row: data.row || (data.seatNumber ? data.seatNumber.charAt(0) : undefined),
        seatType: data.seatType,
        status: data.status,
        pricePerHour: data.pricePerHour,
        amenities: data.amenities,
      },
      include: {
        room: true,
      },
    });

    return NextResponse.json({ success: true, data: updatedSeat });
  } catch (error) {
    console.error('Error updating seat:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update seat' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Seat ID is required' },
        { status: 400 }
      );
    }

    await prisma.seat.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Seat deleted successfully' });
  } catch (error) {
    console.error('Error deleting seat:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete seat' },
      { status: 500 }
    );
  }
}

