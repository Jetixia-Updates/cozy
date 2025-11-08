'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar,
  Clock,
  Users,
  MapPin,
  CheckCircle,
  XCircle,
  Wifi,
  Monitor,
  Coffee,
  Car,
  Volume2,
  Video,
  Projector,
  Tv,
  ArrowRight,
  User,
  Mail,
  Phone,
  CreditCard,
  AlertCircle,
  Info
} from 'lucide-react'
import Link from 'next/link'

interface Room {
  id: string
  name: string
  type: string
  capacity: number
  pricePerHour: number
  amenities: string[]
  floor: number
  area: number
}

interface Seat {
  id: string
  row: string
  number: number
  status: 'available' | 'booked' | 'selected'
  bookedUntil?: string
  bookedBy?: string
}

interface Booking {
  id: string
  roomId: string
  seatId: string
  date: string
  startTime: string
  endTime: string
  customerName: string
  customerEmail: string
  customerPhone: string
}

export default function BookingPage() {
  const { t, i18n } = useTranslation()
  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
  
  // Check if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  
  useEffect(() => {
    // Check localStorage for user data
    const userType = localStorage.getItem('userType')
    const email = localStorage.getItem('userEmail')
    
    if (userType && email) {
      setIsLoggedIn(true)
      setUserEmail(email)
    }
  }, [])
  
  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  
  const [step, setStep] = useState<'rooms' | 'seats' | 'details' | 'confirmation'>('rooms')
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [selectedDate, setSelectedDate] = useState(getTodayDate())
  const [selectedStartTime, setSelectedStartTime] = useState('')
  const [selectedDuration, setSelectedDuration] = useState(1)
  const [seats, setSeats] = useState<Seat[]>([])
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: ''
  })

  const rooms: Room[] = [
    {
      id: '1',
      name: 'غرفة 1',
      type: 'قاعة مؤتمرات',
      capacity: 50,
      pricePerHour: 250,
      amenities: ['wifi', 'projector', 'screen', 'sound', 'video', 'coffee'],
      floor: 2,
      area: 120
    },
    {
      id: '2',
      name: 'غرفة 2',
      type: 'غرفة اجتماعات',
      capacity: 20,
      pricePerHour: 150,
      amenities: ['wifi', 'screen', 'coffee'],
      floor: 3,
      area: 60
    },
    {
      id: '3',
      name: 'غرفة 3',
      type: 'مكتب خاص',
      capacity: 10,
      pricePerHour: 100,
      amenities: ['wifi', 'monitor'],
      floor: 1,
      area: 30
    },
    {
      id: '4',
      name: 'غرفة 4',
      type: 'مساحة مشتركة',
      capacity: 30,
      pricePerHour: 80,
      amenities: ['wifi', 'coffee'],
      floor: 1,
      area: 80
    },
    {
      id: '5',
      name: 'غرفة 5',
      type: 'قاعة تدريب',
      capacity: 40,
      pricePerHour: 200,
      amenities: ['wifi', 'projector', 'screen', 'sound'],
      floor: 2,
      area: 100
    },
    {
      id: '6',
      name: 'غرفة 6',
      type: 'غرفة اجتماعات صغيرة',
      capacity: 8,
      pricePerHour: 120,
      amenities: ['wifi', 'screen'],
      floor: 3,
      area: 25
    },
    {
      id: '7',
      name: 'غرفة 7',
      type: 'قاعة كبرى',
      capacity: 100,
      pricePerHour: 400,
      amenities: ['wifi', 'projector', 'screen', 'sound', 'video', 'coffee', 'parking'],
      floor: 4,
      area: 200
    },
    {
      id: '8',
      name: 'غرفة 8',
      type: 'مكتب تنفيذي',
      capacity: 6,
      pricePerHour: 180,
      amenities: ['wifi', 'monitor', 'coffee'],
      floor: 5,
      area: 35
    },
    {
      id: '9',
      name: 'غرفة 9',
      type: 'استوديو',
      capacity: 15,
      pricePerHour: 220,
      amenities: ['wifi', 'video', 'sound'],
      floor: 3,
      area: 55
    },
    {
      id: '10',
      name: 'غرفة 10',
      type: 'قاعة متعددة الأغراض',
      capacity: 60,
      pricePerHour: 300,
      amenities: ['wifi', 'projector', 'screen', 'sound', 'coffee', 'parking'],
      floor: 4,
      area: 150
    }
  ]

  // توليد المقاعد بناءً على الغرفة المختارة
  const generateSeats = (roomId: string, capacity: number) => {
    const rows = Math.ceil(capacity / 10)
    const seatsPerRow = Math.ceil(capacity / rows)
    const newSeats: Seat[] = []
    
    for (let i = 0; i < rows; i++) {
      const rowLetter = String.fromCharCode(65 + i) // A, B, C, etc.
      for (let j = 1; j <= seatsPerRow; j++) {
        if (newSeats.length < capacity) {
          // محاكاة بعض المقاعد المحجوزة
          const isBooked = Math.random() > 0.7
          const bookedUntil = isBooked 
            ? new Date(Date.now() + Math.random() * 24 * 60 * 60 * 1000).toISOString()
            : undefined
          
          newSeats.push({
            id: `${rowLetter}${j}`,
            row: rowLetter,
            number: j,
            status: isBooked ? 'booked' : 'available',
            bookedUntil,
            bookedBy: isBooked ? 'عميل آخر' : undefined
          })
        }
      }
    }
    
    return newSeats
  }

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room)
    setStep('seats')
    const generatedSeats = generateSeats(room.id, room.capacity)
    setSeats(generatedSeats)
  }

  const handleSeatClick = (seatId: string) => {
    const seat = seats.find(s => s.id === seatId)
    if (seat?.status === 'booked') return

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId))
      setSeats(seats.map(s => 
        s.id === seatId ? { ...s, status: 'available' } : s
      ))
    } else {
      setSelectedSeats([...selectedSeats, seatId])
      setSeats(seats.map(s => 
        s.id === seatId ? { ...s, status: 'selected' } : s
      ))
    }
  }

  const handleProceedToDetails = () => {
    if (selectedSeats.length === 0) {
      alert(i18n.language === 'ar' ? 'الرجاء اختيار مقعد واحد على الأقل' : 'Please select at least one seat')
      return
    }
    if (!selectedDate || !selectedStartTime) {
      alert(i18n.language === 'ar' ? 'الرجاء اختيار التاريخ والوقت' : 'Please select date and time')
      return
    }
    
    // If user is logged in, skip details step and go directly to confirmation
    if (isLoggedIn) {
      setStep('confirmation')
    } else {
      setStep('details')
    }
  }

  const handleConfirmBooking = () => {
    if (!customerDetails.name || !customerDetails.email || !customerDetails.phone) {
      alert(i18n.language === 'ar' ? 'الرجاء إدخال جميع البيانات' : 'Please enter all details')
      return
    }
    // هنا يمكن إرسال البيانات للسيرفر
    setStep('confirmation')
  }

  const calculateEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number)
    const endHours = hours + duration
    return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  const getTotalPrice = () => {
    if (!selectedRoom) return 0
    return selectedRoom.pricePerHour * selectedDuration * selectedSeats.length
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi': return <Wifi className="w-4 h-4" />
      case 'projector': return <Projector className="w-4 h-4" />
      case 'screen': return <Monitor className="w-4 h-4" />
      case 'sound': return <Volume2 className="w-4 h-4" />
      case 'video': return <Video className="w-4 h-4" />
      case 'coffee': return <Coffee className="w-4 h-4" />
      case 'parking': return <Car className="w-4 h-4" />
      case 'monitor': return <Tv className="w-4 h-4" />
      default: return null
    }
  }

  const formatTimeRemaining = (bookedUntil: string) => {
    const now = new Date()
    const endTime = new Date(bookedUntil)
    const diff = endTime.getTime() - now.getTime()
    
    if (diff <= 0) return i18n.language === 'ar' ? 'منتهي' : 'Expired'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return i18n.language === 'ar' 
        ? `متاح بعد ${hours} ساعة و ${minutes} دقيقة`
        : `Available in ${hours}h ${minutes}m`
    }
    return i18n.language === 'ar' 
      ? `متاح بعد ${minutes} دقيقة`
      : `Available in ${minutes}m`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-6 sm:py-8 md:py-12 px-3 sm:px-4" dir={dir}>
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link 
              href="/"
              className="inline-flex items-center space-x-reverse space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition"
            >
              <ArrowRight className="w-5 h-5" />
              <span>{t('booking.backToHome')}</span>
            </Link>
            <LanguageSwitcher />
          </div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2"
          >
            {t('booking.title')}
          </motion.h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {t('booking.subtitle')}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-6 sm:mb-8 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between overflow-x-auto">
            <div className={`flex items-center space-x-reverse space-x-1 sm:space-x-2 ${step === 'rooms' ? 'text-primary-600' : 'text-gray-400'} flex-shrink-0`}>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base ${step === 'rooms' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                1
              </div>
              <span className="font-medium text-xs sm:text-sm md:text-base whitespace-nowrap">{i18n.language === 'ar' ? 'اختر الغرفة' : 'Select Room'}</span>
            </div>
            
            <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 mx-2 sm:mx-4 min-w-[20px]"></div>
            
            <div className={`flex items-center space-x-reverse space-x-1 sm:space-x-2 ${step === 'seats' ? 'text-primary-600' : 'text-gray-400'} flex-shrink-0`}>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base ${step === 'seats' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                2
              </div>
              <span className="font-medium text-xs sm:text-sm md:text-base whitespace-nowrap">{i18n.language === 'ar' ? 'اختر المقاعد' : 'Select Seats'}</span>
            </div>
            
            <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 mx-2 sm:mx-4 min-w-[20px]"></div>
            
            <div className={`flex items-center space-x-reverse space-x-1 sm:space-x-2 ${step === 'details' ? 'text-primary-600' : 'text-gray-400'} flex-shrink-0`}>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base ${step === 'details' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                3
              </div>
              <span className="font-medium text-xs sm:text-sm md:text-base whitespace-nowrap hidden sm:inline">{t('booking.step3')}</span>
              <span className="font-medium text-xs whitespace-nowrap sm:hidden">{i18n.language === 'ar' ? 'البيانات' : 'Details'}</span>
            </div>
            
            <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 mx-2 sm:mx-4 min-w-[20px]"></div>
            
            <div className={`flex items-center space-x-reverse space-x-1 sm:space-x-2 ${step === 'confirmation' ? 'text-primary-600' : 'text-gray-400'} flex-shrink-0`}>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base ${step === 'confirmation' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                4
              </div>
              <span className="font-medium text-xs sm:text-sm md:text-base whitespace-nowrap hidden sm:inline">{t('booking.step4')}</span>
              <span className="font-medium text-xs whitespace-nowrap sm:hidden">{i18n.language === 'ar' ? 'التأكيد' : 'Confirm'}</span>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Select Room */}
          {step === 'rooms' && (
            <motion.div
              key="rooms"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {rooms.map((room) => (
                <motion.div
                  key={room.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoomSelect(room)}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all"
                >
                  <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{room.name}</h3>
                    <p className="text-primary-100">{room.type}</p>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-reverse space-x-2 text-gray-600 dark:text-gray-400">
                        <Users className="w-5 h-5" />
                        <span>{room.capacity} {i18n.language === 'ar' ? 'شخص' : 'people'}</span>
                      </div>
                      <div className="flex items-center space-x-reverse space-x-2 text-gray-600 dark:text-gray-400">
                        <MapPin className="w-5 h-5" />
                        <span>{i18n.language === 'ar' ? 'الطابق' : 'Floor'} {room.floor}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {room.amenities.map((amenity) => (
                        <div key={amenity} className="flex items-center space-x-reverse space-x-1 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg text-sm">
                          {getAmenityIcon(amenity)}
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {room.pricePerHour} {t('common.currency')} / {i18n.language === 'ar' ? 'ساعة' : 'hour'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Step 2: Select Seats */}
          {step === 'seats' && selectedRoom && (
            <motion.div
              key="seats"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Room Info & Date/Time Selection */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {selectedRoom.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">{selectedRoom.type}</p>
                  </div>
                  <button
                    onClick={() => {
                      setStep('rooms')
                      setSelectedRoom(null)
                      setSelectedSeats([])
                    }}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition"
                  >
                    {i18n.language === 'ar' ? 'تغيير الغرفة' : 'Change Room'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Calendar className="w-4 h-4 inline ml-2" />
                      {i18n.language === 'ar' ? 'التاريخ' : 'Date'}
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl cursor-not-allowed text-gray-700 dark:text-gray-300 font-medium"
                      title={i18n.language === 'ar' ? 'التاريخ محدد تلقائياً لليوم' : 'Date is automatically set to today'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Clock className="w-4 h-4 inline ml-2" />
                      {i18n.language === 'ar' ? 'وقت البداية' : 'Start Time'}
                    </label>
                    <input
                      type="time"
                      value={selectedStartTime}
                      onChange={(e) => setSelectedStartTime(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {i18n.language === 'ar' ? 'المدة (ساعات)' : 'Duration (Hours)'}
                    </label>
                    <select
                      value={selectedDuration}
                      onChange={(e) => setSelectedDuration(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(hour => (
                        <option key={hour} value={hour}>{hour} {i18n.language === 'ar' ? 'ساعة' : 'hour'}{hour > 1 && i18n.language === 'en' ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedStartTime && (
                  <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                    <p className="text-sm text-primary-800 dark:text-primary-200">
                      <Info className="w-4 h-4 inline ml-2" />
                      وقت الانتهاء المتوقع: {calculateEndTime(selectedStartTime, selectedDuration)}
                    </p>
                  </div>
                )}
              </div>

              {/* Seats Layout */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                {/* Screen */}
                <div className="mb-8">
                  <div className="bg-gradient-to-b from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700 rounded-t-3xl py-3 text-center text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {i18n.language === 'ar' ? 'الشاشة / المنصة' : 'Screen / Stage'}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center space-x-reverse space-x-6 mb-6 text-sm">
                  <div className="flex items-center space-x-reverse space-x-2">
                    <div className="w-8 h-8 bg-green-500 rounded-lg"></div>
                    <span className="text-gray-600 dark:text-gray-400">{i18n.language === 'ar' ? 'متاح' : 'Available'}</span>
                  </div>
                  <div className="flex items-center space-x-reverse space-x-2">
                    <div className="w-8 h-8 bg-primary-500 rounded-lg"></div>
                    <span className="text-gray-600 dark:text-gray-400">{i18n.language === 'ar' ? 'مختار' : 'Selected'}</span>
                  </div>
                  <div className="flex items-center space-x-reverse space-x-2">
                    <div className="w-8 h-8 bg-red-500 rounded-lg"></div>
                    <span className="text-gray-600 dark:text-gray-400">{i18n.language === 'ar' ? 'محجوز' : 'Booked'}</span>
                  </div>
                </div>

                {/* Seats Grid */}
                <div className="flex flex-col items-center space-y-3">
                  {Array.from(new Set(seats.map(s => s.row))).map((row) => (
                    <div key={row} className="flex items-center space-x-reverse space-x-2">
                      <span className="w-8 text-center font-bold text-gray-600 dark:text-gray-400">
                        {row}
                      </span>
                      {seats
                        .filter(s => s.row === row)
                        .map((seat) => (
                          <motion.button
                            key={seat.id}
                            whileHover={{ scale: seat.status !== 'booked' ? 1.1 : 1 }}
                            whileTap={{ scale: seat.status !== 'booked' ? 0.9 : 1 }}
                            onClick={() => handleSeatClick(seat.id)}
                            disabled={seat.status === 'booked'}
                            className={`relative w-12 h-12 rounded-lg font-medium text-sm transition-all group ${
                              seat.status === 'available'
                                ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
                                : seat.status === 'selected'
                                ? 'bg-primary-500 text-white cursor-pointer'
                                : 'bg-red-500 text-white cursor-not-allowed opacity-50'
                            }`}
                          >
                            {seat.number}
                            {seat.status === 'booked' && seat.bookedUntil && (
                              <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10">
                                {formatTimeRemaining(seat.bookedUntil)}
                              </div>
                            )}
                          </motion.button>
                        ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary & Continue */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {i18n.language === 'ar' ? 'المقاعد المختارة:' : 'Selected Seats:'} <span className="font-bold text-gray-900 dark:text-white">{selectedSeats.join(', ') || (i18n.language === 'ar' ? 'لم يتم الاختيار' : 'None')}</span>
                    </p>
                    <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {i18n.language === 'ar' ? 'الإجمالي:' : 'Total:'} {getTotalPrice()} {t('common.currency')}
                    </p>
                  </div>
                  <button
                    onClick={handleProceedToDetails}
                    disabled={selectedSeats.length === 0 || !selectedDate || !selectedStartTime}
                    className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:from-primary-700 hover:to-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium shadow-lg"
                  >
                    {i18n.language === 'ar' ? 'متابعة للخطوة التالية' : 'Continue to Next Step'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Customer Details */}
          {step === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  بيانات العميل
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <User className="w-4 h-4 inline ml-2" />
                      الاسم الكامل
                    </label>
                    <input
                      type="text"
                      value={customerDetails.name}
                      onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                      placeholder="أدخل اسمك الكامل"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Mail className="w-4 h-4 inline ml-2" />
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      value={customerDetails.email}
                      onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })}
                      placeholder="example@email.com"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Phone className="w-4 h-4 inline ml-2" />
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      value={customerDetails.phone}
                      onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                      placeholder="01xxxxxxxxx"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <button
                    onClick={() => setStep('seats')}
                    className="flex-1 px-6 py-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
                  >
                    رجوع
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:from-primary-700 hover:to-primary-600 transition font-medium shadow-lg"
                  >
                    تأكيد الحجز
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Confirmation */}
          {step === 'confirmation' && selectedRoom && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-12 h-12 text-white" />
                </motion.div>

                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {i18n.language === 'ar' ? 'تم تأكيد الحجز بنجاح!' : 'Booking Confirmed Successfully!'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  {i18n.language === 'ar' ? 'شكراً لك! تم إرسال تفاصيل الحجز إلى بريدك الإلكتروني' : 'Thank you! Booking details have been sent to your email'}
                  {isLoggedIn && (
                    <span className="block mt-2 font-medium text-primary-600 dark:text-primary-400">
                      {userEmail}
                    </span>
                  )}
                </p>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 text-right space-y-4 mb-8">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{i18n.language === 'ar' ? 'رقم الحجز:' : 'Booking Number:'}</span>
                    <span className="font-bold text-gray-900 dark:text-white">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{i18n.language === 'ar' ? 'الغرفة:' : 'Room:'}</span>
                    <span className="font-bold text-gray-900 dark:text-white">{selectedRoom.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{i18n.language === 'ar' ? 'المقاعد:' : 'Seats:'}</span>
                    <span className="font-bold text-gray-900 dark:text-white">{selectedSeats.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{i18n.language === 'ar' ? 'التاريخ:' : 'Date:'}</span>
                    <span className="font-bold text-gray-900 dark:text-white">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{i18n.language === 'ar' ? 'الوقت:' : 'Time:'}</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {selectedStartTime} - {calculateEndTime(selectedStartTime, selectedDuration)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                    <span className="text-gray-600 dark:text-gray-400">{i18n.language === 'ar' ? 'المبلغ الإجمالي:' : 'Total Amount:'}</span>
                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {getTotalPrice()} {t('common.currency')}
                    </span>
                  </div>
                </div>

                <Link
                  href="/"
                  className="inline-block px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:from-primary-700 hover:to-primary-600 transition font-medium shadow-lg"
                >
                  {t('booking.backToHome')}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

