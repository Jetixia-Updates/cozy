'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { motion } from 'framer-motion'
import { 
  Building2, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Loader2,
  User,
  Smartphone,
  Key,
  AlertCircle,
  Check
} from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { t, i18n } = useTranslation()
  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email')
  const [otpSent, setOtpSent] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    otp: ''
  })
  
  const [errors, setErrors] = useState<any>({})

  const validateForm = () => {
    const newErrors: any = {}
    
    if (loginMethod === 'email') {
      if (!formData.email) {
        newErrors.email = 'البريد الإلكتروني مطلوب'
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'البريد الإلكتروني غير صالح'
      }
      
      if (!formData.password) {
        newErrors.password = 'كلمة المرور مطلوبة'
      } else if (formData.password.length < 6) {
        newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
      }
    } else {
      if (!formData.phone) {
        newErrors.phone = i18n.language === 'ar' ? 'رقم الهاتف مطلوب' : 'Phone number is required'
      } else if (!/^[0-9]{11}$/.test(formData.phone)) {
        newErrors.phone = i18n.language === 'ar' ? 'رقم الهاتف يجب أن يكون 11 رقم' : 'Phone number must be 11 digits'
      }
      
      if (otpSent && !formData.otp) {
        newErrors.otp = 'رمز التحقق مطلوب'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSendOTP = async () => {
    if (!formData.phone) {
      setErrors({ phone: i18n.language === 'ar' ? 'رقم الهاتف مطلوب' : 'Phone number is required' })
      return
    }
    
    if (!/^[0-9]{11}$/.test(formData.phone)) {
      setErrors({ phone: i18n.language === 'ar' ? 'رقم الهاتف يجب أن يكون 11 رقم' : 'Phone number must be 11 digits' })
      return
    }
    
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setOtpSent(true)
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // حفظ نوع المستخدم
    localStorage.setItem('userType', 'user')
    localStorage.setItem('userEmail', formData.email || formData.phone)
    
    // Navigate to user profile on success
    router.push('/user/profile')
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    
    try {
      // Simulate Google OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In a real app, this would open Google OAuth popup/redirect
      console.log('Google Login initiated')
      
      // حفظ نوع المستخدم
      localStorage.setItem('userType', 'user')
      localStorage.setItem('userEmail', 'google-user@example.com')
      
      // Simulate successful login
      alert('✅ تم تسجيل الدخول بنجاح باستخدام Google!')
      router.push('/user/profile')
    } catch (error) {
      console.error('Google login error:', error)
      alert('❌ حدث خطأ أثناء تسجيل الدخول بـ Google')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFacebookLogin = async () => {
    setIsLoading(true)
    
    try {
      // Simulate Facebook OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In a real app, this would open Facebook OAuth popup/redirect
      console.log('Facebook Login initiated')
      
      // حفظ نوع المستخدم
      localStorage.setItem('userType', 'user')
      localStorage.setItem('userEmail', 'facebook-user@example.com')
      
      // Simulate successful login
      alert('✅ تم تسجيل الدخول بنجاح باستخدام Facebook!')
      router.push('/user/profile')
    } catch (error) {
      console.error('Facebook login error:', error)
      alert('❌ حدث خطأ أثناء تسجيل الدخول بـ Facebook')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950/20 flex items-center justify-center p-6" dir={dir}>
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200 dark:bg-primary-800/30 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 dark:bg-purple-800/30 rounded-full blur-3xl opacity-20 animate-pulse animation-delay-400"></div>
      </div>

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 relative z-10">
        {/* Right Side - Login Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:p-12"
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
              <img src="/hive.png" alt="Cozy Hive" className="h-20 w-auto" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {i18n.language === 'ar' ? 'مرحباً بعودتك! 👋' : 'Welcome Back! 👋'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {i18n.language === 'ar' ? 'قم بتسجيل الدخول للوصول إلى حسابك وإدارة حجوزاتك' : 'Sign in to access your account and manage your bookings'}
            </p>
          </div>

          {/* Login Method Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setLoginMethod('email')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                loginMethod === 'email'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <Mail className="w-4 h-4 inline-block ml-2" />
              {i18n.language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
            </button>
            <button
              onClick={() => setLoginMethod('phone')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                loginMethod === 'phone'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <Smartphone className="w-4 h-4 inline-block ml-2" />
              {i18n.language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {loginMethod === 'email' ? (
              <>
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {i18n.language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
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
                      placeholder="example@domain.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <AlertCircle className="w-4 h-4 ml-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
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
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
              </>
            ) : (
              <>
                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {i18n.language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-12 py-3 bg-gray-50 dark:bg-gray-800 border ${
                        errors.phone ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                      } rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-left`}
                      placeholder="01XXXXXXXXX"
                      maxLength={11}
                      dir="ltr"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <AlertCircle className="w-4 h-4 ml-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* OTP Field */}
                {otpSent && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {i18n.language === 'ar' ? 'رمز التحقق' : 'Verification Code'}
                    </label>
                    <div className="relative">
                      <Key className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.otp}
                        onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                        className={`w-full px-12 py-3 bg-gray-50 dark:bg-gray-800 border ${
                          errors.otp ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                        } rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-center tracking-widest`}
                        placeholder="• • • • • •"
                        maxLength={6}
                      />
                    </div>
                    {errors.otp && (
                      <p className="mt-2 text-sm text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 ml-1" />
                        {errors.otp}
                      </p>
                    )}
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {i18n.language === 'ar' ? 'لم يصلك الرمز؟' : 'Didn\'t receive code?'}{' '}
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
                      >
                        {i18n.language === 'ar' ? 'إعادة الإرسال' : 'Resend'}
                      </button>
                    </p>
                  </motion.div>
                )}

                {/* Send OTP Button */}
                {!otpSent && (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={isLoading}
                    className="w-full py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all font-medium flex items-center justify-center"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Key className="w-5 h-5 ml-2" />
                        {i18n.language === 'ar' ? 'إرسال رمز التحقق' : 'Send Verification Code'}
                      </>
                    )}
                  </button>
                )}
              </>
            )}

            {/* Remember Me & Forgot Password */}
            {loginMethod === 'email' && (
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="mr-2 text-sm text-gray-600 dark:text-gray-400">{i18n.language === 'ar' ? 'تذكرني' : 'Remember me'}</span>
                </label>
                <Link href="/forgot-password" className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline">
                  {i18n.language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                </Link>
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading || (loginMethod === 'phone' && !otpSent)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:from-primary-700 hover:to-primary-600 transition-all shadow-lg hover:shadow-xl font-medium text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {i18n.language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                  <ArrowRight className="w-5 h-5 mr-2" />
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">{i18n.language === 'ar' ? 'أو' : 'Or'}</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="py-3 px-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="mr-2 text-gray-700 dark:text-gray-300 font-medium">Google</span>
                  </>
                )}
              </motion.button>
              
              <motion.button
                type="button"
                onClick={handleFacebookLogin}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="py-3 px-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                    </svg>
                    <span className="mr-2 text-gray-700 dark:text-gray-300 font-medium">Facebook</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-gray-600 dark:text-gray-400">
              {i18n.language === 'ar' ? 'ليس لديك حساب؟' : 'Don\'t have an account?'}{' '}
              <Link href="/register" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
                {i18n.language === 'ar' ? 'سجل الآن' : 'Sign Up'}
              </Link>
            </p>

            {/* Admin Login Link */}
            <p className="text-center text-gray-500 dark:text-gray-500 text-sm mt-4">
              {i18n.language === 'ar' ? 'هل أنت مدير؟' : 'Are you an admin?'}{' '}
              <Link href="/admin/login" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
                {i18n.language === 'ar' ? 'تسجيل دخول الأدمن' : 'Admin Login'}
              </Link>
            </p>
          </form>
        </motion.div>

        {/* Left Side - Info Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-primary-600 to-primary-500 rounded-3xl text-white relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6">
              {i18n.language === 'ar' ? 'مساحة عملك المثالية في انتظارك' : 'Your Ideal Workspace Awaits'}
            </h2>
            <p className="text-xl mb-8 text-white/90 leading-relaxed">
              {i18n.language === 'ar' ? 'احجز مقعدك أو قاعة الاجتماعات بكل سهولة واستمتع بأفضل بيئة عمل احترافية' : 'Book your seat or meeting room easily and enjoy the best professional workspace'}
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center ml-4 flex-shrink-0">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{i18n.language === 'ar' ? 'حجز فوري' : 'Instant Booking'}</h3>
                  <p className="text-white/80">{i18n.language === 'ar' ? 'احجز مقعدك في ثوانٍ معدودة' : 'Book your seat in seconds'}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center ml-4 flex-shrink-0">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{i18n.language === 'ar' ? 'أسعار مرنة' : 'Flexible Pricing'}</h3>
                  <p className="text-white/80">{i18n.language === 'ar' ? 'ادفع بالساعة أو اليوم أو الشهر' : 'Pay by hour, day, or month'}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center ml-4 flex-shrink-0">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{i18n.language === 'ar' ? 'خدمات متكاملة' : 'Complete Services'}</h3>
                  <p className="text-white/80">{i18n.language === 'ar' ? 'كل ما تحتاجه لإنجاز عملك' : 'Everything you need to get work done'}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}