export interface User {
  user_id: string;
  phone: string;
  email?: string;
  name: string;
  role: 'user' | 'admin';
  is_active: boolean;
  created_at: string;
}

export interface Customer {
  customer_id: string;
  user_id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  balance: number; // in paise
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  transaction_id: string;
  customer_id: string;
  user_id: string;
  amount: number; // in paise
  type: 'credit' | 'debit';
  notes?: string;
  category?: string;
  balance_after: number;
  created_at: string;
  customer_name?: string;
}

export interface Payment {
  payment_id: string;
  transaction_id?: string;
  user_id: string;
  customer_id: string;
  amount: number; // in paise
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  status: 'pending' | 'success' | 'failed';
  created_at: string;
  customer_name?: string;
}

export interface Reminder {
  reminder_id: string;
  user_id: string;
  customer_id: string;
  message: string;
  sent_at?: string;
  status: 'pending' | 'sent' | 'failed';
  created_at: string;
  customer_name?: string;
  customer_phone?: string;
}

export interface DashboardStats {
  total_customers: number;
  total_receivable: number; // in paise
  total_payable: number; // in paise
  total_transactions: number;
  recent_transactions: Transaction[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
