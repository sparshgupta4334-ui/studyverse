export type UserRole = 'user' | 'admin';
export type TransactionType = 'credit' | 'debit';
export type ReminderStatus = 'pending' | 'sent' | 'failed';
export type PaymentMethod = 'cash' | 'upi' | 'bank_transfer' | 'cheque';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  businessName: string;
  role: UserRole;
  createdAt: string;
  isActive: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  balance: number; // positive = they owe us, negative = we owe them
  totalCredit: number;
  totalDebit: number;
  lastTransactionDate?: string;
  createdAt: string;
  userId: string;
}

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  type: TransactionType;
  amount: number;
  description?: string;
  paymentMethod: PaymentMethod;
  date: string;
  createdAt: string;
  userId: string;
}

export interface Payment {
  id: string;
  transactionId: string;
  customerId: string;
  customerName: string;
  amount: number;
  method: PaymentMethod;
  upiId?: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface Reminder {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  amount: number;
  message: string;
  status: ReminderStatus;
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
}

export interface Report {
  period: string;
  totalCredit: number;
  totalDebit: number;
  netBalance: number;
  transactions: number;
}

export interface DashboardStats {
  totalReceivable: number;
  totalPayable: number;
  totalCustomers: number;
  totalTransactions: number;
  recentTransactions: Transaction[];
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalTransactions: number;
  totalAmount: number;
  newUsersToday: number;
  transactionsToday: number;
}
