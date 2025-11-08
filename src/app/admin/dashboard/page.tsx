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
  Moon,
  Shield
} from 'lucide-react'

export default function AdminDashboardPage() {
  const router = useRouter()
  const { t, i18n } = useTranslation()
  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // التحقق من أن المستخدم admin
  useEffect(() => {
    const userType = localStorage.getItem('userType')
    if (userType !== 'admin') {
      router.push('/admin/login')
    }
  }, [router])

  const stats = [
    {
      title: i18n.language === 'ar' ? 'الإيرادات الشهرية' : 'Monthly Revenue',
      value: '45,280 ' + t('common.currency'),
      change: 12.5,
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: i18n.language === 'ar' ? 'إجمالي الحجوزات' : 'Total Bookings',
      value: '2,845',
      change: 8.2,
      icon: Calendar,
      color: 'bg-primary-500'
    },
    {
      title: i18n.language === 'ar' ? 'العملاء النشطين' : 'Active Users',
      value: '1,234',
      change: 15.3,
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      title: i18n.language === 'ar' ? 'نسبة الإشغال' : 'Occupancy Rate',
      value: '84%',
      change: 5.1,
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ]

  const sidebarItems = [
    { title: i18n.language === 'ar' ? 'لوحة التحكم' : 'Dashboard', icon: Grid, href: '/admin/dashboard', active: true },
    { title: i18n.language === 'ar' ? 'الحجوزات' : 'Bookings', icon: Calendar, href: '/dashboard/bookings' },
    { title: i18n.language === 'ar' ? 'العملاء' : 'Customers', icon: Users, href: '/dashboard/customers' },
    { title: i18n.language === 'ar' ? 'الغرف والمقاعد' : 'Rooms & Seats', icon: Building2, href: '/dashboard/rooms' },
    { title: i18n.language === 'ar' ? 'المدفوعات' : 'Payments', icon: CreditCard, href: '/dashboard/payments' },
    { title: i18n.language === 'ar' ? 'التقارير' : 'Reports', icon: TrendingUp, href: '/dashboard/reports' },
    { title: i18n.language === 'ar' ? 'الإعدادات' : 'Settings', icon: Settings, href: '/dashboard/settings' }
  ]

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true'
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

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

  const handleLogout = () => {
    localStorage.removeItem('userType')
    localStorage.removeItem('adminEmail')
    router.push('/admin/login')
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
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{i18n.language === 'ar' ? 'لوحة الأدمن' : 'Admin Panel'}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{i18n.language === 'ar' ? 'مركز التحكم' : 'Control Center'}</p>
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
          
          {/* Admin Profile */}
          <div className="flex items-center space-x-reverse space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{i18n.language === 'ar' ? 'المدير' : 'Administrator'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">admin@cozyhive.eg</p>
            </div>
            <button
              onClick={handleLogout}
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
                  placeholder={i18n.language === 'ar' ? 'بحث...' : 'Search...'}
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
                <span className="hidden sm:inline">{i18n.language === 'ar' ? 'حجز جديد' : 'New Booking'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {i18n.language === 'ar' ? 'لوحة التحكم' : 'Admin Dashboard'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {i18n.language === 'ar' ? 'مرحباً بعودتك! إليك نظرة عامة على النظام' : 'Welcome back! Here\'s an overview of the system'}
            </p>
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

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {i18n.language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/dashboard/bookings"
                className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-500 dark:hover:border-primary-500 transition text-center"
              >
                <Calendar className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {i18n.language === 'ar' ? 'إدارة الحجوزات' : 'Manage Bookings'}
                </p>
              </Link>
              
              <Link
                href="/dashboard/customers"
                className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-500 dark:hover:border-primary-500 transition text-center"
              >
                <Users className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {i18n.language === 'ar' ? 'إدارة العملاء' : 'Manage Customers'}
                </p>
              </Link>
              
              <Link
                href="/dashboard/rooms"
                className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-500 dark:hover:border-primary-500 transition text-center"
              >
                <Building2 className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {i18n.language === 'ar' ? 'إدارة الغرف' : 'Manage Rooms'}
                </p>
              </Link>
              
              <Link
                href="/dashboard/payments"
                className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-500 dark:hover:border-primary-500 transition text-center"
              >
                <CreditCard className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {i18n.language === 'ar' ? 'إدارة المدفوعات' : 'Manage Payments'}
                </p>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

