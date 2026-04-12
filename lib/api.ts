import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_URL } from './constants';
import type {
  ApiResponse,
  Customer,
  DashboardStats,
  Payment,
  Reminder,
  Transaction,
  User,
} from './types';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authApi = {
  login: (phone: string, password: string) =>
    api.post<ApiResponse<{ token: string; user: User }>>('/auth/login', { phone, password }),
  signup: (data: { name: string; phone: string; email?: string; password: string }) =>
    api.post<ApiResponse<{ user_id: string }>>('/auth/signup', data),
  sendOTP: (phone: string) =>
    api.post<ApiResponse<null>>('/auth/send-otp', { phone }),
  verifyOTP: (phone: string, otp: string) =>
    api.post<ApiResponse<{ token: string; user: User }>>('/auth/verify-otp', { phone, otp }),
  getMe: () =>
    api.get<ApiResponse<User>>('/auth/me'),
  adminLogin: (phone: string, password: string) =>
    api.post<ApiResponse<{ token: string; user: User }>>('/auth/admin-login', { phone, password }),
};

// Customers
export const customersApi = {
  list: (search?: string) =>
    api.get<ApiResponse<Customer[]>>('/customers', { params: { search } }),
  get: (id: string) =>
    api.get<ApiResponse<Customer>>(`/customers/${id}`),
  create: (data: Omit<Customer, 'customer_id' | 'user_id' | 'created_at' | 'updated_at'>) =>
    api.post<ApiResponse<Customer>>('/customers', data),
  update: (id: string, data: Partial<Customer>) =>
    api.put<ApiResponse<Customer>>(`/customers/${id}`, data),
  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/customers/${id}`),
};

// Transactions
export const transactionsApi = {
  list: (params?: { customer_id?: string; type?: string; from?: string; to?: string; page?: number; limit?: number }) =>
    api.get<ApiResponse<{ transactions: Transaction[]; total: number }>>('/transactions', { params }),
  get: (id: string) =>
    api.get<ApiResponse<Transaction>>(`/transactions/${id}`),
  create: (data: { customer_id: string; amount: number; type: 'credit' | 'debit'; notes?: string; category?: string }) =>
    api.post<ApiResponse<Transaction>>('/transactions', data),
  update: (id: string, data: Partial<Transaction>) =>
    api.put<ApiResponse<Transaction>>(`/transactions/${id}`, data),
  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/transactions/${id}`),
};

// Payments
export const paymentsApi = {
  list: (params?: { customer_id?: string; status?: string }) =>
    api.get<ApiResponse<Payment[]>>('/payments', { params }),
  createOrder: (customer_id: string, amount: number) =>
    api.post<ApiResponse<{ order_id: string; amount: number; currency: string }>>('/payments/create-order', { customer_id, amount }),
  verify: (data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; customer_id: string }) =>
    api.post<ApiResponse<Payment>>('/payments/verify', data),
};

// Reminders
export const remindersApi = {
  list: () =>
    api.get<ApiResponse<Reminder[]>>('/reminders'),
  send: (customer_id: string, message: string) =>
    api.post<ApiResponse<Reminder>>('/reminders/send', { customer_id, message }),
  sendBulk: (message: string) =>
    api.post<ApiResponse<{ sent: number; failed: number }>>('/reminders/send-bulk', { message }),
};

// Reports
export const reportsApi = {
  summary: (from?: string, to?: string) =>
    api.get<ApiResponse<DashboardStats>>('/reports/summary', { params: { from, to } }),
  monthly: (year?: number) =>
    api.get<ApiResponse<{ month: string; credit: number; debit: number }[]>>('/reports/monthly', { params: { year } }),
  exportCsv: (from?: string, to?: string) =>
    api.get('/reports/export/csv', { params: { from, to }, responseType: 'blob' }),
  exportPdf: (from?: string, to?: string) =>
    api.get('/reports/export/pdf', { params: { from, to }, responseType: 'blob' }),
};

// Dashboard
export const dashboardApi = {
  stats: () =>
    api.get<ApiResponse<DashboardStats>>('/dashboard/stats'),
};

// Admin
export const adminApi = {
  users: () =>
    api.get<ApiResponse<User[]>>('/admin/users'),
  stats: () =>
    api.get<ApiResponse<{ total_users: number; total_customers: number; total_transactions: number; total_amount: number }>>('/admin/stats'),
  toggleUser: (user_id: string, is_active: boolean) =>
    api.patch<ApiResponse<User>>(`/admin/users/${user_id}`, { is_active }),
};

export default api;
