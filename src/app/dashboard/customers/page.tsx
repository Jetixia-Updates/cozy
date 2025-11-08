'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { motion } from 'framer-motion'
import { 
  Users,
  Search,
  Filter,
  Plus,
  Download,
  UserPlus,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Shield,
  Star,
  Award,
  ChevronLeft,
  ChevronRight,
  FileText,
  History,
  CreditCard,
  TrendingUp,
  Settings,
  UserCheck,
  UserX,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  nationalId: string
  company?: string
  address: string
  membershipType: 'basic' | 'silver' | 'gold' | 'platinum'
  joinDate: string
  lastVisit: string
  totalBookings: number
  totalSpent: number
  loyaltyPoints: number
  status: 'active' | 'inactive' | 'blocked'
  notes?: string
  avatar?: string
}

export default function CustomersPage() {
  const router = useRouter()
  const { t, i18n } = useTranslation()
  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterMembership, setFilterMembership] = useState('all')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch customers from API
  useEffect(() => {
    fetchCustomers()
  }, [filterStatus, filterMembership])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filterStatus !== 'all') params.append('status', filterStatus)
      if (filterMembership !== 'all') params.append('membershipType', filterMembership.toUpperCase())
      
      const response = await fetch(`/api/users?role=CUSTOMER&${params}`)
      const data = await response.json()
      
      if (data.success) {
        const transformedCustomers = data.data.map((user: any) => ({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phone || '',
          nationalId: '',
          address: '',
          membershipType: user.membershipType.toLowerCase(),
          joinDate: new Date(user.createdAt).toISOString().split('T')[0],
          lastVisit: new Date(user.updatedAt).toISOString().split('T')[0],
          totalBookings: user.totalBookings || 0,
          totalSpent: user.totalSpent || 0,
          loyaltyPoints: user.loyaltyPoints || 0,
          status: 'active',
        }))
        setCustomers(transformedCustomers)
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  // Old mock data removed
  const _mockCustomers: Customer[] = [
    {
      id: '1',
      name: 'أحمد محمد السعيد',
      email: 'ahmad@example.com',
      phone: '01012345678',
      nationalId: '1234567890',
      company: 'شركة التقنية المتقدمة',
      address: 'القاهرة، مدينة نصر',
      membershipType: 'platinum',
      joinDate: '2023-05-15',
      lastVisit: '2024-11-06',
      totalBookings: 45,
      totalSpent: 15750,
      loyaltyPoints: 2350,
      status: 'active',
      notes: 'عميل VIP - يفضل الغرف الهادئة'
    },
    {
      id: '2',
      name: 'سارة أحمد الغامدي',
      email: 'sara@example.com',
      phone: '01098765432',
      nationalId: '0987654321',
      address: 'الإسكندرية، سموحة',
      membershipType: 'gold',
      joinDate: '2023-08-20',
      lastVisit: '2024-11-07',
      totalBookings: 28,
      totalSpent: 8500,
      loyaltyPoints: 1200,
      status: 'active'
    },
    {
      id: '3',
      name: 'محمد عبدالله القحطاني',
      email: 'mohammed@example.com',
      phone: '01555555555',
      nationalId: '1122334455',
      company: 'مؤسسة البناء الحديث',
      address: 'الجيزة، الدقي',
      membershipType: 'silver',
      joinDate: '2024-01-10',
      lastVisit: '2024-11-05',
      totalBookings: 12,
      totalSpent: 3200,
      loyaltyPoints: 450,
      status: 'active'
    },
    {
      id: '4',
      name: 'فاطمة علي الزهراني',
      email: 'fatima@example.com',
      phone: '01033333333',
      nationalId: '5544332211',
      address: 'القاهرة، المعادي',
      membershipType: 'basic',
      joinDate: '2024-06-15',
      lastVisit: '2024-10-20',
      totalBookings: 5,
      totalSpent: 950,
      loyaltyPoints: 100,
      status: 'inactive',
      notes: 'لم تزر منذ أكثر من أسبوعين'
    },
    {
      id: '5',
      name: 'عبدالرحمن صالح المالكي',
      email: 'abdulrahman@example.com',
      phone: '01077777777',
      nationalId: '9988776655',
      company: 'شركة الابتكار التقني',
      address: 'القاهرة الجديدة، التجمع الخامس',
      membershipType: 'gold',
      joinDate: '2023-12-01',
      lastVisit: '2024-11-07',
      totalBookings: 33,
      totalSpent: 12400,
      loyaltyPoints: 1850,
      status: 'active'
    }
  ]

  const getMembershipColor = (type: string) => {
    switch (type) {
      case 'platinum': return 'bg-gradient-to-r from-purple-600 to-purple-400 text-white'
      case 'gold': return 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-white'
      case 'silver': return 'bg-gradient-to-r from-gray-400 to-gray-300 text-white'
      case 'basic': return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const getMembershipText = (type: string) => {
    const membershipMap: Record<string, string> = {
      'platinum': 'بلاتيني',
      'gold': 'ذهبي',
      'silver': 'فضي',
      'basic': 'أساسي'
    }
    return membershipMap[type] || type
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'inactive': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'blocked': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'active': 'نشط',
      'inactive': 'غير نشط',
      'blocked': 'محظور'
    }
    return statusMap[status] || status
  }

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.phone.includes(searchQuery) ||
                         (customer.company?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus
    const matchesMembership = filterMembership === 'all' || customer.membershipType === filterMembership
    
    return matchesSearch && matchesStatus && matchesMembership
  })

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('customers.title')}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{t('customers.subtitle')}</p>
          </div>
          <div className="flex gap-3">
          <button
            onClick={() => setShowNewCustomerModal(true)}
            className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 flex items-center space-x-reverse space-x-2 shadow-lg"
          >
            <UserPlus className="w-5 h-5" />
            <span>{t('customers.newCustomer')}</span>
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
                <p className="text-sm text-gray-600 dark:text-gray-400">{i18n.language === 'ar' ? 'إجمالي العملاء' : 'Total Customers'}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">1,234</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">{i18n.language === 'ar' ? '+8% من الشهر السابق' : '+8% from last month'}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-600 dark:text-primary-400" />
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
                <p className="text-sm text-gray-600 dark:text-gray-400">{i18n.language === 'ar' ? 'عملاء نشطون' : 'Active Customers'}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">892</p>
                <p className="text-xs text-gray-500 mt-1">{i18n.language === 'ar' ? '72% من الإجمالي' : '72% of total'}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
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
                <p className="text-sm text-gray-600 dark:text-gray-400">{i18n.language === 'ar' ? 'عملاء VIP' : 'VIP Customers'}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">156</p>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">{i18n.language === 'ar' ? 'بلاتيني وذهبي' : 'Platinum & Gold'}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
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
                <p className="text-sm text-gray-600 dark:text-gray-400">{i18n.language === 'ar' ? 'متوسط الإنفاق' : 'Average Spending'}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">3,450 {t('common.currency')}</p>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">{i18n.language === 'ar' ? 'لكل عميل شهرياً' : 'per customer monthly'}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-orange-600 dark:text-orange-400" />
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
                  placeholder="بحث بالاسم، البريد الإلكتروني، الهاتف، أو الشركة..."
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
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
              <option value="blocked">محظور</option>
            </select>

            {/* Membership Filter */}
            <select
              value={filterMembership}
              onChange={(e) => setFilterMembership(e.target.value)}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">جميع العضويات</option>
              <option value="platinum">بلاتيني</option>
              <option value="gold">ذهبي</option>
              <option value="silver">فضي</option>
              <option value="basic">أساسي</option>
            </select>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Filter className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  العميل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  معلومات التواصل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  العضوية
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  الحجوزات
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  الإنفاق الكلي
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  نقاط الولاء
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
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center ml-3">
                        <Users className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{customer.name}</p>
                        {customer.company && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">{customer.company}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                        <Mail className="w-3 h-3 ml-1" />
                        {customer.email}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                        <Phone className="w-3 h-3 ml-1" />
                        {customer.phone}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getMembershipColor(customer.membershipType)}`}>
                      {getMembershipText(customer.membershipType)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{customer.totalBookings}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">آخر زيارة: {customer.lastVisit}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{customer.totalSpent.toLocaleString()} ج.م</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 ml-1" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {customer.loyaltyPoints.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                      {getStatusText(customer.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-reverse space-x-2">
                      <button
                        onClick={() => {
                          setSelectedCustomer(customer)
                          setShowDetailsModal(true)
                        }}
                        className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="relative group">
                        <button className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                          <button className="w-full text-right px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center">
                            <History className="w-4 h-4 ml-2 text-primary-600" />
                            سجل الحجوزات
                          </button>
                          <button className="w-full text-right px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center">
                            <CreditCard className="w-4 h-4 ml-2 text-green-600" />
                            سجل المدفوعات
                          </button>
                          <button className="w-full text-right px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center">
                            <Shield className="w-4 h-4 ml-2 text-purple-600" />
                            ترقية العضوية
                          </button>
                          <button className="w-full text-right px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center">
                            <Mail className="w-4 h-4 ml-2 text-orange-600" />
                            إرسال رسالة
                          </button>
                        </div>
                      </div>
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
            <span className="font-medium">{customers.length}</span> نتيجة
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
    </div>
  )
}
