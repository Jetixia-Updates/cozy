'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { motion } from 'framer-motion'
import { 
  Calendar,
  Search,
  Filter,
  Plus,
  Download,
  Clock,
  User,
  Building2,
  CreditCard,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  CalendarCheck,
  Ban,
  RefreshCw,
  FileText,
  Printer,
  ArrowRight
} from 'lucide-react'

interface Booking {
  id: string
  bookingNumber: string
  customer: {
    name: string
    email: string
    phone: string
    avatar?: string
  }
  room: {
    name: string
    type: string
    floor: number
    capacity: number
  }
  date: string
  startTime: string
  endTime: string
  duration: number
  amount: number
  paymentStatus: 'paid' | 'pending' | 'partial' | 'refunded'
  bookingStatus: 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'no-show'
  services: string[]
  notes?: string
  createdAt: string
}

export default function BookingsPage() {
  const router = useRouter()
  const { t, i18n } = useTranslation()
  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showNewBookingModal, setShowNewBookingModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [viewType, setViewType] = useState<'list' | 'calendar'>('list')
  const [bookingsList, setBookingsList] = useState<Booking[]>([])

  // Sample bookings data
  const bookings: Booking[] = [
    {
      id: '1',
      bookingNumber: 'BK-2024-001',
      customer: {
        name: 'أحمد محمد السعيد',
        email: 'ahmad@example.com',
        phone: '01012345678'
      },
      room: {
        name: 'قاعة الماسية',
        type: 'قاعة اجتماعات',
        floor: 2,
        capacity: 20
      },
      date: '2024-11-07',
      startTime: '10:00',
      endTime: '12:00',
      duration: 2,
      amount: 450,
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
      services: ['قهوة ومشروبات', 'شاشة عرض', 'واي فاي فائق السرعة'],
      notes: 'العميل يحتاج إلى تجهيز الغرفة قبل الموعد بـ 15 دقيقة',
      createdAt: '2024-11-06T14:30:00'
    },
    {
      id: '2',
      bookingNumber: 'BK-2024-002',
      customer: {
        name: 'سارة أحمد الغامدي',
        email: 'sara@example.com',
        phone: '01098765432'
      },
      room: {
        name: 'مكتب خاص A12',
        type: 'مكتب خاص',
        floor: 1,
        capacity: 1
      },
      date: '2024-11-07',
      startTime: '09:00',
      endTime: '18:00',
      duration: 9,
      amount: 250,
      paymentStatus: 'pending',
      bookingStatus: 'pending',
      services: ['واي فاي', 'مواقف سيارات'],
      createdAt: '2024-11-06T16:45:00'
    },
    {
      id: '3',
      bookingNumber: 'BK-2024-003',
      customer: {
        name: 'شركة التقنية المتقدمة',
        email: 'info@tech.com',
        phone: '01123456789'
      },
      room: {
        name: 'قاعة التدريب الكبرى',
        type: 'قاعة تدريب',
        floor: 3,
        capacity: 50
      },
      date: '2024-11-08',
      startTime: '09:00',
      endTime: '17:00',
      duration: 8,
      amount: 1200,
      paymentStatus: 'partial',
      bookingStatus: 'confirmed',
      services: ['قهوة ومشروبات', 'غداء', 'معدات صوتية', 'تسجيل فيديو'],
      notes: 'ورشة عمل لـ 35 شخص',
      createdAt: '2024-11-05T10:20:00'
    },
    {
      id: '4',
      bookingNumber: 'BK-2024-004',
      customer: {
        name: 'محمد عبدالله القحطاني',
        email: 'mohammed@example.com',
        phone: '01555555555'
      },
      room: {
        name: 'مساحة عمل مشتركة',
        type: 'مقعد مشترك',
        floor: 1,
        capacity: 1
      },
      date: '2024-11-07',
      startTime: '14:00',
      endTime: '18:00',
      duration: 4,
      amount: 80,
      paymentStatus: 'paid',
      bookingStatus: 'completed',
      services: ['واي فاي'],
      createdAt: '2024-11-07T08:00:00'
    },
    {
      id: '5',
      bookingNumber: 'BK-2024-005',
      customer: {
        name: 'فاطمة علي الزهراني',
        email: 'fatima@example.com',
        phone: '01033333333'
      },
      room: {
        name: 'غرفة اجتماعات صغيرة B3',
        type: 'قاعة اجتماعات',
        floor: 2,
        capacity: 6
      },
      date: '2024-11-09',
      startTime: '11:00',
      endTime: '13:00',
      duration: 2,
      amount: 180,
      paymentStatus: 'paid',
      bookingStatus: 'cancelled',
      services: ['قهوة ومشروبات', 'شاشة عرض'],
      notes: 'تم الإلغاء بناء على طلب العميل',
      createdAt: '2024-11-06T12:15:00'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'completed': return 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'no-show': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 dark:text-green-400'
      case 'pending': return 'text-yellow-600 dark:text-yellow-400'
      case 'partial': return 'text-orange-600 dark:text-orange-400'
      case 'refunded': return 'text-purple-600 dark:text-purple-400'
      default: return 'text-gray-600'
    }
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'confirmed': 'مؤكد',
      'pending': 'قيد الانتظار',
      'completed': 'مكتمل',
      'cancelled': 'ملغي',
      'no-show': 'لم يحضر',
      'paid': 'مدفوع',
      'partial': 'دفعة جزئية',
      'refunded': 'مسترد'
    }
    return statusMap[status] || status
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'completed': return <CalendarCheck className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
      case 'no-show': return <Ban className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.bookingNumber.includes(searchQuery) ||
                         booking.customer.name.includes(searchQuery) ||
                         booking.room.name.includes(searchQuery)
    const matchesStatus = filterStatus === 'all' || booking.bookingStatus === filterStatus
    const matchesDate = !selectedDate || booking.date === selectedDate
    
    return matchesSearch && matchesStatus && matchesDate
  })

  // Handler functions for buttons
  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setShowEditModal(true)
    // في التطبيق الحقيقي، ستفتح نافذة تحرير مع بيانات الحجز
  }

  const handleDeleteBooking = (booking: Booking) => {
    if (confirm(`هل أنت متأكد من حذف الحجز ${booking.bookingNumber}؟`)) {
      // في التطبيق الحقيقي، سيتم حذف الحجز من قاعدة البيانات
      alert(`تم حذف الحجز ${booking.bookingNumber} بنجاح!`)
    }
  }

  const handleCancelBooking = (booking: Booking) => {
    if (confirm(`هل تريد إلغاء الحجز ${booking.bookingNumber}؟`)) {
      // في التطبيق الحقيقي، سيتم تحديث حالة الحجز في قاعدة البيانات
      alert(`تم إلغاء الحجز ${booking.bookingNumber} بنجاح!`)
    }
  }

  const handleConfirmBooking = (booking: Booking) => {
    if (confirm(`هل تريد تأكيد الحجز ${booking.bookingNumber}؟`)) {
      // في التطبيق الحقيقي، سيتم تحديث حالة الحجز
      alert(`تم تأكيد الحجز ${booking.bookingNumber} بنجاح!`)
    }
  }

  const handleRefreshBookings = () => {
    // في التطبيق الحقيقي، سيتم تحديث البيانات من السيرفر
    alert('جاري تحديث البيانات...')
  }

  const handlePrintBookings = () => {
    // في التطبيق الحقيقي، سيتم طباعة التقرير
    window.print()
  }

  const handleExportBookings = () => {
    // في التطبيق الحقيقي، سيتم تصدير البيانات كملف CSV أو Excel
    alert('جاري تصدير البيانات...')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6" dir={dir}>
      {/* Back Button & Language Switcher */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center space-x-reverse space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition"
        >
          <ArrowRight className="w-5 h-5" />
          <span>{t('common.backToDashboard')}</span>
        </button>
        <LanguageSwitcher />
      </div>
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('bookings.title')}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{t('bookings.subtitle')}</p>
          </div>
          <div className="flex gap-3">
          <button
            onClick={() => router.push('/booking')}
            className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 flex items-center space-x-reverse space-x-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>{t('bookings.newBooking')}</span>
          </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{i18n.language === 'ar' ? 'إجمالي الحجوزات' : 'Total Bookings'}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">156</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">{i18n.language === 'ar' ? '+12% من الشهر السابق' : '+12% from last month'}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{i18n.language === 'ar' ? 'حجوزات اليوم' : 'Today\'s Bookings'}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
                <p className="text-xs text-gray-500 mt-1">{i18n.language === 'ar' ? '18 مؤكد، 6 قيد الانتظار' : '18 confirmed, 6 pending'}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <CalendarCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{i18n.language === 'ar' ? 'الإيرادات اليوم' : 'Today\'s Revenue'}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">8,450 {t('common.currency')}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">{i18n.language === 'ar' ? '+18% من أمس' : '+18% from yesterday'}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{i18n.language === 'ar' ? 'نسبة الإشغال' : 'Occupancy Rate'}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">78%</p>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">{i18n.language === 'ar' ? '15 غرفة متاحة' : '15 rooms available'}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="بحث برقم الحجز، اسم العميل، أو الغرفة..."
                  className="w-full pr-10 pl-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">جميع الحالات</option>
              <option value="confirmed">مؤكد</option>
              <option value="pending">قيد الانتظار</option>
              <option value="completed">مكتمل</option>
              <option value="cancelled">ملغي</option>
              <option value="no-show">لم يحضر</option>
            </select>

            {/* Date Filter */}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
            />

            {/* View Type */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewType('list')}
                className={`px-3 py-1 rounded ${viewType === 'list' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
              >
                قائمة
              </button>
              <button
                onClick={() => setViewType('calendar')}
                className={`px-3 py-1 rounded ${viewType === 'calendar' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
              >
                تقويم
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button 
                onClick={handleRefreshBookings}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                title="تحديث البيانات"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button 
                onClick={handlePrintBookings}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                title="طباعة"
              >
                <Printer className="w-5 h-5" />
              </button>
              <button 
                onClick={handleExportBookings}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                title="تصدير"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  رقم الحجز
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  العميل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  الغرفة/المقعد
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  التاريخ والوقت
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  المبلغ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  الدفع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {booking.bookingNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center ml-3">
                        <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{booking.customer.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{booking.customer.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{booking.room.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">الطابق {booking.room.floor} • سعة {booking.room.capacity}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">{booking.date}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                        <Clock className="w-3 h-3 ml-1" />
                        {booking.startTime} - {booking.endTime}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{booking.amount} ج.م</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{booking.duration} ساعة</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.bookingStatus)}`}>
                      {getStatusIcon(booking.bookingStatus)}
                      <span className="mr-1">{getStatusText(booking.bookingStatus)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                      {getStatusText(booking.paymentStatus)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-reverse space-x-2">
                      <button
                        onClick={() => {
                          setSelectedBooking(booking)
                          setShowDetailsModal(true)
                        }}
                        className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                        title="عرض التفاصيل"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditBooking(booking)}
                        className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                        title="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteBooking(booking)}
                        className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t dark:border-gray-700 flex items-center justify-between">
          <p className="text-sm text-gray-700 dark:text-gray-400">
            عرض <span className="font-medium">1</span> إلى <span className="font-medium">5</span> من{' '}
            <span className="font-medium">{bookings.length}</span> نتيجة
          </p>
          <div className="flex items-center space-x-reverse space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
            >
              <ChevronRight className="w-4 h-4 ml-1" />
              السابق
            </button>
            <button className="px-3 py-1 bg-primary-600 text-white rounded-lg text-sm">1</button>
            <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700">2</button>
            <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700">3</button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
            >
              التالي
              <ChevronLeft className="w-4 h-4 mr-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">تفاصيل الحجز</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Booking Number */}
              <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400">رقم الحجز</p>
                <p className="text-xl font-bold text-primary-600 dark:text-primary-400">{selectedBooking.bookingNumber}</p>
              </div>

              {/* Customer Info */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <User className="w-5 h-5 ml-2" />
                  معلومات العميل
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">الاسم</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedBooking.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">البريد الإلكتروني</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedBooking.customer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">الهاتف</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedBooking.customer.phone}</p>
                  </div>
                </div>
              </div>

              {/* Room Info */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Building2 className="w-5 h-5 ml-2" />
                  معلومات الغرفة
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">اسم الغرفة</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedBooking.room.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">النوع</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedBooking.room.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">الطابق</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedBooking.room.floor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">السعة</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedBooking.room.capacity} أشخاص</p>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Calendar className="w-5 h-5 ml-2" />
                  تفاصيل الحجز
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">التاريخ</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedBooking.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">الوقت</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedBooking.startTime} - {selectedBooking.endTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">المدة</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedBooking.duration} ساعة</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">المبلغ</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedBooking.amount} ج.م</p>
                  </div>
                </div>
              </div>

              {/* Services */}
              {selectedBooking.services && selectedBooking.services.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">الخدمات المطلوبة</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedBooking.services.map((service, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedBooking.notes && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">ملاحظات</h4>
                  <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    {selectedBooking.notes}
                  </p>
                </div>
              )}

              {/* Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">حالة الحجز</p>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedBooking.bookingStatus)}`}>
                    {getStatusIcon(selectedBooking.bookingStatus)}
                    <span className="mr-1">{getStatusText(selectedBooking.bookingStatus)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">حالة الدفع</p>
                  <span className={`text-sm font-medium ${getPaymentStatusColor(selectedBooking.paymentStatus)}`}>
                    {getStatusText(selectedBooking.paymentStatus)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t dark:border-gray-700 flex gap-3 justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                إغلاق
              </button>
              <button
                onClick={() => {
                  handleEditBooking(selectedBooking)
                  setShowDetailsModal(false)
                }}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                تعديل الحجز
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* New/Edit Booking Modal */}
      {(showNewBookingModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full"
          >
            <div className="p-6 border-b dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {showEditModal ? 'تعديل الحجز' : 'حجز جديد'}
                </h3>
                <button
                  onClick={() => {
                    setShowNewBookingModal(false)
                    setShowEditModal(false)
                    setSelectedBooking(null)
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                {showEditModal 
                  ? `نموذج تعديل الحجز ${selectedBooking?.bookingNumber} سيتم تطويره قريباً`
                  : 'نموذج الحجز الجديد سيتم تطويره قريباً'}
              </p>
              <p className="text-center text-sm text-gray-500 dark:text-gray-500">
                يمكنك استخدام صفحة الحجز الرئيسية من Dashboard
              </p>
            </div>

            <div className="p-6 border-t dark:border-gray-700 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowNewBookingModal(false)
                  setShowEditModal(false)
                  setSelectedBooking(null)
                }}
                className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                إلغاء
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
