# API Documentation

## Base URL
- **Production:** `https://web-app-main-jetixia.vercel.app/api`
- **Development:** `http://localhost:3000/api`

## Database Connection
- **Provider:** Neon PostgreSQL
- **Connection:** Serverless Postgres with pgBouncer pooling
- **Database:** `neondb`
- **Region:** US East (N. Virginia)

---

## 📅 Bookings API

### GET /api/bookings
Get all bookings with optional filters.

**Query Parameters:**
- `userId` (optional): Filter by user ID
- `status` (optional): Filter by status (PENDING, CONFIRMED, COMPLETED, CANCELLED)
- `roomId` (optional): Filter by room ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "userId": "string",
      "roomId": "string",
      "seatId": "string | null",
      "bookingNumber": "BK-2025-001",
      "date": "2025-11-10T00:00:00.000Z",
      "startTime": "10:00",
      "endTime": "12:00",
      "duration": 2,
      "totalAmount": 200,
      "status": "CONFIRMED",
      "paymentStatus": "PAID",
      "notes": "string | null",
      "user": { "firstName": "أحمد", "lastName": "محمد", ... },
      "room": { "name": "Room 1", "type": "قاعة اجتماعات", ... },
      "seat": { ... },
      "payments": [ ... ]
    }
  ]
}
```

### POST /api/bookings
Create a new booking.

**Body:**
```json
{
  "userId": "string",
  "roomId": "string",
  "seatId": "string | null",
  "date": "2025-11-10",
  "startTime": "10:00",
  "endTime": "12:00",
  "duration": 2,
  "totalAmount": 200,
  "status": "PENDING",
  "paymentStatus": "UNPAID",
  "notes": "string | null"
}
```

### PATCH /api/bookings?id={bookingId}
Update an existing booking.

### DELETE /api/bookings?id={bookingId}
Delete a booking.

---

## 👥 Users API

### GET /api/users
Get all users with optional filters.

**Query Parameters:**
- `role` (optional): Filter by role (ADMIN, STAFF, CUSTOMER)
- `membershipType` (optional): Filter by membership (BASIC, SILVER, GOLD, PLATINUM)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "email": "user@example.com",
      "firstName": "أحمد",
      "lastName": "محمد",
      "phone": "01012345678",
      "role": "CUSTOMER",
      "membershipType": "GOLD",
      "walletBalance": 0,
      "loyaltyPoints": 0,
      "totalSpent": 0,
      "totalBookings": 0,
      "bookings": [ ... ],
      "payments": [ ... ]
    }
  ]
}
```

### POST /api/users
Create a new user.

**Body:**
```json
{
  "email": "user@example.com",
  "firstName": "أحمد",
  "lastName": "محمد",
  "phone": "01012345678",
  "password": "password123",
  "role": "CUSTOMER",
  "membershipType": "BASIC"
}
```

### PATCH /api/users?id={userId}
Update user information.

### DELETE /api/users?id={userId}
Delete a user.

---

## 🏢 Rooms API

### GET /api/rooms
Get all rooms with optional filters.

**Query Parameters:**
- `status` (optional): Filter by status (AVAILABLE, OCCUPIED, MAINTENANCE, RESERVED)
- `type` (optional): Filter by room type

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "room-1",
      "name": "Room 1",
      "type": "قاعة اجتماعات",
      "capacity": 20,
      "floor": 1,
      "area": 50,
      "pricePerHour": 100,
      "pricePerDay": 700,
      "pricePerMonth": 15000,
      "status": "AVAILABLE",
      "amenities": ["wifi", "projector", "screen"],
      "description": "قاعة اجتماعات مجهزة بالكامل",
      "seats": [ ... ],
      "_count": {
        "bookings": 5,
        "seats": 20
      }
    }
  ]
}
```

### POST /api/rooms
Create a new room.

**Body:**
```json
{
  "name": "Room 1",
  "type": "قاعة اجتماعات",
  "capacity": 20,
  "floor": 1,
  "area": 50,
  "pricePerHour": 100,
  "pricePerDay": 700,
  "pricePerMonth": 15000,
  "amenities": ["wifi", "projector"],
  "status": "AVAILABLE",
  "description": "string"
}
```

### PATCH /api/rooms?id={roomId}
Update room information.

### DELETE /api/rooms?id={roomId}
Delete a room.

---

## 💺 Seats API

### GET /api/seats
Get all seats with optional filters.

**Query Parameters:**
- `roomId` (optional): Filter by room ID
- `status` (optional): Filter by status (AVAILABLE, OCCUPIED, RESERVED, MAINTENANCE)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "roomId": "string",
      "seatNumber": "A1",
      "row": "A",
      "seatType": "STANDARD",
      "pricePerHour": 30,
      "status": "AVAILABLE",
      "amenities": ["deskLamp", "powerOutlet"],
      "room": { ... }
    }
  ]
}
```

### POST /api/seats
Create a new seat.

**Body:**
```json
{
  "roomId": "string",
  "seatNumber": "A1",
  "row": "A",
  "seatType": "STANDARD",
  "pricePerHour": 30,
  "status": "AVAILABLE",
  "amenities": ["deskLamp"]
}
```

