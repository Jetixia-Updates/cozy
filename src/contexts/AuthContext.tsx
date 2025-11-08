'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, userAPI } from '@/lib/api';
import io, { Socket } from 'socket.io-client';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  firstNameEn?: string;
  lastNameEn?: string;
  phone?: string;
  role: 'admin' | 'staff' | 'customer';
  membershipType: 'basic' | 'silver' | 'gold' | 'platinum';
  walletBalance: number;
  loyaltyPoints: number;
  avatar?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  language: 'ar' | 'en';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  socket: Socket | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  verifyOTP: (identifier: string, otp: string) => Promise<void>;
  requestOTP: (identifier: string) => Promise<void>;
  updateProfile: (userData: any) => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const router = useRouter();

  // Initialize WebSocket connection
  const initializeSocket = useCallback((token: string) => {
    if (socket) {
      socket.disconnect();
    }

    const newSocket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connected');
    });

    newSocket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    // Handle real-time notifications
    newSocket.on('booking-reminder', (data) => {
      // Show notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('تذكير بالحجز', {
          body: `حجزك سيبدأ خلال ساعة واحدة`,
          icon: '/icon-192x192.png',
        });
      }
    });

    newSocket.on('payment-confirmed', (data) => {
      // Show payment confirmation
      console.log('Payment confirmed:', data);
    });

    newSocket.on('admin-announcement', (data) => {
      // Show admin announcement
      console.log('Admin announcement:', data);
    });

    setSocket(newSocket);

    return newSocket;
  }, [socket]);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          const response = await userAPI.getProfile();
          setUser(response.data);
          initializeSocket(token);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.login(email, password);
      const { accessToken, refreshToken, user } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      setUser(user);
      initializeSocket(accessToken);

      // Redirect based on role
      if (user.role === 'admin') {
        router.push('/dashboard/admin');
      } else if (user.role === 'staff') {
        router.push('/dashboard/staff');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.register(userData);
      const { user, otp } = response.data;

      // Store temporary user data
      sessionStorage.setItem('pendingUser', JSON.stringify(user));
      sessionStorage.setItem('pendingEmail', user.email);

      // Redirect to OTP verification
      router.push('/verify-otp');
    } catch (err: any) {
      setError(err.response?.data?.message || 'حدث خطأ أثناء التسجيل');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      
      router.push('/');
    }
  };

  const verifyOTP = async (identifier: string, otp: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.verifyOTP(identifier, otp);
      const { accessToken, refreshToken, user } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      setUser(user);
      initializeSocket(accessToken);

      sessionStorage.removeItem('pendingUser');
      sessionStorage.removeItem('pendingEmail');

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'رمز التحقق غير صحيح');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const requestOTP = async (identifier: string) => {
    try {
      setLoading(true);
      setError(null);

      await authAPI.requestOTP(identifier);
    } catch (err: any) {
      setError(err.response?.data?.message || 'حدث خطأ أثناء إرسال رمز التحقق');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData: any) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.updateProfile(userData);
      setUser(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'حدث خطأ أثناء تحديث الملف الشخصي');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    socket,
    login,
    register,
    logout,
    verifyOTP,
    requestOTP,
    updateProfile,
    refreshUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStaff: user?.role === 'staff' || user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
