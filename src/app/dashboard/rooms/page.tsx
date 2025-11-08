'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { motion } from 'framer-motion'
import { 
  Building2,
  Search,
  Filter,
  Plus,
  Grid,
  List,
  Eye,
  Edit,
  Trash2,
  Users,
  DollarSign,
  Clock,
  MapPin,
  Wifi,
  Monitor,
  Coffee,
  Car,
  Volume2,
  Video,
  Projector,
  Tv,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
  ChevronRight,
  Activity,
  TrendingUp,
  Calendar,
  Power,
  Lock,
  Unlock,
  Layers,
  Maximize,
  Minimize,
  Thermometer,
  Wind,
  FileText,
  ArrowRight
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Room {
  id: string
  name: string
  type: 'meeting-room' | 'private-office' | 'shared-space' | 'training-room' | 'conference-hall'
  floor: number
  area: number
  capacity: number
  pricePerHour: number
  pricePerDay: number
  pricePerMonth: number
  status: 'available' | 'occupied' | 'maintenance' | 'reserved'
  amenities: string[]
  images: string[]
  description: string
  occupancyRate: number
  lastBooking?: string
  nextAvailable?: string
}

interface Seat {
  id: string
  roomId: string
  seatNumber: string
  type: 'standard' | 'premium' | 'executive'
  status: 'available' | 'occupied' | 'reserved' | 'maintenance'
  currentUser?: string
  pricePerHour: number
  amenities: string[]
}

export default function RoomsPage() {
  const router = useRouter()
  const { t, i18n } = useTranslation()
  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterFloor, setFilterFloor] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'floor'>('grid')
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showNewRoomModal, setShowNewRoomModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showNewSeatModal, setShowNewSeatModal] = useState(false)
  const [showEditSeatModal, setShowEditSeatModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'rooms' | 'seats'>('rooms')
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [editingSeat, setEditingSeat] = useState<Seat | null>(null)

  // Sample rooms data - converted to state for dynamic updates
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: '1',
      name: 'غرفة 1',
      type: 'conference-hall',
      floor: 2,
      area: 120,
      capacity: 50,
      pricePerHour: 250,
      pricePerDay: 1800,
      pricePerMonth: 35000,
      status: 'available',
      amenities: ['wifi', 'projector', 'screen', 'sound', 'video', 'coffee', 'parking'],
      images: ['/room1.jpg'],
      description: 'قاعة مؤتمرات فاخرة مجهزة بأحدث التقنيات',
      occupancyRate: 85,
      lastBooking: '2024-11-07 10:00',
      nextAvailable: '2024-11-07 15:00'
    },
    {
      id: '2',
      name: 'غرفة 2',
      type: 'private-office',
      floor: 3,
      area: 25,
      capacity: 4,
      pricePerHour: 80,
      pricePerDay: 500,
      pricePerMonth: 8000,
      status: 'occupied',
      amenities: ['wifi', 'monitor', 'coffee', 'parking', 'printer'],
      images: ['/room2.jpg'],
      description: 'مكتب خاص مريح مع إطلالة رائعة',
      occupancyRate: 92,
      lastBooking: '2024-11-07 09:00',
      nextAvailable: '2024-11-08 09:00'
    },
    {
      id: '3',
      name: 'غرفة 3',
      type: 'training-room',
      floor: 1,
      area: 80,
      capacity: 30,
      pricePerHour: 150,
      pricePerDay: 1000,
      pricePerMonth: 18000,
      status: 'available',
      amenities: ['wifi', 'projector', 'screen', 'whiteboard', 'coffee'],
      images: ['/room3.jpg'],
      description: 'قاعة تدريب مجهزة بالكامل للدورات والورش',
      occupancyRate: 75,
      lastBooking: '2024-11-06 14:00',
      nextAvailable: 'الآن'
    },
    {
      id: '4',
      name: 'غرفة 4',
      type: 'shared-space',
      floor: 1,
      area: 200,
      capacity: 40,
      pricePerHour: 30,
      pricePerDay: 200,
      pricePerMonth: 3000,
      status: 'available',
      amenities: ['wifi', 'coffee', 'printer', 'lounge'],
      images: ['/room4.jpg'],
      description: 'مساحة عمل مفتوحة ومريحة للعمل الجماعي',
      occupancyRate: 65,
      lastBooking: '2024-11-07 08:00',
      nextAvailable: 'الآن'
    },
    {
      id: '5',
      name: 'غرفة 5',
      type: 'meeting-room',
      floor: 2,
      area: 20,
      capacity: 8,
      pricePerHour: 60,
      pricePerDay: 400,
      pricePerMonth: 6000,
      status: 'maintenance',
      amenities: ['wifi', 'tv', 'whiteboard', 'coffee'],
      images: ['/room5.jpg'],
      description: 'غرفة اجتماعات مناسبة للفرق الصغيرة',
      occupancyRate: 70,
      lastBooking: '2024-11-05 16:00',
      nextAvailable: '2024-11-09 09:00'
    }
  ])

  // New room state for adding
  const [newRoom, setNewRoom] = useState<Partial<Room>>({
    name: '',
    type: 'meeting-room',
    floor: 1,
    area: 0,
    capacity: 0,
    pricePerHour: 0,
    pricePerDay: 0,
    pricePerMonth: 0,
    status: 'available',
    amenities: [],
    images: [],
    description: '',
    occupancyRate: 0
  })

  // Sample seats data - converted to state
  const [seats, setSeats] = useState<Seat[]>([
    { id: '1', roomId: '4', seatNumber: 'A1', type: 'premium', status: 'available', pricePerHour: 40, amenities: ['desk-lamp', 'power-outlet', 'drawer'] },
    { id: '2', roomId: '4', seatNumber: 'A2', type: 'standard', status: 'occupied', currentUser: 'أحمد محمد', pricePerHour: 30, amenities: ['power-outlet'] },
    { id: '3', roomId: '4', seatNumber: 'A3', type: 'standard', status: 'available', pricePerHour: 30, amenities: ['power-outlet'] },
    { id: '4', roomId: '4', seatNumber: 'B1', type: 'executive', status: 'reserved', pricePerHour: 50, amenities: ['desk-lamp', 'power-outlet', 'drawer', 'monitor'] },
    { id: '5', roomId: '4', seatNumber: 'B2', type: 'standard', status: 'available', pricePerHour: 30, amenities: ['power-outlet'] },
  ])

  // New seat state
  const [newSeat, setNewSeat] = useState<Partial<Seat>>({
    roomId: '4',
    seatNumber: '',
    type: 'standard',
    status: 'available',
    pricePerHour: 30,
    amenities: [],
    currentUser: ''
  })

  const getRoomTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      'meeting-room': 'قاعة اجتماعات',
      'private-office': 'مكتب خاص',
      'shared-space': 'مساحة مشتركة',
      'training-room': 'قاعة تدريب',
      'conference-hall': 'قاعة مؤتمرات'
    }
    return typeMap[type] || type
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'occupied': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'reserved': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'available': 'متاح',
      'occupied': 'مشغول',
      'maintenance': 'صيانة',
      'reserved': 'محجوز'
    }
    return statusMap[status] || status
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-4 h-4" />
      case 'occupied': return <Lock className="w-4 h-4" />
      case 'maintenance': return <Settings className="w-4 h-4" />
      case 'reserved': return <Calendar className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const getAmenityIcon = (amenity: string) => {
    const iconMap: Record<string, any> = {
      'wifi': Wifi,
      'projector': Projector,
      'screen': Monitor,
      'sound': Volume2,
      'video': Video,
      'coffee': Coffee,
      'parking': Car,
      'tv': Tv,
      'whiteboard': Edit,
      'printer': FileText,
      'monitor': Monitor,
      'lounge': Users
    }
    const Icon = iconMap[amenity] || Settings
    return <Icon className="w-4 h-4" />
  }

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || room.type === filterType
    const matchesStatus = filterStatus === 'all' || room.status === filterStatus
    const matchesFloor = filterFloor === 'all' || room.floor === parseInt(filterFloor)
    
    return matchesSearch && matchesType && matchesStatus && matchesFloor
  })

  // Handler functions
  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault()
    const newId = (rooms.length + 1).toString()
    const roomToAdd: Room = {
      id: newId,
      name: newRoom.name || '',
      type: newRoom.type as Room['type'] || 'meeting-room',
      floor: newRoom.floor || 1,
      area: newRoom.area || 0,
      capacity: newRoom.capacity || 0,
      pricePerHour: newRoom.pricePerHour || 0,
      pricePerDay: newRoom.pricePerDay || 0,
      pricePerMonth: newRoom.pricePerMonth || 0,
      status: newRoom.status as Room['status'] || 'available',
      amenities: newRoom.amenities || [],
      images: newRoom.images || [],
      description: newRoom.description || '',
      occupancyRate: 0
    }
    setRooms([...rooms, roomToAdd])
    setShowNewRoomModal(false)
    setNewRoom({
      name: '',
      type: 'meeting-room',
      floor: 1,
      area: 0,
      capacity: 0,
      pricePerHour: 0,
      pricePerDay: 0,
      pricePerMonth: 0,
      status: 'available',
      amenities: [],
      images: [],
      description: '',
      occupancyRate: 0
    })
    alert('تم إضافة الغرفة بنجاح!')
  }

  const handleEditRoom = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingRoom) return
    
    setRooms(rooms.map(room => 
      room.id === editingRoom.id ? editingRoom : room
    ))
    setShowEditModal(false)
    setEditingRoom(null)
    alert('تم تحديث الغرفة بنجاح!')
  }

  const handleDeleteRoom = (roomId: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الغرفة؟')) {
      setRooms(rooms.filter(room => room.id !== roomId))
      alert('تم حذف الغرفة بنجاح!')
    }
  }

  const handleEditSeat = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSeat) return
    
    setSeats(seats.map(seat => 
      seat.id === editingSeat.id ? editingSeat : seat
    ))
    setShowEditSeatModal(false)
    setEditingSeat(null)
    alert('تم تحديث المقعد بنجاح!')
  }

  const handleAmenityToggle = (amenity: string, isNewRoom: boolean = true) => {
    if (isNewRoom) {
      const currentAmenities = newRoom.amenities || []
      if (currentAmenities.includes(amenity)) {
        setNewRoom({ ...newRoom, amenities: currentAmenities.filter(a => a !== amenity) })
      } else {
        setNewRoom({ ...newRoom, amenities: [...currentAmenities, amenity] })
      }
    } else if (editingRoom) {
      const currentAmenities = editingRoom.amenities || []
      if (currentAmenities.includes(amenity)) {
        setEditingRoom({ ...editingRoom, amenities: currentAmenities.filter(a => a !== amenity) })
      } else {
        setEditingRoom({ ...editingRoom, amenities: [...currentAmenities, amenity] })
      }
    }
  }

  const handleSeatAmenityToggle = (amenity: string) => {
    const currentAmenities = newSeat.amenities || []
    if (currentAmenities.includes(amenity)) {
      setNewSeat({ ...newSeat, amenities: currentAmenities.filter(a => a !== amenity) })
    } else {
      setNewSeat({ ...newSeat, amenities: [...currentAmenities, amenity] })
    }
  }

  const handleAddSeat = (e: React.FormEvent) => {
    e.preventDefault()
    const newId = (seats.length + 1).toString()
    const seatToAdd: Seat = {
      id: newId,
      roomId: newSeat.roomId || '4',
      seatNumber: newSeat.seatNumber || '',
      type: newSeat.type as Seat['type'] || 'standard',
      status: newSeat.status as Seat['status'] || 'available',
      pricePerHour: newSeat.pricePerHour || 30,
      amenities: newSeat.amenities || [],
      currentUser: newSeat.status === 'occupied' ? newSeat.currentUser : undefined
    }
    setSeats([...seats, seatToAdd])
    setShowNewSeatModal(false)
    setNewSeat({
      roomId: '4',
      seatNumber: '',
      type: 'standard',
      status: 'available',
      pricePerHour: 30,
      amenities: [],
      currentUser: ''
    })
    alert('تم إضافة المقعد بنجاح!')
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('rooms.title')}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{t('rooms.subtitle')}</p>
          </div>
          <button
            onClick={() => setShowNewRoomModal(true)}
            className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 flex items-center space-x-reverse space-x-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>{t('rooms.addRoom')}</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">إجمالي الغرف</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">45</p>
                <p className="text-xs text-gray-500 mt-1">5 طوابق</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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
                <p className="text-sm text-gray-600 dark:text-gray-400">غرف متاحة</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">28</p>
                <p className="text-xs text-gray-500 mt-1">62% من الإجمالي</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <Unlock className="w-6 h-6 text-green-600 dark:text-green-400" />
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
                <p className="text-sm text-gray-600 dark:text-gray-400">غرف مشغولة</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">15</p>
                <p className="text-xs text-gray-500 mt-1">33% من الإجمالي</p>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-red-600 dark:text-red-400" />
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
                <p className="text-sm text-gray-600 dark:text-gray-400">تحت الصيانة</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">2</p>
                <p className="text-xs text-gray-500 mt-1">5% من الإجمالي</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">نسبة الإشغال</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">78%</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">+5% من الشهر السابق</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-1 mb-6 inline-flex">
          <button
            onClick={() => setActiveTab('rooms')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'rooms' 
                ? 'bg-primary-600 text-white' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Building2 className="w-4 h-4 inline-block ml-2" />
            الغرف
          </button>
          <button
            onClick={() => setActiveTab('seats')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'seats' 
                ? 'bg-primary-600 text-white' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Users className="w-4 h-4 inline-block ml-2" />
            المقاعد
          </button>
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
                  placeholder="بحث بالاسم أو الوصف..."
                  className="w-full pr-10 pl-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {activeTab === 'rooms' && (
              <>
                {/* Type Filter */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">جميع الأنواع</option>
                  <option value="meeting-room">قاعة اجتماعات</option>
                  <option value="private-office">مكتب خاص</option>
                  <option value="shared-space">مساحة مشتركة</option>
                  <option value="training-room">قاعة تدريب</option>
                  <option value="conference-hall">قاعة مؤتمرات</option>
                </select>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="available">متاح</option>
                  <option value="occupied">مشغول</option>
                  <option value="maintenance">صيانة</option>
                  <option value="reserved">محجوز</option>
                </select>

                {/* Floor Filter */}
                <select
                  value={filterFloor}
                  onChange={(e) => setFilterFloor(e.target.value)}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">جميع الطوابق</option>
                  <option value="1">الطابق الأول</option>
                  <option value="2">الطابق الثاني</option>
                  <option value="3">الطابق الثالث</option>
                </select>
              </>
            )}

            {/* View Mode */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('floor')}
                className={`p-2 rounded ${viewMode === 'floor' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
              >
                <Layers className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'rooms' ? (
        /* Rooms Grid/List View */
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Room Image */}
                <div className="h-48 bg-gradient-to-br from-primary-500 to-primary-600 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Building2 className="w-16 h-16 text-white/30" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                      {getStatusIcon(room.status)}
                      <span className="mr-1">{getStatusText(room.status)}</span>
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 left-4">
                    <h3 className="text-xl font-bold text-white">{room.name}</h3>
                    <p className="text-white/80 text-sm">{getRoomTypeText(room.type)}</p>
                  </div>
                </div>

                {/* Room Details */}
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400">الطابق</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{room.floor}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400">السعة</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{room.capacity} شخص</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400">المساحة</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{room.area} م²</p>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">بالساعة</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{room.pricePerHour} ج.م</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">باليوم</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{room.pricePerDay} ج.م</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">بالشهر</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{room.pricePerMonth.toLocaleString()} ج.م</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {room.amenities.slice(0, 4).map((amenity, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                        {getAmenityIcon(amenity)}
                      </span>
                    ))}
                    {room.amenities.length > 4 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">+{room.amenities.length - 4}</span>
                    )}
                  </div>

                  {/* Occupancy Rate */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600 dark:text-gray-400">نسبة الإشغال</span>
                      <span className="text-xs font-medium text-gray-900 dark:text-white">{room.occupancyRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
                        style={{ width: `${room.occupancyRate}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedRoom(room)
                        setShowDetailsModal(true)
                      }}
                      className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium flex items-center justify-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>عرض</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditingRoom(room)
                        setShowEditModal(true)
                      }}
                      className="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteRoom(room.id)}
                      className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : viewMode === 'list' ? (
          /* List View */
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      الغرفة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      النوع
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      الطابق
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      السعة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      السعر/ساعة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      الإشغال
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
                  {filteredRooms.map((room) => (
                    <tr key={room.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center ml-3">
                            <Building2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{room.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{room.area} م²</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 dark:text-white">{getRoomTypeText(room.type)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 dark:text-white">الطابق {room.floor}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 dark:text-white">{room.capacity} شخص</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{room.pricePerHour} ج.م</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900 dark:text-white ml-2">{room.occupancyRate}%</span>
                          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full"
                              style={{ width: `${room.occupancyRate}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                          {getStatusIcon(room.status)}
                          <span className="mr-1">{getStatusText(room.status)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-reverse space-x-2">
                          <button
                            onClick={() => {
                              setSelectedRoom(room)
                              setShowDetailsModal(true)
                            }}
                            className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                            title="عرض التفاصيل"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingRoom(room)
                              setShowEditModal(true)
                            }}
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                            title="تعديل"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRoom(room.id)}
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
          </div>
        ) : (
          /* Floor View */
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">عرض الطوابق</h3>
            {[1, 2, 3].map((floor) => (
              <div key={floor} className="mb-6 last:mb-0">
                <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">الطابق {floor}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {filteredRooms.filter(room => room.floor === floor).map((room) => (
                    <div
                      key={room.id}
                      className={`p-3 rounded-lg border-2 ${
                        room.status === 'available' 
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                          : room.status === 'occupied'
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : room.status === 'maintenance'
                          ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                          : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      }`}
                    >
                      <p className="text-xs font-bold text-gray-900 dark:text-white">{room.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{room.capacity} شخص</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{getStatusText(room.status)}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Seats View */
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">المقاعد في المساحة المشتركة</h3>
              <button
                onClick={() => setShowNewSeatModal(true)}
                className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 flex items-center space-x-reverse space-x-2 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة مقعد</span>
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {seats.map((seat) => (
                <div
                  key={seat.id}
                  className={`p-4 rounded-lg border-2 relative ${
                    seat.status === 'available' 
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                      : seat.status === 'occupied'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : seat.status === 'reserved'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                  }`}
                >
                  {/* Edit & Delete Buttons */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    <button
                      onClick={() => {
                        setEditingSeat(seat)
                        setShowEditSeatModal(true)
                      }}
                      className="p-1 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/70"
                      title="تعديل"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`هل تريد حذف المقعد ${seat.seatNumber}؟`)) {
                          setSeats(seats.filter(s => s.id !== seat.id))
                        }
                      }}
                      className="p-1 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/70"
                      title="حذف"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-center mt-4">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{seat.seatNumber}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {seat.type === 'premium' ? 'متميز' : seat.type === 'executive' ? 'تنفيذي' : 'عادي'}
                    </p>
                    <p className="text-xs font-medium text-gray-900 dark:text-white mt-2">{seat.pricePerHour} ج.م/ساعة</p>
                    <p className={`text-xs mt-2 ${
                      seat.status === 'available' 
                        ? 'text-green-600 dark:text-green-400' 
                        : seat.status === 'occupied'
                        ? 'text-red-600 dark:text-red-400'
                        : seat.status === 'reserved'
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {getStatusText(seat.status)}
                    </p>
                    {seat.currentUser && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{seat.currentUser}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedRoom && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDetailsModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">تفاصيل الغرفة</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-6 rounded-xl text-white">
                  <h3 className="text-2xl font-bold mb-2">{selectedRoom.name}</h3>
                  <p className="text-primary-100">{getRoomTypeText(selectedRoom.type)}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">الطابق</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedRoom.floor}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">المساحة</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedRoom.area} م²</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">السعة</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedRoom.capacity} شخص</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">نسبة الإشغال</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedRoom.occupancyRate}%</p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">الأسعار</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">بالساعة</span>
                      <span className="font-bold text-gray-900 dark:text-white">{selectedRoom.pricePerHour} ج.م</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">باليوم</span>
                      <span className="font-bold text-gray-900 dark:text-white">{selectedRoom.pricePerDay} ج.م</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">بالشهر</span>
                      <span className="font-bold text-gray-900 dark:text-white">{selectedRoom.pricePerMonth.toLocaleString()} ج.م</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">المرافق المتاحة</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedRoom.amenities.map((amenity, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg gap-2">
                        {getAmenityIcon(amenity)}
                        <span className="text-sm">{amenity}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">الوصف</p>
                  <p className="text-gray-700 dark:text-gray-300">{selectedRoom.description}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">الحالة</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedRoom.status)}`}>
                    {getStatusIcon(selectedRoom.status)}
                    <span className="mr-2">{getStatusText(selectedRoom.status)}</span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingRoom && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowEditModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">تعديل الغرفة</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleEditRoom} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">اسم الغرفة</label>
                    <input
                      type="text"
                      required
                      value={editingRoom.name}
                      onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">نوع الغرفة</label>
                    <select
                      required
                      value={editingRoom.type}
                      onChange={(e) => setEditingRoom({ ...editingRoom, type: e.target.value as Room['type'] })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="meeting-room">قاعة اجتماعات</option>
                      <option value="private-office">مكتب خاص</option>
                      <option value="shared-space">مساحة مشتركة</option>
                      <option value="training-room">قاعة تدريب</option>
                      <option value="conference-hall">قاعة مؤتمرات</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الطابق</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={editingRoom.floor}
                      onChange={(e) => setEditingRoom({ ...editingRoom, floor: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">المساحة (م²)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={editingRoom.area}
                      onChange={(e) => setEditingRoom({ ...editingRoom, area: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">السعة (أشخاص)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={editingRoom.capacity}
                      onChange={(e) => setEditingRoom({ ...editingRoom, capacity: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الحالة</label>
                    <select
                      required
                      value={editingRoom.status}
                      onChange={(e) => setEditingRoom({ ...editingRoom, status: e.target.value as Room['status'] })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="available">متاح</option>
                      <option value="occupied">مشغول</option>
                      <option value="maintenance">صيانة</option>
                      <option value="reserved">محجوز</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">السعر/ساعة (ج.م)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={editingRoom.pricePerHour}
                      onChange={(e) => setEditingRoom({ ...editingRoom, pricePerHour: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">السعر/يوم (ج.م)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={editingRoom.pricePerDay}
                      onChange={(e) => setEditingRoom({ ...editingRoom, pricePerDay: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">السعر/شهر (ج.م)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={editingRoom.pricePerMonth}
                      onChange={(e) => setEditingRoom({ ...editingRoom, pricePerMonth: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الوصف</label>
                  <textarea
                    rows={3}
                    value={editingRoom.description}
                    onChange={(e) => setEditingRoom({ ...editingRoom, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">المرافق</label>
                  <div className="flex flex-wrap gap-2">
                    {['wifi', 'projector', 'screen', 'sound', 'video', 'coffee', 'parking', 'tv', 'whiteboard', 'printer', 'monitor'].map((amenity) => (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => handleAmenityToggle(amenity, false)}
                        className={`px-4 py-2 rounded-lg border-2 transition ${
                          editingRoom.amenities.includes(amenity)
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {amenity}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:from-primary-700 hover:to-primary-600 font-medium transition shadow-lg"
                  >
                    حفظ التعديلات
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* New Room Modal */}
      {showNewRoomModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowNewRoomModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">إضافة غرفة جديدة</h2>
                <button
                  onClick={() => setShowNewRoomModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddRoom} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">اسم الغرفة</label>
                    <input
                      type="text"
                      required
                      value={newRoom.name}
                      onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                      placeholder="مثال: قاعة الأعمال الكبرى"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">نوع الغرفة</label>
                    <select
                      required
                      value={newRoom.type}
                      onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value as Room['type'] })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="meeting-room">قاعة اجتماعات</option>
                      <option value="private-office">مكتب خاص</option>
                      <option value="shared-space">مساحة مشتركة</option>
                      <option value="training-room">قاعة تدريب</option>
                      <option value="conference-hall">قاعة مؤتمرات</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الطابق</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newRoom.floor}
                      onChange={(e) => setNewRoom({ ...newRoom, floor: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">المساحة (م²)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newRoom.area}
                      onChange={(e) => setNewRoom({ ...newRoom, area: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">السعة (أشخاص)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newRoom.capacity}
                      onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الحالة</label>
                    <select
                      required
                      value={newRoom.status}
                      onChange={(e) => setNewRoom({ ...newRoom, status: e.target.value as Room['status'] })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="available">متاح</option>
                      <option value="occupied">مشغول</option>
                      <option value="maintenance">صيانة</option>
                      <option value="reserved">محجوز</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">السعر/ساعة (ج.م)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newRoom.pricePerHour}
                      onChange={(e) => setNewRoom({ ...newRoom, pricePerHour: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">السعر/يوم (ج.م)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newRoom.pricePerDay}
                      onChange={(e) => setNewRoom({ ...newRoom, pricePerDay: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">السعر/شهر (ج.م)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newRoom.pricePerMonth}
                      onChange={(e) => setNewRoom({ ...newRoom, pricePerMonth: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الوصف</label>
                  <textarea
                    rows={3}
                    value={newRoom.description}
                    onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                    placeholder="وصف مختصر عن الغرفة ومميزاتها..."
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">المرافق</label>
                  <div className="flex flex-wrap gap-2">
                    {['wifi', 'projector', 'screen', 'sound', 'video', 'coffee', 'parking', 'tv', 'whiteboard', 'printer', 'monitor'].map((amenity) => (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => handleAmenityToggle(amenity, true)}
                        className={`px-4 py-2 rounded-lg border-2 transition ${
                          newRoom.amenities?.includes(amenity)
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {amenity}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewRoomModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:from-primary-700 hover:to-primary-600 font-medium transition shadow-lg"
                  >
                    إضافة الغرفة
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* New Seat Modal */}
      {showNewSeatModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowNewSeatModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">إضافة مقعد جديد</h2>
                <button
                  onClick={() => setShowNewSeatModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddSeat} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">رقم المقعد</label>
                    <input
                      type="text"
                      required
                      value={newSeat.seatNumber}
                      onChange={(e) => setNewSeat({ ...newSeat, seatNumber: e.target.value })}
                      placeholder="مثال: A1"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الغرفة</label>
                    <select
                      required
                      value={newSeat.roomId}
                      onChange={(e) => setNewSeat({ ...newSeat, roomId: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {rooms.map(room => (
                        <option key={room.id} value={room.id}>{room.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">نوع المقعد</label>
                    <select
                      required
                      value={newSeat.type}
                      onChange={(e) => setNewSeat({ ...newSeat, type: e.target.value as Seat['type'] })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="standard">عادي</option>
                      <option value="premium">متميز</option>
                      <option value="executive">تنفيذي</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الحالة</label>
                    <select
                      required
                      value={newSeat.status}
                      onChange={(e) => setNewSeat({ ...newSeat, status: e.target.value as Seat['status'] })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="available">متاح</option>
                      <option value="occupied">مشغول</option>
                      <option value="reserved">محجوز</option>
                      <option value="maintenance">صيانة</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">السعر/ساعة (ج.م)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newSeat.pricePerHour}
                      onChange={(e) => setNewSeat({ ...newSeat, pricePerHour: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  {newSeat.status === 'occupied' && (
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">اسم المستخدم الحالي</label>
                      <input
                        type="text"
                        value={newSeat.currentUser}
                        onChange={(e) => setNewSeat({ ...newSeat, currentUser: e.target.value })}
                        placeholder="اسم المستخدم"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">المرافق</label>
                  <div className="flex flex-wrap gap-2">
                    {['desk-lamp', 'power-outlet', 'drawer', 'monitor', 'ergonomic-chair', 'storage'].map((amenity) => (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => handleSeatAmenityToggle(amenity)}
                        className={`px-4 py-2 rounded-lg border-2 transition ${
                          newSeat.amenities?.includes(amenity)
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {amenity === 'desk-lamp' ? 'مصباح مكتب' : 
                         amenity === 'power-outlet' ? 'مأخذ كهرباء' :
                         amenity === 'drawer' ? 'درج' :
                         amenity === 'monitor' ? 'شاشة' :
                         amenity === 'ergonomic-chair' ? 'كرسي مريح' :
                         amenity === 'storage' ? 'تخزين' : amenity}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewSeatModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:from-primary-700 hover:to-primary-600 font-medium transition shadow-lg"
                  >
                    إضافة المقعد
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Seat Modal */}
      {showEditSeatModal && editingSeat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowEditSeatModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">تعديل المقعد</h2>
                <button
                  onClick={() => setShowEditSeatModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleEditSeat} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">رقم المقعد</label>
                    <input
                      type="text"
                      required
                      value={editingSeat.seatNumber}
                      onChange={(e) => setEditingSeat({ ...editingSeat, seatNumber: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">نوع المقعد</label>
                    <select
                      required
                      value={editingSeat.type}
                      onChange={(e) => setEditingSeat({ ...editingSeat, type: e.target.value as Seat['type'] })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="standard">عادي</option>
                      <option value="premium">متميز</option>
                      <option value="executive">تنفيذي</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">السعر بالساعة (ج.م)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={editingSeat.pricePerHour}
                      onChange={(e) => setEditingSeat({ ...editingSeat, pricePerHour: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الحالة</label>
                    <select
                      required
                      value={editingSeat.status}
                      onChange={(e) => setEditingSeat({ ...editingSeat, status: e.target.value as Seat['status'] })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="available">متاح</option>
                      <option value="occupied">مشغول</option>
                      <option value="reserved">محجوز</option>
                      <option value="maintenance">صيانة</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditSeatModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:from-primary-700 hover:to-primary-600 font-medium transition shadow-lg"
                  >
                    حفظ التعديلات
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