### PATCH /api/seats?id={seatId}
Update seat information.

### DELETE /api/seats?id={seatId}
Delete a seat.

---

## 💳 Payments API

### GET /api/payments
Get all payments with optional filters.

**Query Parameters:**
- `status` (optional): Filter by status (PENDING, PAID, FAILED, REFUNDED)
- `bookingId` (optional): Filter by booking ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "userId": "string",
      "bookingId": "string",
      "transactionId": "TXN-123456",
      "amount": 200,
      "method": "CASH",
      "status": "PAID",
      "currency": "EGP",
      "notes": "string | null",
      "booking": {
        "user": { ... },
        "room": { ... }
      }
    }
  ]
}
```

### POST /api/payments
Create a new payment.

**Body:**
```json
{
  "userId": "string",
  "bookingId": "string",
  "amount": 200,
  "method": "CASH",
  "status": "PENDING",
  "currency": "EGP",
  "notes": "string | null"
}
```

**Note:** `transactionId` is auto-generated if not provided.

### PATCH /api/payments?id={paymentId}
Update payment information.

---

## Enums

### Role
- `ADMIN`
- `STAFF`
- `CUSTOMER`

### MembershipType
- `BASIC`
- `SILVER`
- `GOLD`
- `PLATINUM`

### BookingStatus
- `PENDING`
- `CONFIRMED`
- `COMPLETED`
- `CANCELLED`
- `NO_SHOW`

### PaymentStatus
- `UNPAID`
- `PAID`
- `PARTIAL`
- `REFUNDED`

### RoomStatus
- `AVAILABLE`
- `OCCUPIED`
- `MAINTENANCE`
- `RESERVED`

### SeatStatus
- `AVAILABLE`
- `OCCUPIED`
- `RESERVED`
- `MAINTENANCE`

### SeatType
- `STANDARD`
- `PREMIUM`
- `EXECUTIVE`

### PaymentMethod
- `CASH`
- `CARD`
- `WALLET`
- `BANK_TRANSFER`
- `ONLINE`

### PaymentStatus
- `PENDING`
- `PAID`
- `FAILED`
- `REFUNDED`

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message description"
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

---

## Authentication

Currently, the API does not require authentication. 

**Future Implementation:**
- JWT token-based authentication
- Neon Auth integration with Stack
- Role-based access control (RBAC)

---

## Database Models

### User
- `id` (String, Primary Key)
- `email` (String, Unique)
- `password` (String)
- `firstName` (String)
- `lastName` (String)
- `phone` (String, Optional)
- `role` (Role Enum)
- `membershipType` (MembershipType Enum)
- `walletBalance` (Float, Default: 0)
- `loyaltyPoints` (Int, Default: 0)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Room
- `id` (String, Primary Key)
- `name` (String, Unique)
- `type` (String)
- `capacity` (Int)
- `floor` (Int)
- `area` (Float, Optional)
- `pricePerHour` (Float)
- `pricePerDay` (Float, Optional)
- `pricePerMonth` (Float, Optional)
- `amenities` (String Array)
- `status` (RoomStatus Enum)
- `description` (String, Optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Seat
- `id` (String, Primary Key)
- `roomId` (String, Foreign Key)
- `seatNumber` (String)
- `row` (String)
- `seatType` (SeatType Enum)
- `pricePerHour` (Float)
- `status` (SeatStatus Enum)
- `amenities` (String Array)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Booking
- `id` (String, Primary Key)
- `userId` (String, Foreign Key)
- `roomId` (String, Foreign Key)
- `seatId` (String, Foreign Key, Optional)
- `bookingNumber` (String, Unique)
- `date` (DateTime)
- `startTime` (String)
- `endTime` (String)
- `duration` (Int)
- `totalAmount` (Float)
- `status` (BookingStatus Enum)
- `paymentStatus` (PaymentStatus Enum)
- `notes` (String, Optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Payment
- `id` (String, Primary Key)
- `userId` (String, Foreign Key)
- `bookingId` (String, Foreign Key)
- `transactionId` (String, Unique)
- `amount` (Float)
- `method` (PaymentMethod Enum)
- `status` (PaymentStatus Enum)
- `currency` (String, Default: "EGP")
- `notes` (String, Optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

---

## Environment Variables

Required environment variables for Neon PostgreSQL:

```env
DATABASE_URL=postgresql://...
POSTGRES_URL=postgresql://...
POSTGRES_PRISMA_URL=postgresql://...

# Neon Auth (Stack)
NEXT_PUBLIC_STACK_PROJECT_ID=...
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=...
STACK_SECRET_SERVER_KEY=...
```

---

## Testing

Test all APIs locally:

```bash
npm run dev

# In another terminal
curl http://localhost:3000/api/bookings
curl http://localhost:3000/api/users
curl http://localhost:3000/api/rooms
curl http://localhost:3000/api/seats
curl http://localhost:3000/api/payments
```

---

## Deployment

The API is deployed on Vercel with automatic deployments on push to `main` branch.

**Production URL:** https://web-app-main-jetixia.vercel.app

---

## Support

For issues or questions, please contact the development team.

