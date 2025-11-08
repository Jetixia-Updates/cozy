'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Building2, 
  Clock, 
  Users, 
  Wifi, 
  Coffee, 
  Shield, 
  ChevronRight,
  Star,
  MapPin,
  Phone,
  Mail,
  Check,
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  Award,
  TrendingUp,
  HeartHandshake,
  User
} from 'lucide-react'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useTranslation } from 'react-i18next'

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { t, i18n } = useTranslation()
  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    { icon: <Clock className="w-6 h-6" />, titleKey: 'features.flexibleBooking', descKey: 'features.flexibleBookingDesc' },
    { icon: <Wifi className="w-6 h-6" />, titleKey: 'features.highSpeedInternet', descKey: 'features.highSpeedInternetDesc' },
    { icon: <Coffee className="w-6 h-6" />, titleKey: 'features.fullServices', descKey: 'features.fullServicesDesc' },
    { icon: <Shield className="w-6 h-6" />, titleKey: 'features.security247', descKey: 'features.security247Desc' },
    { icon: <Users className="w-6 h-6" />, titleKey: 'features.businessCommunity', descKey: 'features.businessCommunityDesc' },
    { icon: <Building2 className="w-6 h-6" />, titleKey: 'features.meetingRooms', descKey: 'features.meetingRoomsDesc' },
  ]

  const plans = [
    {
      nameKey: 'pricing.basic',
      priceKey: 'pricing.basicPrice',
      features: [
        'pricing.features.sharedSpace',
        'pricing.features.highSpeedInternet',
        'pricing.features.freeCoffee',
        'pricing.features.printerAccess'
      ],
      popular: false
    },
    {
      nameKey: 'pricing.professional',
      priceKey: 'pricing.professionalPrice',
      features: [
        'pricing.features.privateOffice',
        'pricing.features.receptionServices',
        'pricing.features.meetingRoom5h',
        'pricing.features.personalLocker',
        'pricing.features.dedicatedParking'
      ],
      popular: true
    },
    {
      nameKey: 'pricing.enterprise',
      priceKey: 'pricing.enterprisePrice',
      features: [
        'pricing.features.teamOffice',
        'pricing.features.privateMeetingRoom',
        'pricing.features.adminServices',
        'pricing.features.businessAddress',
        'pricing.features.clientReception'
      ],
      popular: false
    }
  ]

  const testimonials = [
    {
      name: 'أحمد السعيد',
      role: 'مؤسس شركة تقنية',
      content: 'مركز أعمال متميز بكل المقاييس. البيئة محفزة للإنتاجية والخدمات ممتازة.',
      rating: 5,
      image: '/avatar1.jpg'
    },
    {
      name: 'فاطمة الزهراء',
      role: 'مستشارة أعمال',
      content: 'المرونة في الحجز والموقع الاستراتيجي جعلا من هذا المركز الخيار الأمثل لعملي.',
      rating: 5,
      image: '/avatar2.jpg'
    },
    {
      name: 'محمد الخالدي',
      role: 'مطور برمجيات',
      content: 'بيئة عمل هادئة ومريحة، والانترنت سريع جداً. أنصح به بشدة لكل المستقلين.',
      rating: 5,
      image: '/avatar3.jpg'
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950" dir={dir}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 py-2">
          <div className="flex items-center justify-between">
            {/* Login & Register Buttons - Left Side */}
            <div className="flex items-center space-x-reverse space-x-2 sm:space-x-3">
              <LanguageSwitcher />
              <Link 
                href="/login" 
                className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition font-medium"
              >
                {t('nav.login')}
              </Link>
              <Link 
                href="/register" 
                className="px-2 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm bg-primary-600 text-white rounded-lg sm:rounded-xl hover:bg-primary-700 transition shadow-md hover:shadow-primary/50 font-medium"
              >
                {t('nav.register')}
              </Link>
            </div>
            
            {/* Navigation Links - Center (Hidden on mobile) */}
            <div className="hidden lg:flex items-center space-x-reverse space-x-4 xl:space-x-6">
              <Link href="#features" className="text-xs xl:text-sm text-gray-700 dark:text-gray-300 hover:text-primary transition">{t('nav.features')}</Link>
              <Link href="#pricing" className="text-xs xl:text-sm text-gray-700 dark:text-gray-300 hover:text-primary transition">{t('nav.pricing')}</Link>
              <Link href="#testimonials" className="text-xs xl:text-sm text-gray-700 dark:text-gray-300 hover:text-primary transition">{t('nav.testimonials')}</Link>
              <Link href="#contact" className="text-xs xl:text-sm text-gray-700 dark:text-gray-300 hover:text-primary transition">{t('nav.contact')}</Link>
            </div>

            {/* Logo - Right Side (Responsive) */}
            <div className="flex items-center">
              <img src="/hive.png" alt="Cozy Hive" className="h-12 sm:h-16 md:h-20 w-auto" />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2" 
            alt="Workspace Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            {/* Main Heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 sm:mb-8 leading-tight text-white px-4"
            >
              {t('hero.title')}
              <br />
              <span className="bg-gradient-to-r from-primary-400 via-cyan-400 to-primary-500 bg-clip-text text-transparent">
                {t('hero.titleHighlight')}
              </span>
            </motion.h1>
            
            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-8 sm:mb-12 leading-relaxed max-w-3xl mx-auto px-4"
            >
              {t('hero.description')}
              <br className="hidden sm:block" />
              <span className="block sm:inline"> {t('hero.descriptionSub')}</span>
            </motion.p>

            {/* Button */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex justify-center px-4"
            >
              <Link href="/booking">
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-5 bg-primary-600 text-white rounded-xl sm:rounded-2xl hover:bg-primary-700 transition shadow-2xl hover:shadow-primary/50 font-bold text-sm sm:text-base md:text-lg lg:text-xl flex items-center justify-center gap-2 sm:gap-3"
                >
                  {t('hero.bookNow')}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </motion.button>
              </Link>
            </motion.div>
            </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-white/60"
          >
            <ChevronRight className="w-8 h-8 rotate-90" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 dark:bg-primary-900/50 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400 ml-2" />
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">Why Choose Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {t('features.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('features.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/50 dark:to-primary-800/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <div className="text-primary-600 dark:text-primary-400">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">{t(feature.titleKey)}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{t(feature.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 dark:bg-primary-900/50 rounded-full mb-4">
              <TrendingUp className="w-4 h-4 text-primary-600 dark:text-primary-400 ml-2" />
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">Competitive Pricing</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {t('pricing.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('pricing.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className={`relative bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                  plan.popular ? 'border-2 border-primary-500 scale-105' : 'border border-gray-200 dark:border-gray-800'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 right-8 bg-gradient-to-r from-primary-600 to-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    {t('pricing.mostPopular')}
                  </div>
                )}
                
                <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">{t(plan.nameKey)}</h3>
                <div className="flex items-baseline mb-8">
                  <span className="text-5xl font-bold text-primary-600 dark:text-primary-400">{t(plan.priceKey).split(' ')[0]}</span>
                  <span className="text-gray-600 dark:text-gray-400 mr-2">{t(plan.priceKey).split(' ').slice(1).join(' ')}</span>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((featureKey, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="w-5 h-5 text-success-500 ml-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{t(featureKey)}</span>
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-3 rounded-xl font-medium transition ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-700 hover:to-primary-600' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}>
                  {t('pricing.selectPlan')}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 dark:bg-primary-900/50 rounded-full mb-4">
              <HeartHandshake className="w-4 h-4 text-primary-600 dark:text-primary-400 ml-2" />
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">Client Reviews</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {t('testimonials.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('testimonials.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-850 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold ml-3">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-500">
        <div className="container mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-primary-600 rounded-2xl hover:bg-gray-100 transition shadow-xl font-medium text-lg"
              >
                {t('cta.bookTour')}
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent text-white rounded-2xl border-2 border-white hover:bg-white hover:text-primary-600 transition font-medium text-lg"
              >
                {t('cta.contactUs')}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 dark:bg-gray-950 text-white py-12 pb-24 lg:pb-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img src="/hive.png" alt="Cozy Hive" className="h-16 w-auto" />
              </div>
              <p className="text-gray-400">
                {t('footer.description')}
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">{t('footer.quickLinks')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-primary-400 transition">{t('footer.aboutUs')}</Link></li>
                <li><Link href="#" className="hover:text-primary-400 transition">{t('footer.services')}</Link></li>
                <li><Link href="#" className="hover:text-primary-400 transition">{t('footer.packages')}</Link></li>
                <li><Link href="#" className="hover:text-primary-400 transition">{t('footer.blog')}</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">{t('footer.support')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-primary-400 transition">{t('footer.faq')}</Link></li>
                <li><Link href="#" className="hover:text-primary-400 transition">{t('footer.privacy')}</Link></li>
                <li><Link href="#" className="hover:text-primary-400 transition">{t('footer.terms')}</Link></li>
                <li><Link href="#" className="hover:text-primary-400 transition">{t('footer.contact')}</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">{t('footer.contact')}</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center">
                  <MapPin className="w-5 h-5 ml-2 text-primary-400" />
                  <span>{t('footer.location')}</span>
                </li>
                <li className="flex items-center">
                  <Phone className="w-5 h-5 ml-2 text-primary-400" />
                  <span dir="ltr">{t('footer.phone')}</span>
                </li>
                <li className="flex items-center">
                  <Mail className="w-5 h-5 ml-2 text-primary-400" />
                  <span>{t('footer.email')}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p className="flex items-center justify-center gap-2">© 2025 <img src="/hive.png" alt="Cozy Hive" className="h-8 w-auto inline-block" /> {t('footer.copyright')}</p>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation - Fixed */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg lg:hidden z-50">
        <div className="flex items-center justify-around py-3">
          {/* Home */}
          <Link 
            href="/"
            className="flex flex-col items-center space-y-1 text-primary-600 dark:text-primary-400"
          >
            <Building2 className="w-6 h-6" />
            <span className="text-xs font-medium">{i18n.language === 'ar' ? 'الرئيسية' : 'Home'}</span>
          </Link>

          {/* My Account */}
          <Link 
            href="/login"
            className="flex flex-col items-center space-y-1 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition"
          >
            <User className="w-6 h-6" />
            <span className="text-xs font-medium">{i18n.language === 'ar' ? 'حسابي' : 'My Account'}</span>
          </Link>

          {/* Contact Us */}
          <Link 
            href="#contact"
            className="flex flex-col items-center space-y-1 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition"
          >
            <Phone className="w-6 h-6" />
            <span className="text-xs font-medium">{i18n.language === 'ar' ? 'تواصل معنا' : 'Contact'}</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}