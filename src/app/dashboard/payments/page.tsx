'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { motion } from 'framer-motion'
import { 
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  FileText,
  Printer,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Receipt,
  BanknoteIcon,
  Smartphone,
  Globe,
  Shield,
  User,
  ArrowRight
} from 'lucide-react'

interface Payment {
  id: string
  transactionId: string
  bookingId: string
  customerName: string
  amount: number
  method: 'credit-card' | 'debit-card' | 'bank-transfer' | 'cash' | 'wallet' | 'apple-pay' | 'stc-pay'
  status: 'completed' | 'pending' | 'failed' | 'refunded' | 'processing'
  type: 'payment' | 'refund'
  date: string
  time: string
  description: string
  invoice?: string
}

export default function PaymentsPage() {
  const router = useRouter()
  const { t, i18n } = useTranslation()
  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterMethod, setFilterMethod] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [newInvoice, setNewInvoice] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    bookingId: '',
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
    taxRate: 14,
    notes: ''
  })

  // Sample payments data
  const payments: Payment[] = [
    {
      id: '1',
      transactionId: 'TRX-2024-001',
      bookingId: 'BK-2024-001',
      customerName: 'أحمد محمد السعيد',
      amount: 450,
      method: 'credit-card',
      status: 'completed',
      type: 'payment',
      date: '2024-11-07',
      time: '10:15:30',
      description: 'دفع حجز قاعة الماسية',
      invoice: 'INV-2024-001'
    },
    {
      id: '2',
      transactionId: 'TRX-2024-002',
      bookingId: 'BK-2024-002',
      customerName: 'سارة أحمد الغامدي',
      amount: 250,
      method: 'stc-pay',
      status: 'pending',
      type: 'payment',
      date: '2024-11-07',
      time: '11:30:45',
      description: 'دفع حجز مكتب خاص',
    },
    {
      id: '3',
      transactionId: 'TRX-2024-003',
      bookingId: 'BK-2024-003',
      customerName: 'شركة التقنية المتقدمة',
      amount: 1200,
      method: 'bank-transfer',
      status: 'completed',
      type: 'payment',
      date: '2024-11-06',
      time: '14:20:15',
      description: 'دفع حجز قاعة تدريب',
      invoice: 'INV-2024-003'
    },
    {
      id: '4',
      transactionId: 'TRX-2024-004',
      bookingId: 'BK-2024-005',
      customerName: 'فاطمة علي الزهراني',
      amount: -180,
      method: 'credit-card',
      status: 'completed',
      type: 'refund',
      date: '2024-11-06',
      time: '16:45:00',
      description: 'استرداد مبلغ حجز ملغي',
    },
    {
      id: '5',
      transactionId: 'TRX-2024-005',
      bookingId: 'BK-2024-004',
      customerName: 'محمد عبدالله القحطاني',
      amount: 80,
      method: 'apple-pay',
      status: 'processing',
      type: 'payment',
      date: '2024-11-07',
      time: '09:00:00',
      description: 'دفع حجز مساحة مشتركة',
    }
  ]

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'credit-card':
      case 'debit-card':
        return <CreditCard className="w-4 h-4" />
      case 'bank-transfer':
        return <BanknoteIcon className="w-4 h-4" />
      case 'cash':
        return <DollarSign className="w-4 h-4" />
      case 'wallet':
        return <Wallet className="w-4 h-4" />
      case 'apple-pay':
      case 'stc-pay':
        return <Smartphone className="w-4 h-4" />
      default:
        return <Globe className="w-4 h-4" />
    }
  }

  const getMethodText = (method: string) => {
    const methodMap: Record<string, string> = {
      'credit-card': 'بطاقة ائتمان',
      'debit-card': 'بطاقة مدى',
      'bank-transfer': 'حوالة بنكية',
      'cash': 'نقدي',
      'wallet': 'محفظة إلكترونية',
      'apple-pay': 'Apple Pay',
      'stc-pay': 'STC Pay'
    }
    return methodMap[method] || method
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'refunded': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'processing': return <RefreshCw className="w-4 h-4 animate-spin" />
      case 'failed': return <XCircle className="w-4 h-4" />
      case 'refunded': return <ArrowDownLeft className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'completed': 'مكتملة',
      'pending': 'معلقة',
      'processing': 'قيد المعالجة',
      'failed': 'فشلت',
      'refunded': 'مستردة'
    }
    return statusMap[status] || status
  }

  const addInvoiceItem = () => {
    setNewInvoice({
      ...newInvoice,
      items: [...newInvoice.items, { description: '', quantity: 1, unitPrice: 0 }]
    })
  }

  const removeInvoiceItem = (index: number) => {
    const items = newInvoice.items.filter((_, i) => i !== index)
    setNewInvoice({ ...newInvoice, items })
  }

  const updateInvoiceItem = (index: number, field: string, value: any) => {
    const items = [...newInvoice.items]
    items[index] = { ...items[index], [field]: value }
    setNewInvoice({ ...newInvoice, items })
  }

  const calculateInvoiceTotal = () => {
    const subtotal = newInvoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
    const tax = subtotal * (newInvoice.taxRate / 100)
    return { subtotal, tax, total: subtotal + tax }
  }

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault()
    const { subtotal, tax, total } = calculateInvoiceTotal()
    
    // Here you would typically send this to your backend
    console.log('Invoice created:', {
      ...newInvoice,
      invoiceNumber: `INV-${Date.now()}`,
      date: new Date().toISOString(),
      subtotal,
      tax,
      total
    })
    
    alert(`تم إنشاء الفاتورة بنجاح!\nالإجمالي: ${total.toLocaleString()} ج.م`)
    
    // Reset form
    setNewInvoice({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      bookingId: '',
      items: [{ description: '', quantity: 1, unitPrice: 0 }],
      taxRate: 14,
      notes: ''
    })
    setShowInvoiceModal(false)
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.transactionId.includes(searchQuery) ||
                         payment.customerName.includes(searchQuery) ||
                         payment.bookingId.includes(searchQuery)
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus
    const matchesMethod = filterMethod === 'all' || payment.method === filterMethod
    const matchesType = filterType === 'all' || payment.type === filterType
    
    return matchesSearch && matchesStatus && matchesMethod && matchesType
  })

  // Calculate stats
  const totalRevenue = payments.filter(p => p.type === 'payment' && p.status === 'completed').reduce((sum, p) => sum + p.amount, 0)
  const totalRefunds = payments.filter(p => p.type === 'refund').reduce((sum, p) => sum + Math.abs(p.amount), 0)
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)
  const todayTransactions = payments.filter(p => p.date === '2024-11-07').length

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('payments.title')}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{t('payments.subtitle')}</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowInvoiceModal(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center space-x-reverse space-x-2 shadow-lg"
            >
              <Receipt className="w-5 h-5" />
              <span>{t('payments.createInvoice')}</span>
            </button>
            <button className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 flex items-center space-x-reverse space-x-2 shadow-lg">
              <DollarSign className="w-5 h-5" />
              <span>{t('payments.recordPayment')}</span>
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
                <p className="text-sm text-gray-600 dark:text-gray-400">{i18n.language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalRevenue.toLocaleString()} {t('common.currency')}</p>
                <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-1">
                  <TrendingUp className="w-3 h-3 ml-1" />
                  {i18n.language === 'ar' ? '+12.5% من الشهر السابق' : '+12.5% from last month'}
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
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
                <p className="text-sm text-gray-600 dark:text-gray-400">{i18n.language === 'ar' ? 'المبالغ المعلقة' : 'Pending Amount'}</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{pendingAmount.toLocaleString()} {t('common.currency')}</p>
                <p className="text-xs text-gray-500 mt-1">{i18n.language === 'ar' ? 'في انتظار التأكيد' : 'Awaiting confirmation'}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
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
                <p className="text-sm text-gray-600 dark:text-gray-400">{i18n.language === 'ar' ? 'المبالغ المستردة' : 'Refunded Amount'}</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalRefunds.toLocaleString()} {t('common.currency')}</p>
                <div className="flex items-center text-xs text-red-600 dark:text-red-400 mt-1">
                  <TrendingDown className="w-3 h-3 ml-1" />
                  {i18n.language === 'ar' ? '-2.3% من الشهر السابق' : '-2.3% from last month'}
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <ArrowDownLeft className="w-6 h-6 text-purple-600 dark:text-purple-400" />
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
                <p className="text-sm text-gray-600 dark:text-gray-400">{i18n.language === 'ar' ? 'معاملات اليوم' : 'Today\'s Transactions'}</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{todayTransactions}</p>
                <p className="text-xs text-gray-500 mt-1">{i18n.language === 'ar' ? 'معاملة جديدة' : 'new transactions'}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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
                  placeholder="بحث برقم المعاملة، اسم العميل، أو رقم الحجز..."
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
              <option value="completed">مكتملة</option>
              <option value="pending">معلقة</option>
              <option value="processing">قيد المعالجة</option>
              <option value="failed">فشلت</option>
              <option value="refunded">مستردة</option>
            </select>

            {/* Method Filter */}
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">جميع الطرق</option>
              <option value="credit-card">بطاقة ائتمان</option>
              <option value="debit-card">بطاقة مدى</option>
              <option value="bank-transfer">حوالة بنكية</option>
              <option value="cash">نقدي</option>
              <option value="apple-pay">Apple Pay</option>
              <option value="stc-pay">STC Pay</option>
            </select>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">جميع الأنواع</option>
              <option value="payment">مدفوعات</option>
              <option value="refund">مستردات</option>
            </select>

            {/* Date Range */}
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <span className="text-gray-500">إلى</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
            />

            {/* Actions */}
            <div className="flex gap-2">
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Printer className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  رقم المعاملة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  العميل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  المبلغ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  طريقة الدفع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  التاريخ والوقت
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  الوصف
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{payment.transactionId}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{payment.bookingId}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center ml-3">
                        <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white">{payment.customerName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-bold ${payment.type === 'refund' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                      <div className="flex items-center">
                        {payment.type === 'refund' ? <ArrowDownLeft className="w-4 h-4 ml-1" /> : <ArrowUpRight className="w-4 h-4 ml-1" />}
                        {Math.abs(payment.amount).toLocaleString()} ج.م
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getMethodIcon(payment.method)}
                      <span className="text-sm text-gray-900 dark:text-white mr-2">{getMethodText(payment.method)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">{payment.date}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{payment.time}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{payment.description}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      <span className="mr-1">{getStatusText(payment.status)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-reverse space-x-2">
                      <button
                        onClick={() => {
                          setSelectedPayment(payment)
                          setShowDetailsModal(true)
                        }}
                        className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {payment.invoice && (
                        <button className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                          <FileText className="w-4 h-4" />
                        </button>
                      )}
                      {payment.status === 'completed' && payment.type === 'payment' && (
                        <button className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
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
            <span className="font-medium">{payments.length}</span> نتيجة
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

      {/* Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowInvoiceModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Receipt className="w-6 h-6 text-green-600" />
                  إنشاء فاتورة جديدة
                </h2>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateInvoice} className="space-y-6">
                {/* Customer Information */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">بيانات العميل</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        اسم العميل *
                      </label>
                      <input
                        type="text"
                        required
                        value={newInvoice.customerName}
                        onChange={(e) => setNewInvoice({ ...newInvoice, customerName: e.target.value })}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="أدخل اسم العميل"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        البريد الإلكتروني
                      </label>
                      <input
                        type="email"
                        value={newInvoice.customerEmail}
                        onChange={(e) => setNewInvoice({ ...newInvoice, customerEmail: e.target.value })}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="example@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        رقم الهاتف
                      </label>
                      <input
                        type="tel"
                        value={newInvoice.customerPhone}
                        onChange={(e) => setNewInvoice({ ...newInvoice, customerPhone: e.target.value })}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="+20 100 000 0000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        رقم الحجز
                      </label>
                      <input
                        type="text"
                        value={newInvoice.bookingId}
                        onChange={(e) => setNewInvoice({ ...newInvoice, bookingId: e.target.value })}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="BK-2024-001"
                      />
                    </div>
                  </div>
                </div>

                {/* Invoice Items */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">بنود الفاتورة</h3>
                    <button
                      type="button"
                      onClick={addInvoiceItem}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-2"
                    >
                      <span>+</span>
                      <span>إضافة بند</span>
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {newInvoice.items.map((item, index) => (
                      <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                          <div className="md:col-span-5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              الوصف *
                            </label>
                            <input
                              type="text"
                              required
                              value={item.description}
                              onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
                              placeholder="وصف الخدمة أو المنتج"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              الكمية *
                            </label>
                            <input
                              type="number"
                              required
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateInvoiceItem(index, 'quantity', parseInt(e.target.value))}
                              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              السعر (ج.م) *
                            </label>
                            <input
                              type="number"
                              required
                              min="0"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => updateInvoiceItem(index, 'unitPrice', parseFloat(e.target.value))}
                              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          <div className="md:col-span-2 flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {(item.quantity * item.unitPrice).toFixed(2)} ج.م
                            </span>
                            {newInvoice.items.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeInvoiceItem(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tax and Total */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        نسبة الضريبة (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={newInvoice.taxRate}
                        onChange={(e) => setNewInvoice({ ...newInvoice, taxRate: parseFloat(e.target.value) })}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        ملاحظات
                      </label>
                      <input
                        type="text"
                        value={newInvoice.notes}
                        onChange={(e) => setNewInvoice({ ...newInvoice, notes: e.target.value })}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="ملاحظات إضافية"
                      />
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="border-t border-gray-300 dark:border-gray-600 pt-4 space-y-2">
                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>المجموع الفرعي:</span>
                      <span className="font-semibold">{calculateInvoiceTotal().subtotal.toFixed(2)} ج.م</span>
                    </div>
                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>الضريبة ({newInvoice.taxRate}%):</span>
                      <span className="font-semibold">{calculateInvoiceTotal().tax.toFixed(2)} ج.م</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white border-t border-gray-300 dark:border-gray-600 pt-2">
                      <span>الإجمالي:</span>
                      <span className="text-green-600">{calculateInvoiceTotal().total.toFixed(2)} ج.م</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowInvoiceModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:from-green-700 hover:to-green-600 font-medium transition shadow-lg"
                  >
                    إنشاء الفاتورة
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
