import type { Customer, Transaction, Payment, Reminder, DashboardStats } from './types';

// Mock data
export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Ramesh Sharma', phone: '9876543210', email: 'ramesh@example.com', address: 'Sector 15, Noida', balance: 5200, totalCredit: 15000, totalDebit: 9800, lastTransactionDate: '2024-01-15', createdAt: '2023-06-01', userId: 'u1' },
  { id: 'c2', name: 'Sunita Verma', phone: '8765432109', email: 'sunita@example.com', address: 'Rajouri Garden, Delhi', balance: -2000, totalCredit: 8000, totalDebit: 10000, lastTransactionDate: '2024-01-12', createdAt: '2023-07-15', userId: 'u1' },
  { id: 'c3', name: 'Mohit Agarwal', phone: '7654321098', address: 'Lajpat Nagar, Delhi', balance: 12500, totalCredit: 25000, totalDebit: 12500, lastTransactionDate: '2024-01-10', createdAt: '2023-08-20', userId: 'u1' },
  { id: 'c4', name: 'Priya Kapoor', phone: '6543210987', email: 'priya@example.com', address: 'Dwarka, Delhi', balance: 0, totalCredit: 5000, totalDebit: 5000, lastTransactionDate: '2024-01-05', createdAt: '2023-09-10', userId: 'u1' },
  { id: 'c5', name: 'Vikram Singh', phone: '9432109876', address: 'Vasant Kunj, Delhi', balance: 8750, totalCredit: 18000, totalDebit: 9250, lastTransactionDate: '2024-01-08', createdAt: '2023-10-05', userId: 'u1' },
  { id: 'c6', name: 'Anita Gupta', phone: '8321098765', email: 'anita@example.com', address: 'Mayur Vihar, Delhi', balance: -3500, totalCredit: 6500, totalDebit: 10000, lastTransactionDate: '2024-01-03', createdAt: '2023-11-12', userId: 'u1' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', customerId: 'c1', customerName: 'Ramesh Sharma', type: 'credit', amount: 5000, description: 'Paper supply - Jan batch', paymentMethod: 'upi', date: '2024-01-15', createdAt: '2024-01-15T10:30:00Z', userId: 'u1' },
  { id: 't2', customerId: 'c2', customerName: 'Sunita Verma', type: 'debit', amount: 2000, description: 'Advance payment', paymentMethod: 'cash', date: '2024-01-12', createdAt: '2024-01-12T14:00:00Z', userId: 'u1' },
  { id: 't3', customerId: 'c3', customerName: 'Mohit Agarwal', type: 'credit', amount: 12500, description: 'Office stationery order', paymentMethod: 'bank_transfer', date: '2024-01-10', createdAt: '2024-01-10T09:15:00Z', userId: 'u1' },
  { id: 't4', customerId: 'c5', customerName: 'Vikram Singh', type: 'credit', amount: 8750, description: 'Monthly paper supply', paymentMethod: 'upi', date: '2024-01-08', createdAt: '2024-01-08T11:45:00Z', userId: 'u1' },
  { id: 't5', customerId: 'c4', customerName: 'Priya Kapoor', type: 'debit', amount: 5000, description: 'Full payment received', paymentMethod: 'cash', date: '2024-01-05', createdAt: '2024-01-05T16:30:00Z', userId: 'u1' },
  { id: 't6', customerId: 'c6', customerName: 'Anita Gupta', type: 'credit', amount: 3500, description: 'Bulk order - printing paper', paymentMethod: 'cheque', date: '2024-01-03', createdAt: '2024-01-03T13:00:00Z', userId: 'u1' },
  { id: 't7', customerId: 'c1', customerName: 'Ramesh Sharma', type: 'debit', amount: 3000, description: 'Partial payment', paymentMethod: 'upi', date: '2024-01-02', createdAt: '2024-01-02T10:00:00Z', userId: 'u1' },
  { id: 't8', customerId: 'c3', customerName: 'Mohit Agarwal', type: 'credit', amount: 7500, description: 'A4 paper reams - 500 units', paymentMethod: 'bank_transfer', date: '2023-12-28', createdAt: '2023-12-28T09:00:00Z', userId: 'u1' },
];

export const MOCK_PAYMENTS: Payment[] = [
  { id: 'p1', transactionId: 't2', customerId: 'c2', customerName: 'Sunita Verma', amount: 2000, method: 'cash', date: '2024-01-12', status: 'completed' },
  { id: 'p2', transactionId: 't5', customerId: 'c4', customerName: 'Priya Kapoor', amount: 5000, method: 'cash', date: '2024-01-05', status: 'completed' },
  { id: 'p3', transactionId: 't7', customerId: 'c1', customerName: 'Ramesh Sharma', amount: 3000, method: 'upi', upiId: 'ramesh@paytm', date: '2024-01-02', status: 'completed' },
  { id: 'p4', transactionId: 't8', customerId: 'c3', customerName: 'Mohit Agarwal', amount: 7500, method: 'bank_transfer', date: '2023-12-28', status: 'completed' },
];

export const MOCK_REMINDERS: Reminder[] = [
  { id: 'r1', customerId: 'c1', customerName: 'Ramesh Sharma', phone: '9876543210', amount: 5200, message: 'Dear Ramesh ji, your outstanding balance is ₹5,200. Please clear at your earliest convenience. - Gupta Paper Stores', status: 'sent', sentAt: '2024-01-14T10:00:00Z', createdAt: '2024-01-14T10:00:00Z' },
  { id: 'r2', customerId: 'c3', customerName: 'Mohit Agarwal', phone: '7654321098', amount: 12500, message: 'Dear Mohit ji, your outstanding balance is ₹12,500. Please clear at your earliest convenience. - Gupta Paper Stores', status: 'sent', sentAt: '2024-01-11T09:00:00Z', createdAt: '2024-01-11T09:00:00Z' },
  { id: 'r3', customerId: 'c6', customerName: 'Anita Gupta', phone: '8321098765', amount: 3500, message: 'Dear Anita ji, your outstanding balance is ₹3,500. Please clear at your earliest convenience. - Gupta Paper Stores', status: 'pending', createdAt: '2024-01-16T08:00:00Z' },
];

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalReceivable: 26450,
  totalPayable: 5500,
  totalCustomers: 6,
  totalTransactions: 8,
  recentTransactions: MOCK_TRANSACTIONS.slice(0, 5),
};

// API simulation functions
export async function getCustomers(): Promise<Customer[]> {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_CUSTOMERS), 300));
}

export async function getCustomer(id: string): Promise<Customer | undefined> {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_CUSTOMERS.find((c) => c.id === id)), 200));
}

export async function getTransactions(): Promise<Transaction[]> {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_TRANSACTIONS), 300));
}

export async function getTransaction(id: string): Promise<Transaction | undefined> {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_TRANSACTIONS.find((t) => t.id === id)), 200));
}

export async function getPayments(): Promise<Payment[]> {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_PAYMENTS), 300));
}

export async function getReminders(): Promise<Reminder[]> {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_REMINDERS), 300));
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_DASHBOARD_STATS), 400));
}
