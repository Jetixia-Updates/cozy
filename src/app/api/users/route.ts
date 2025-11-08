import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET all users/customers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const membershipType = searchParams.get('membershipType')

    const where: any = {}
    if (role) where.role = role
    if (membershipType) where.membershipType = membershipType

    const users = await prisma.user.findMany({
      where,
      include: {
        bookings: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
        payments: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
        _count: {
          select: {
            bookings: true,
            payments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Calculate aggregate data for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const totalSpent = await prisma.payment.aggregate({
          where: {
            userId: user.id,
            status: 'PAID',
          },
          _sum: {
            amount: true,
          },
        })

        return {
          ...user,
          totalSpent: totalSpent._sum.amount || 0,
          totalBookings: user._count.bookings,
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: usersWithStats,
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch users',
      },
      { status: 500 }
    )
  }
}

// POST create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      email,
      firstName,
      lastName,
      phone,
      password,
      role = 'CUSTOMER',
      membershipType = 'BASIC',
    } = body

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'User with this email already exists',
        },
        { status: 400 }
      )
    }

    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        phone,
        password, // In production, hash this!
        role,
        membershipType,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        membershipType: true,
        walletBalance: true,
        loyaltyPoints: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create user',
      },
      { status: 500 }
    )
  }
}

