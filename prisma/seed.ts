import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create test users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@cozyhive.eg' },
      update: {},
      create: {
        email: 'admin@cozyhive.eg',
        firstName: 'Admin',
        lastName: 'User',
        phone: '01000000000',
        password: 'admin123',
        role: 'ADMIN',
        membershipType: 'PLATINUM',
      },
    }),
    prisma.user.upsert({
      where: { email: 'ahmed@example.com' },
      update: {},
      create: {
        email: 'ahmed@example.com',
        firstName: 'أحمد',
        lastName: 'محمد',
        phone: '01123456789',
        password: 'password123',
        role: 'CUSTOMER',
        membershipType: 'GOLD',
        walletBalance: 500,
        loyaltyPoints: 150,
      },
    }),
    prisma.user.upsert({
      where: { email: 'sara@example.com' },
      update: {},
      create: {
        email: 'sara@example.com',
        firstName: 'سارة',
        lastName: 'أحمد',
        phone: '01234567890',
        password: 'password123',
        role: 'CUSTOMER',
        membershipType: 'SILVER',
        walletBalance: 200,
        loyaltyPoints: 80,
      },
    }),
  ])

  console.log('✅ Created users:', users.length)

  // Create rooms
  const rooms = await Promise.all([
    prisma.room.upsert({
      where: { id: 'room-1' },
      update: {},
      create: {
        id: 'room-1',
        name: 'Room 1',
        type: 'قاعة اجتماعات',
        capacity: 20,
        floor: 1,
        area: 50,
        pricePerHour: 100,
        pricePerDay: 800,
        pricePerMonth: 20000,
        amenities: ['wifi', 'projector', 'screen', 'sound'],
        status: 'AVAILABLE',
        description: 'قاعة اجتماعات مجهزة بالكامل',
      },
    }),
    prisma.room.upsert({
      where: { id: 'room-2' },
      update: {},
      create: {
        id: 'room-2',
        name: 'Room 2',
        type: 'مكتب خاص',
        capacity: 4,
        floor: 2,
        area: 25,
        pricePerHour: 80,
        pricePerDay: 600,
        pricePerMonth: 15000,
        amenities: ['wifi', 'monitor', 'coffee'],
        status: 'AVAILABLE',
        description: 'مكتب خاص للعمل',
      },
    }),
    prisma.room.upsert({
      where: { id: 'room-3' },
      update: {},
      create: {
        id: 'room-3',
        name: 'Room 3',
        type: 'مساحة مشتركة',
        capacity: 30,
        floor: 1,
        area: 100,
        pricePerHour: 50,
        pricePerDay: 400,
        pricePerMonth: 10000,
        amenities: ['wifi', 'coffee', 'parking'],
        status: 'AVAILABLE',
        description: 'مساحة عمل مشتركة',
      },
    }),
  ])

  console.log('✅ Created rooms:', rooms.length)

  // Create seats for shared space
  const seats = []
  const rows = ['A', 'B', 'C', 'D']
  for (let row of rows) {
    for (let num = 1; num <= 8; num++) {
      const seat = await prisma.seat.create({
        data: {
          roomId: 'room-3',
          seatNumber: `${num}`,
          row: row,
          seatType: num <= 2 ? 'PREMIUM' : 'STANDARD',
          pricePerHour: num <= 2 ? 60 : 50,
          status: 'AVAILABLE',
          amenities: num <= 2 ? ['monitor', 'drawer', 'deskLamp'] : ['drawer'],
        },
      })
      seats.push(seat)
    }
  }

  console.log('✅ Created seats:', seats.length)

  // Create sample bookings
  const bookings = await Promise.all([
    prisma.booking.create({
      data: {
        userId: users[1].id,
        roomId: 'room-1',
        bookingNumber: 'BK-2025-001',
        date: new Date('2025-11-10'),
        startTime: '10:00',
        endTime: '12:00',
        duration: 2,
        totalAmount: 200,
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
      },
    }),
    prisma.booking.create({
      data: {
        userId: users[2].id,
        roomId: 'room-3',
        seatId: seats[0].id,
        bookingNumber: 'BK-2025-002',
        date: new Date('2025-11-09'),
        startTime: '09:00',
        endTime: '17:00',
        duration: 8,
        totalAmount: 480,
        status: 'COMPLETED',
        paymentStatus: 'PAID',
      },
    }),
  ])

  console.log('✅ Created bookings:', bookings.length)

  // Create sample payments
  const payments = await Promise.all([
    prisma.payment.create({
      data: {
        userId: users[1].id,
        bookingId: bookings[0].id,
        transactionId: 'TRX-2025-001',
        amount: 200,
        method: 'CARD',
        status: 'PAID',
        currency: 'EGP',
      },
    }),
    prisma.payment.create({
      data: {
        userId: users[2].id,
        bookingId: bookings[1].id,
        transactionId: 'TRX-2025-002',
        amount: 480,
        method: 'WALLET',
        status: 'PAID',
        currency: 'EGP',
      },
    }),
  ])

  console.log('✅ Created payments:', payments.length)

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

