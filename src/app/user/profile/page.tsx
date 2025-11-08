'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { motion } from 'framer-motion'
import { 
  User,
  Calendar,
  CreditCard,
  Building2,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  LogOut,
  Settings,
  Bell,
  FileText,
  Award,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface Booking {
  id: string
  roomName: string
  date: string
  time: string
  status: 'upcoming' | 'completed' | 'cancelled'
  amount: number
}

export default function UserProfilePage() {
  const router = useRouter()
  const { t, i18n } = useTranslation()
  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
  const [userEmail, setUserEmail] = useState('')

  // التحقق من أن المستخدم user
  useEffect(() => {
    const userType = localStorage.getItem('userType')
    const email = localStorage.getItem('userEmail')
    
    if (userType !== 'user') {
      router.push('/login')
    } else {
      setUserEmail(email || 'user@example.com')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('userType')
    localStorage.removeItem('userEmail')
    router.push('/')
  }

  const userBookings: Booking[] = [
    {
      id: '1',
      roomName: i18n.language === 'ar' ? 'غرفة 1' : 'Room 1',
      date: '2024-11-10',
      time: '10:00 - 12:00',
      status: 'upcoming',
      amount: 500
    },
    {
      id: '2',
      roomName: i18n.language === 'ar' ? 'غرفة 3' : 'Room 3',
      date: '2024-11-05',
      time: '14:00 - 16:00',
      status: 'completed',
      amount: 300
    },
    {
      id: '3',
      roomName: i18n.language === 'ar' ? 'غرفة 5' : 'Room 5',
      date: '2024-11-01',
      time: '09:00 - 11:00',
      status: 'completed',
      amount: 400
    }
  ]

  const stats = [
    {
      title: i18n.language === 'ar' ? 'الحجوزات الكلية' : 'Total Bookings',
      value: '12',
      icon: Calendar,
      color: 'bg-primary-500'
    },
    {
      title: i18n.language === 'ar' ? 'الحجوزات القادمة' : 'Upcoming',
      value: '3',
      icon: Clock,
      color: 'bg-green-500'
    },
    {
      title: i18n.language === 'ar' ? 'إجمالي الإنفاق' : 'Total Spent',
      value: '4,500 ' + t('common.currency'),
      icon: CreditCard,
      color: 'bg-purple-500'
    },
    {
      title: i18n.language === 'ar' ? 'النقاط' : 'Points',
      value: '850',
      icon: Award,
      color: 'bg-orange-500'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400'
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      upcoming: i18n.language === 'ar' ? 'قادم' : 'Upcoming',
      completed: i18n.language === 'ar' ? 'مكتمل' : 'Completed',
      cancelled: i18n.language === 'ar' ? 'ملغي' : 'Cancelled'
    }
    return statusMap[status] || status
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={dir}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-reverse space-x-4">
              <Link href="/" className="flex items-center space-x-reverse space-x-2">
                <img src="/hive.png" alt="Cozy Hive" className="h-12 w-auto" />
              </Link>
            </div>

            <div className="flex items-center space-x-reverse space-x-3">
              <LanguageSwitcher />
              
              <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition flex items-center space-x-reverse space-x-2"
              >
                <LogOut className="w-5 h-5" />
                <span>{i18n.language === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center space-x-reverse space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition mb-6"
        >
          <ArrowRight className="w-5 h-5" />
          <span>{t('common.backToHome')}</span>
        </Link>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="flex items-center space-x-reverse space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {i18n.language === 'ar' ? 'حسابي' : 'My Profile'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 flex items-center">
                <Mail className="w-4 h-4 ml-2" />
                {userEmail}
              </p>
            </div>
            <Link
              href="/booking"
              className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition shadow-lg flex items-center space-x-reverse space-x-2"
            >
              <Calendar className="w-5 h-5" />
              <span>{i18n.language === 'ar' ? 'حجز جديد' : 'New Booking'}</span>
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
        >
          <div className="p-6 border-b dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {i18n.language === 'ar' ? 'حجوزاتي' : 'My Bookings'}
            </h3>
          </div>

          <div className="divide-y dark:divide-gray-700">
            {userBookings.map((booking) => (
              <div key={booking.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-reverse space-x-4">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{booking.roomName}</h4>
                      <div className="flex items-center space-x-reverse space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 ml-1" />
                          {booking.date}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 ml-1" />
                          {booking.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-reverse space-x-4">
                    <div className="text-left">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {booking.amount} {t('common.currency')}
                      </p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

