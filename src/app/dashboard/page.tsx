'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { motion } from 'framer-motion'
import { 
  Building2, 
  Users, 
  Calendar, 
  TrendingUp, 
  CreditCard,
  Clock,
  ChevronRight,
  Menu,
  X,
  LogOut,
  User,
  Settings,
  Bell,
  Search,
  Plus,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  DollarSign,
  Activity,
  Briefcase,
  Coffee,
  Grid,
  List,
  Filter,
  Download,
  Sun,
  Moon
} from 'lucide-react'

interface StatCard {
  title: string
  value: string | number
  change: number
  icon: any
  color: string
}

interface Booking {
  id: string
  customerName: string
  roomType: string
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  amount: number
}

export default function DashboardPage() {
  const router = useRouter()
  const { t, i18n } = useTranslation()
  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedPeriod, setSelectedPeriod] = useState('today')
  
  // Sample data
  const stats: StatCard[] = [
    {
      title: t('dashboard.totalBookings'),
      value: '156',
      change: 12.5,
      icon: Calendar,
      color: 'bg-primary-500'
    },
    {
      title: t('dashboard.activeMembers'),
      value: '89',
      change: 8.2,
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: t('dashboard.monthlyRevenue'),
      value: `45,750 ${t('common.currency')}`,
      change: -3.4,
      icon: DollarSign,
      color: 'bg-purple-500'
    },
    {
      title: t('dashboard.occupancyRate'),
      value: '78%',
      change: 5.1,
      icon: Activity,
      color: 'bg-orange-500'
    }
  ]

  const recentBookings: Booking[] = [
    {
      id: '1',
      customerName: 'أحمد محمد',
      roomType: 'قاعة اجتماعات كبيرة',
      date: '2024-11-07',
      time: '10:00 - 12:00',
      status: 'confirmed',
      amount: 350
    },
    {
      id: '2',
      customerName: 'سارة أحمد',
      roomType: 'مقعد مشترك',
      date: '2024-11-07',
      time: '09:00 - 18:00',
      status: 'confirmed',
      amount: 150
    },
    {
      id: '3',
      customerName: 'محمد علي',
      roomType: 'مكتب خاص',
      date: '2024-11-08',
      time: '09:00 - 17:00',
      status: 'pending',
      amount: 450
    },
    {
      id: '4',
      customerName: 'فاطمة عبدالله',
      roomType: 'قاعة تدريب',
      date: '2024-11-08',
      time: '14:00 - 17:00',
      status: 'completed',
      amount: 280
    }
  ]

  const sidebarItems = [
    { title: t('dashboard.title'), icon: Grid, href: '/dashboard', active: true },
    { title: t('dashboard.bookings'), icon: Calendar, href: '/dashboard/bookings' },
    { title: t('dashboard.customers'), icon: Users, href: '/dashboard/customers' },
    { title: t('dashboard.roomsAndSeats'), icon: Building2, href: '/dashboard/rooms' },
    { title: t('dashboard.payments'), icon: CreditCard, href: '/dashboard/payments' },
    { title: t('dashboard.reports'), icon: TrendingUp, href: '/dashboard/reports' },
    { title: t('dashboard.settings'), icon: Settings, href: '/dashboard/settings' }
  ]

  useEffect(() => {
    // التحقق من نوع المستخدم - Dashboard للأدمن فقط
    const userType = localStorage.getItem('userType')
    if (userType !== 'admin') {
      // إذا كان مستخدم عادي، توجيهه لصفحته
      if (userType === 'user') {
        router.push('/user/profile')
      } else {
        // إذا لم يسجل دخول، توجيهه لصفحة تسجيل الدخول
        router.push('/login')
      }
      return
    }

    // Check for dark mode preference
    const isDark = localStorage.getItem('darkMode') === 'true'
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  }, [router])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'completed': return 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, { ar: string; en: string }> = {
      'confirmed': { ar: 'مؤكد', en: 'Confirmed' },
      'pending': { ar: 'قيد الانتظار', en: 'Pending' },
      'completed': { ar: 'مكتمل', en: 'Completed' },
      'cancelled': { ar: 'ملغي', en: 'Cancelled' }
    }
    return statusMap[status]?.[i18n.language === 'ar' ? 'ar' : 'en'] || status
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors" dir={dir}>
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-50 w-72 bg-white dark:bg-gray-800 shadow-xl transform transition-transform lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <div className="flex items-center space-x-reverse space-x-3">
            <Building2 className="w-10 h-10 text-primary-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('dashboard.businessCenter')}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.controlPanel')}</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item, index) => (
            <motion.a
              key={item.title}
              href={item.href}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center space-x-reverse space-x-3 px-4 py-3 rounded-xl transition-all ${
                item.active 
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.title}</span>
            </motion.a>
          ))}
        </nav>

        {/* Language Switcher & User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t dark:border-gray-700 space-y-3">
          {/* Back to Home Button */}
          <Link
            href="/"
            className="flex items-center justify-center space-x-reverse space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition"
          >
            <ArrowRight className="w-5 h-5" />
            <span className="text-sm font-medium">{t('common.backToHome')}</span>
          </Link>
          
          {/* Language Switcher */}
          <div className="flex justify-center">
            <LanguageSwitcher />
          </div>
          
          {/* User Profile */}
          <div className="flex items-center space-x-reverse space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{t('dashboard.systemAdmin')}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">admin@business.com</p>
            </div>
            <button
              onClick={() => router.push('/login')}
              className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:mr-72">
        {/* Top Bar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-reverse space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 dark:text-gray-400"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('dashboard.search')}
                  className="w-64 lg:w-96 pr-10 pl-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-reverse space-x-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Add New */}
              <button 
                onClick={() => router.push('/booking')}
                className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 flex items-center space-x-reverse space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">{t('dashboard.newBooking')}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('dashboard.title')}</h1>
            <p className="text-gray-600 dark:text-gray-400">{t('dashboard.subtitle')}</p>
          </div>

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
                  <span className={`flex items-center text-sm font-medium ${
                    stat.change > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stat.change > 0 ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />}
                    {Math.abs(stat.change)}%
                  </span>
                </div>
                <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Recent Bookings */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <div className="p-6 border-b dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('dashboard.recentBookings')}</h2>
                <div className="flex items-center space-x-reverse space-x-2">
                  <select 
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-3 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                  >
                    <option value="today">{i18n.language === 'ar' ? 'اليوم' : 'Today'}</option>
                    <option value="week">{i18n.language === 'ar' ? 'هذا الأسبوع' : 'This Week'}</option>
                    <option value="month">{i18n.language === 'ar' ? 'هذا الشهر' : 'This Month'}</option>
                  </select>
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <Filter className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <Download className="w-4 h-4" />
                  </button>
                  <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('dashboard.customer')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('dashboard.room')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('dashboard.date')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {i18n.language === 'ar' ? 'الوقت' : 'Time'}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('dashboard.status')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('dashboard.amount')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('dashboard.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center ml-3">
                            <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{booking.customerName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {booking.roomType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {booking.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 ml-1 text-gray-400" />
                          {booking.time}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                          {getStatusText(booking.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {booking.amount} {t('common.currency')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t dark:border-gray-700 flex items-center justify-between">
              <p className="text-sm text-gray-700 dark:text-gray-400">
                {i18n.language === 'ar' ? (
                  <>عرض <span className="font-medium">1</span> إلى <span className="font-medium">4</span> من{' '}<span className="font-medium">20</span> نتيجة</>
                ) : (
                  <>Showing <span className="font-medium">1</span> to <span className="font-medium">4</span> of{' '}<span className="font-medium">20</span> results</>
                )}
              </p>
              <div className="flex space-x-reverse space-x-2">
                <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
                  {i18n.language === 'ar' ? 'السابق' : 'Previous'}
                </button>
                <button className="px-3 py-1 bg-primary-600 text-white rounded-lg text-sm">1</button>
                <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
                  2
                </button>
                <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
                  3
                </button>
                <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
                  {i18n.language === 'ar' ? 'التالي' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
