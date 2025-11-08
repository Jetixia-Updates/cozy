import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const bookingId = searchParams.get('bookingId');

    const where: any = {};
    if (status) where.status = status;
    if (bookingId) where.bookingId = bookingId;

    const payments = await prisma.payment.findMany({
      where,
      include: {
        booking: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            room: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ success: true, data: payments });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Generate unique transaction ID if not provided
    const transactionId = data.transactionId || `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const newPayment = await prisma.payment.create({
      data: {
        userId: data.userId,
        bookingId: data.bookingId,
        amount: data.amount,
        method: data.method || 'CASH',
        status: data.status || 'PENDING',
        transactionId,
        currency: data.currency || 'EGP',
        notes: data.notes,
      },
      include: {
        booking: {
          include: {
            user: true,
            room: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: newPayment }, { status: 201 });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create payment' },
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
        { success: false, message: 'Payment ID is required' },
        { status: 400 }
      );
    }

    const data = await request.json();

    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: {
        userId: data.userId,
        amount: data.amount,
        method: data.method,
        status: data.status,
        currency: data.currency,
        notes: data.notes,
      },
      include: {
        booking: {
          include: {
            user: true,
            room: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: updatedPayment });
  } catch (error) {
    console.error('Error updating payment:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update payment' },
      { status: 500 }
    );
  }
}

