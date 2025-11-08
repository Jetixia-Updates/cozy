import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Redirect to login if refresh fails
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  verifyOTP: async (identifier: string, otp: string) => {
    const response = await api.post('/auth/otp/verify', { identifier, otp });
    return response.data;
  },

  requestOTP: async (identifier: string) => {
    const response = await api.post('/auth/otp/request', { identifier });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return response.data;
  },

  resetPassword: async (email: string) => {
    const response = await api.post('/auth/reset-password', { email });
    return response.data;
  },

  updatePassword: async (token: string, newPassword: string) => {
    const response = await api.post('/auth/update-password', { token, newPassword });
    return response.data;
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (userData: any) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },

  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getWallet: async () => {
    const response = await api.get('/users/wallet');
    return response.data;
  },

  addToWallet: async (amount: number, method: string) => {
    const response = await api.post('/users/wallet/add', { amount, method });
    return response.data;
  },
};

// Booking API
export const bookingAPI = {
  getBookings: async (filters?: any) => {
    const response = await api.get('/bookings', { params: filters });
    return response.data;
  },

  getBooking: async (id: string) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  createBooking: async (bookingData: any) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  updateBooking: async (id: string, bookingData: any) => {
    const response = await api.put(`/bookings/${id}`, bookingData);
    return response.data;
  },

  cancelBooking: async (id: string, reason: string) => {
    const response = await api.delete(`/bookings/${id}`, { data: { reason } });
    return response.data;
  },

  checkIn: async (id: string) => {
    const response = await api.post(`/bookings/${id}/check-in`);
    return response.data;
  },

  checkOut: async (id: string) => {
    const response = await api.post(`/bookings/${id}/check-out`);
    return response.data;
  },

  getAvailableSlots: async (roomId: string, date: string) => {
    const response = await api.get(`/bookings/available-slots`, {
      params: { roomId, date },
    });
    return response.data;
  },
};

// Room API
export const roomAPI = {
  getRooms: async (filters?: any) => {
    const response = await api.get('/rooms', { params: filters });
    return response.data;
  },

  getRoom: async (id: string) => {
    const response = await api.get(`/rooms/${id}`);
    return response.data;
  },

  getRoomSeats: async (id: string) => {
    const response = await api.get(`/rooms/${id}/seats`);
    return response.data;
  },

  getRoomAvailability: async (id: string, date: string) => {
    const response = await api.get(`/rooms/${id}/availability`, {
      params: { date },
    });
    return response.data;
  },

  createRoom: async (roomData: any) => {
    const response = await api.post('/rooms', roomData);
    return response.data;
  },

  updateRoom: async (id: string, roomData: any) => {
    const response = await api.put(`/rooms/${id}`, roomData);
    return response.data;
  },

  deleteRoom: async (id: string) => {
    const response = await api.delete(`/rooms/${id}`);
    return response.data;
  },
};

// Seat API
export const seatAPI = {
  getSeats: async (roomId?: string) => {
    const response = await api.get('/seats', { params: { roomId } });
    return response.data;
  },

  getSeat: async (id: string) => {
    const response = await api.get(`/seats/${id}`);
    return response.data;
  },

  updateSeatStatus: async (id: string, status: string) => {
    const response = await api.put(`/seats/${id}/status`, { status });
    return response.data;
  },

  createSeat: async (seatData: any) => {
    const response = await api.post('/seats', seatData);
    return response.data;
  },

  updateSeat: async (id: string, seatData: any) => {
    const response = await api.put(`/seats/${id}`, seatData);
    return response.data;
  },

  deleteSeat: async (id: string) => {
    const response = await api.delete(`/seats/${id}`);
    return response.data;
  },
};

// Payment API
export const paymentAPI = {
  getPayments: async (filters?: any) => {
    const response = await api.get('/payments', { params: filters });
    return response.data;
  },

  getPayment: async (id: string) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  processPayment: async (paymentData: any) => {
    const response = await api.post('/payments/process', paymentData);
    return response.data;
  },

  requestRefund: async (paymentId: string, amount: number, reason: string) => {
    const response = await api.post(`/payments/${paymentId}/refund`, { amount, reason });
    return response.data;
  },

  getPaymentMethods: async () => {
    const response = await api.get('/payments/methods');
    return response.data;
  },

  saveCard: async (cardDetails: any) => {
    const response = await api.post('/payments/cards', cardDetails);
    return response.data;
  },

  getSavedCards: async () => {
    const response = await api.get('/payments/cards');
    return response.data;
  },

  deleteCard: async (cardId: string) => {
    const response = await api.delete(`/payments/cards/${cardId}`);
    return response.data;
  },
};

// Report API
export const reportAPI = {
  getRevenue: async (startDate: string, endDate: string, format = 'json') => {
    const response = await api.get('/reports/revenue', {
      params: { startDate, endDate, format },
    });
    return response.data;
  },

  getOccupancy: async (startDate: string, endDate: string, roomId?: string) => {
    const response = await api.get('/reports/occupancy', {
      params: { startDate, endDate, roomId },
    });
    return response.data;
  },

  getCustomers: async (startDate: string, endDate: string) => {
    const response = await api.get('/reports/customers', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  getFinancialSummary: async (year: number, month?: number) => {
    const response = await api.get('/reports/financial-summary', {
      params: { year, month },
    });
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/reports/dashboard-stats');
    return response.data;
  },

  downloadReport: async (type: string, params: any) => {
    const response = await api.get(`/reports/download/${type}`, {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  getUsers: async (filters?: any) => {
    const response = await api.get('/admin/users', { params: filters });
    return response.data;
  },

  getUser: async (id: string) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, userData: any) => {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  getSystemSettings: async () => {
    const response = await api.get('/admin/settings');
    return response.data;
  },

  updateSystemSettings: async (settings: any) => {
    const response = await api.put('/admin/settings', settings);
    return response.data;
  },

  getAuditLogs: async (filters?: any) => {
    const response = await api.get('/admin/audit-logs', { params: filters });
    return response.data;
  },

  broadcast: async (message: string, type: string) => {
    const response = await api.post('/admin/broadcast', { message, type });
    return response.data;
  },
};

export default api;
