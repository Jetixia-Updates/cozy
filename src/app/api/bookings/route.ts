import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET all bookings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const userId = searchParams.get('userId')

    const where: any = {}
    if (status) where.status = status
    if (userId) where.userId = userId

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        room: {
          select: {
            id: true,
            name: true,
            type: true,
            floor: true,
          },
        },
        seat: {
          select: {
            id: true,
            seatNumber: true,
            row: true,
          },
        },
        payments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      data: bookings,
    })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch bookings',
      },
      { status: 500 }
    )
  }
}

// POST create new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      roomId,
      seatId,
      date,
      startTime,
      endTime,
      duration,
      totalAmount,
      status = 'PENDING',
      paymentStatus = 'UNPAID',
      notes,
    } = body

    // Generate unique booking number
    const bookingNumber = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    const booking = await prisma.booking.create({
      data: {
        userId,
        roomId,
        seatId,
        bookingNumber,
        date: new Date(date),
        startTime,
        endTime,
        duration,
        totalAmount,
        status,
        paymentStatus,
        notes,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        room: true,
        seat: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: booking,
    })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create booking',
      },
      { status: 500 }
    )
  }
}

// PATCH update booking
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        ...body,
        date: body.date ? new Date(body.date) : undefined,
      },
      include: {
        user: true,
        room: true,
        seat: true,
        payments: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedBooking,
    })
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}

// DELETE booking
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    await prisma.booking.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Booking deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting booking:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete booking' },
      { status: 500 }
    )
  }
}
