'use client'

import React, { useState } from 'react'
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
  Phone,
  MapPin,
  Briefcase,
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Globe,
  FileText
} from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const { t, i18n } = useTranslation()
  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  
  const [formData, setFormData] = useState({
    // Step 1
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Step 2
    password: '',
    confirmPassword: '',
    businessName: '',
    businessType: '',
    // Step 3
    country: 'SA',
    city: '',
    address: '',
    postalCode: ''
  })
  
  const [errors, setErrors] = useState<any>({})

  const businessTypes = [
    { key: 'startup', label: t('register.businessTypes.startup') },
    { key: 'small', label: t('register.businessTypes.small') },
    { key: 'medium', label: t('register.businessTypes.medium') },
    { key: 'large', label: t('register.businessTypes.large') },
    { key: 'freelance', label: t('register.businessTypes.freelance') },
    { key: 'nonprofit', label: t('register.businessTypes.nonprofit') },
    { key: 'other', label: t('register.businessTypes.other') }
  ]

  const cities = [
    { key: 'manial', label: t('register.cities.manial') },
    { key: 'zamalek', label: t('register.cities.zamalek') }
  ]

  const validateStep = (step: number) => {
    const newErrors: any = {}
    
    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = t('register.firstNameRequired')
      if (!formData.lastName) newErrors.lastName = t('register.lastNameRequired')
      if (!formData.email) {
        newErrors.email = t('register.emailRequired')
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = t('register.emailInvalid')
      }
      if (!formData.phone) {
        newErrors.phone = t('register.phoneRequired')
      } else if (!/^[0-9]{11}$/.test(formData.phone)) {
        newErrors.phone = i18n.language === 'ar' ? 'رقم الهاتف يجب أن يكون 11 رقم' : 'Phone number must be 11 digits'
      }
    } else if (step === 2) {
      if (!formData.password) {
        newErrors.password = t('register.passwordRequired')
      } else if (formData.password.length < 8) {
        newErrors.password = t('register.passwordMinLength')
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = t('register.confirmPasswordRequired')
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = t('register.passwordsMustMatch')
      }
    } else if (step === 3) {
      if (!formData.city) newErrors.city = t('register.cityRequired')
      if (!agreedToTerms) newErrors.terms = t('register.agreeToTermsRequired')
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1)
      } else {
        handleSubmit()
      }
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) return
    
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Navigate to dashboard on success
    router.push('/dashboard')
  }

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++
    if (password.match(/[0-9]/)) strength++
    if (password.match(/[^a-zA-Z0-9]/)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(formData.password)

  const handleGoogleSignup = async () => {
    setIsLoading(true)
    
    try {
      // Simulate Google OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In a real app, this would open Google OAuth popup/redirect
      console.log('Google Signup initiated')
      
      // Simulate successful signup
      alert('✅ تم التسجيل بنجاح باستخدام Google!')
      router.push('/dashboard')
    } catch (error) {
      console.error('Google signup error:', error)
      alert('❌ حدث خطأ أثناء التسجيل بـ Google')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFacebookSignup = async () => {
    setIsLoading(true)
    
    try {
      // Simulate Facebook OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In a real app, this would open Facebook OAuth popup/redirect
      console.log('Facebook Signup initiated')
      
      // Simulate successful signup
      alert('✅ تم التسجيل بنجاح باستخدام Facebook!')
      router.push('/dashboard')
    } catch (error) {
      console.error('Facebook signup error:', error)
      alert('❌ حدث خطأ أثناء التسجيل بـ Facebook')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950/20 flex items-center justify-center p-6" dir={dir}>
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-200 dark:bg-primary-800/30 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 dark:bg-purple-800/30 rounded-full blur-3xl opacity-20 animate-pulse animation-delay-400"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:p-12 relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
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
            {t('register.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('register.subtitle')}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-reverse space-x-4">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <motion.div 
                  animate={{
                    scale: currentStep >= step ? 1 : 0.9,
                    opacity: currentStep >= step ? 1 : 0.5
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    currentStep >= step
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {currentStep > step ? <Check className="w-5 h-5" /> : step}
                </motion.div>
                {step < 3 && (
                  <div 
                    className={`w-16 h-1 transition-all ${
                      currentStep > step 
                        ? 'bg-primary-600' 
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Title */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {currentStep === 1 && t('register.step1')}
            {currentStep === 2 && t('register.step2')}
            {currentStep === 3 && t('register.step3')}
          </h2>
        </div>

        {/* Form Steps */}
        <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('register.firstName')}
                  </label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className={`w-full px-12 py-3 bg-gray-50 dark:bg-gray-800 border ${
                        errors.firstName ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                      } rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all`}
                      placeholder={i18n.language === 'ar' ? 'محمد' : 'Ahmed'}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <AlertCircle className="w-4 h-4 ml-1" />
                      {errors.firstName}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('register.lastName')}
                  </label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className={`w-full px-12 py-3 bg-gray-50 dark:bg-gray-800 border ${
                        errors.lastName ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                      } rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all`}
                      placeholder={i18n.language === 'ar' ? 'السالم' : 'Mohamed'}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <AlertCircle className="w-4 h-4 ml-1" />
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('register.email')}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('register.phone')}
                </label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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
            </motion.div>
          )}

          {/* Step 2: Account Information */}
          {currentStep === 2 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('register.password')}
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
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">قوة كلمة المرور</span>
                      <span className="text-sm font-medium">
                        {passwordStrength === 0 && 'ضعيفة جداً'}
                        {passwordStrength === 1 && 'ضعيفة'}
                        {passwordStrength === 2 && 'متوسطة'}
                        {passwordStrength === 3 && 'قوية'}
                        {passwordStrength === 4 && 'قوية جداً'}
                      </span>
                    </div>
                    <div className="flex space-x-reverse space-x-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`flex-1 h-2 rounded-full transition-all ${
                            passwordStrength >= level
                              ? level <= 1 ? 'bg-red-500' 
                              : level <= 2 ? 'bg-yellow-500'
                              : level <= 3 ? 'bg-primary-500'
                              : 'bg-green-500'
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('register.confirmPassword')}
                  </label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`w-full px-12 py-3 bg-gray-50 dark:bg-gray-800 border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    } rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 ml-1" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('register.businessName')}
                  </label>
                <div className="relative">
                  <Briefcase className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full px-12 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="شركة التقنية المتقدمة"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('register.businessType')}
                </label>
                <div className="relative">
                  <FileText className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className={`w-full px-12 py-3 bg-gray-50 dark:bg-gray-800 border ${
                      errors.businessType ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    } rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none`}
                  >
                    <option value="">{i18n.language === 'ar' ? 'اختر نوع العمل' : 'Select Business Type'}</option>
                    {businessTypes.map((type) => (
                      <option key={type.key} value={type.key}>{type.label}</option>
                    ))}
                  </select>
                </div>
                {errors.businessType && (
                  <p className="mt-2 text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 ml-1" />
                    {errors.businessType}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: Address Information */}
          {currentStep === 3 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('register.country')}
                  </label>
                  <div className="relative">
                    <Globe className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-12 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none"
                    >
                      <option value="EG">{i18n.language === 'ar' ? 'مصر' : 'Egypt'}</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('register.city')}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className={`w-full px-12 py-3 bg-gray-50 dark:bg-gray-800 border ${
                        errors.city ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                      } rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none`}
                    >
                      <option value="">{i18n.language === 'ar' ? 'اختر المدينة' : 'Select City'}</option>
                      {cities.map((city) => (
                        <option key={city.key} value={city.key}>{city.label}</option>
                      ))}
                    </select>
                  </div>
                  {errors.city && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <AlertCircle className="w-4 h-4 ml-1" />
                      {errors.city}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('register.address')}
                </label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={`w-full px-12 py-3 bg-gray-50 dark:bg-gray-800 border ${
                      errors.address ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    } rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none`}
                    placeholder={i18n.language === 'ar' ? 'الشارع، الحي، رقم المبنى' : 'Street, district, building number'}
                    rows={3}
                  />
                </div>
                {errors.address && (
                  <p className="mt-2 text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 ml-1" />
                    {errors.address}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('register.postalCode')} {i18n.language === 'ar' ? '(اختياري)' : '(Optional)'}
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="12345"
                />
              </div>

              {/* Terms and Conditions */}
              <div>
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-5 h-5 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 ml-3 mt-0.5"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {i18n.language === 'ar' ? 'أوافق على' : 'I agree to the'}{' '}
                    <Link href="/terms" className="text-primary-600 dark:text-primary-400 hover:underline">
                      {i18n.language === 'ar' ? 'الشروط والأحكام' : 'Terms and Conditions'}
                    </Link>
                    {' '}{i18n.language === 'ar' ? 'و' : 'and'}{' '}
                    <Link href="/privacy" className="text-primary-600 dark:text-primary-400 hover:underline">
                      {i18n.language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
                    </Link>
                  </span>
                </label>
                {errors.terms && (
                  <p className="mt-2 text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 ml-1" />
                    {errors.terms}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={handlePrevStep}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center ${
                currentStep === 1 
                  ? 'invisible' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <ChevronRight className="w-5 h-5 ml-2" />
              {i18n.language === 'ar' ? 'السابق' : 'Previous'}
            </button>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:from-primary-700 hover:to-primary-600 transition-all shadow-lg hover:shadow-xl font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {currentStep === 3 
                    ? (i18n.language === 'ar' ? 'إنشاء الحساب' : 'Create Account')
                    : (i18n.language === 'ar' ? 'التالي' : 'Next')
                  }
                  <ChevronLeft className="w-5 h-5 mr-2" />
                </>
              )}
            </motion.button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-900/80 text-gray-500">
              {i18n.language === 'ar' ? 'أو سجل باستخدام' : 'Or sign up with'}
            </span>
          </div>
        </div>

        {/* Social Signup */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <motion.button
            type="button"
            onClick={handleGoogleSignup}
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
            onClick={handleFacebookSignup}
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

        {/* Sign In Link */}
        <p className="text-center text-gray-600 dark:text-gray-400">
          {i18n.language === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
          <Link href="/login" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
            {i18n.language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
          </Link>
        </p>
      </motion.div>
    </div>
  )
}