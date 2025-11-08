import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET all rooms
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    const where: any = {}
    if (status) where.status = status
    if (type) where.type = type

    const rooms = await prisma.room.findMany({
      where,
      include: {
        seats: true,
        _count: {
          select: {
            bookings: true,
            seats: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json({
      success: true,
      data: rooms,
    })
  } catch (error) {
    console.error('Error fetching rooms:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch rooms',
      },
      { status: 500 }
    )
  }
}

// POST create new room
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      type,
      capacity,
      floor,
      area,
      pricePerHour,
      pricePerDay,
      pricePerMonth,
      amenities = [],
      status = 'AVAILABLE',
      description,
    } = body

    const room = await prisma.room.create({
      data: {
        name,
        type,
        capacity,
        floor,
        area,
        pricePerHour,
        pricePerDay,
        pricePerMonth,
        amenities,
        status,
        description,
      },
    })

    return NextResponse.json({
      success: true,
      data: room,
    })
  } catch (error) {
    console.error('Error creating room:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create room',
      },
      { status: 500 }
    )
  }
}

