'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { motion } from 'framer-motion'
import { 
  Shield,
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Loader2,
  AlertCircle,
  Info
} from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const { t, i18n } = useTranslation()
  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  
  const [errors, setErrors] = useState<any>({})

  const validateForm = () => {
    const newErrors: any = {}
    
    if (!formData.email) {
      newErrors.email = i18n.language === 'ar' ? 'البريد الإلكتروني مطلوب' : 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = i18n.language === 'ar' ? 'البريد الإلكتروني غير صالح' : 'Invalid email'
    }
    
    if (!formData.password) {
      newErrors.password = i18n.language === 'ar' ? 'كلمة المرور مطلوبة' : 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = i18n.language === 'ar' ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    // التحقق من بريد الأدمن
    const ADMIN_EMAIL = 'admin@cozyhive.eg'
    const ADMIN_PASSWORD = 'admin123'
    
    if (formData.email !== ADMIN_EMAIL) {
      setErrors({ email: i18n.language === 'ar' ? 'البريد الإلكتروني غير صحيح' : 'Invalid email address' })
      return
    }
    
    if (formData.password !== ADMIN_PASSWORD) {
      setErrors({ password: i18n.language === 'ar' ? 'كلمة المرور غير صحيحة' : 'Invalid password' })
      return
    }
    
    setIsLoading(true)
    
    // محاكاة تسجيل الدخول
    setTimeout(() => {
      // حفظ نوع المستخدم في localStorage
      localStorage.setItem('userType', 'admin')
      localStorage.setItem('adminEmail', formData.email)
      
      alert(i18n.language === 'ar' ? '✅ تم تسجيل الدخول بنجاح كمدير!' : '✅ Successfully logged in as Admin!')
      router.push('/admin/dashboard')
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950/20 flex items-center justify-center p-6" dir={dir}>
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200 dark:bg-primary-800/30 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 dark:bg-purple-800/30 rounded-full blur-3xl opacity-20 animate-pulse animation-delay-400"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:p-12 relative z-10"
      >
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link 
              href="/"
              className="inline-flex items-center space-x-reverse space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition"
            >
              <ArrowRight className="w-5 h-5" />
              <span>{t('common.backToHome')}</span>
            </Link>
            <LanguageSwitcher />
          </div>
          
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
            {i18n.language === 'ar' ? 'تسجيل دخول المدير' : 'Admin Login'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
            {i18n.language === 'ar' ? 'قم بتسجيل الدخول للوصول إلى لوحة التحكم' : 'Sign in to access the admin dashboard'}
          </p>
          
          {/* Admin Credentials Info */}
          <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-4 text-sm">
            <div className="flex items-start space-x-reverse space-x-2">
              <Info className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-primary-900 dark:text-primary-100 mb-2">
                  {i18n.language === 'ar' ? 'بيانات تسجيل الدخول:' : 'Admin Credentials:'}
                </p>
                <div className="space-y-1 text-primary-800 dark:text-primary-200">
                  <p className="font-mono">
                    <span className="font-semibold">{i18n.language === 'ar' ? 'البريد:' : 'Email:'}</span> admin@cozyhive.eg
                  </p>
                  <p className="font-mono">
                    <span className="font-semibold">{i18n.language === 'ar' ? 'كلمة المرور:' : 'Password:'}</span> admin123
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {i18n.language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
            </label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-12 py-3 bg-gray-50 dark:bg-gray-800 border ${
                  errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                } rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all`}
                placeholder={i18n.language === 'ar' ? 'admin@example.com' : 'admin@example.com'}
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-500 flex items-center">
                <AlertCircle className="w-4 h-4 ml-1" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {i18n.language === 'ar' ? 'كلمة المرور' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full px-12 py-3 bg-gray-50 dark:bg-gray-800 border ${
                  errors.password ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                } rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all`}
                placeholder={i18n.language === 'ar' ? '••••••••' : '••••••••'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-500 flex items-center">
                <AlertCircle className="w-4 h-4 ml-1" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:from-primary-700 hover:to-primary-600 transition-all shadow-lg hover:shadow-xl font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Shield className="w-5 h-5 ml-2" />
                {i18n.language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
              </>
            )}
          </motion.button>
        </form>

        {/* Back to User Login */}
        <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
          {i18n.language === 'ar' ? 'مستخدم عادي؟' : 'Regular user?'}{' '}
          <Link href="/login" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
            {i18n.language === 'ar' ? 'تسجيل دخول المستخدم' : 'User Login'}
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

