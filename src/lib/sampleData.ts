export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  balance: number; // positive = receivable (they owe us), negative = payable (we owe them)
  lastTransaction: string;
  totalTransactions: number;
  joinDate: string;
  businessType?: string;
}

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  type: 'credit' | 'debit';
  date: string;
  notes: string;
  category?: string;
}

export interface Payment {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  method: 'UPI' | 'Cash' | 'Bank Transfer' | 'Cheque';
  status: 'completed' | 'pending' | 'failed';
  date: string;
  upiId?: string;
  reference?: string;
}

export interface Reminder {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  amount: number;
  message: string;
  status: 'sent' | 'pending' | 'failed';
  scheduledDate: string;
  sentDate?: string;
  type: 'payment_due' | 'overdue' | 'custom';
}

export const customers: Customer[] = [
  { id: 'c1', name: 'Ramesh Sharma', phone: '9876543210', email: 'ramesh@gmail.com', address: 'Lajpat Nagar, Delhi', balance: 12500, lastTransaction: '2024-01-15', totalTransactions: 24, joinDate: '2023-03-10', businessType: 'Retail Shop' },
  { id: 'c2', name: 'Sunil Verma', phone: '9765432109', email: 'sunil@gmail.com', address: 'Rohini, Delhi', balance: -3200, lastTransaction: '2024-01-14', totalTransactions: 18, joinDate: '2023-04-20', businessType: 'Wholesale' },
  { id: 'c3', name: 'Priya Gupta', phone: '9654321098', email: 'priya@gmail.com', address: 'Dwarka, Delhi', balance: 8700, lastTransaction: '2024-01-13', totalTransactions: 31, joinDate: '2023-02-15', businessType: 'School' },
  { id: 'c4', name: 'Arun Kumar', phone: '9543210987', address: 'Janakpuri, Delhi', balance: 15200, lastTransaction: '2024-01-12', totalTransactions: 42, joinDate: '2022-12-01', businessType: 'Office Supplies' },
  { id: 'c5', name: 'Meera Patel', phone: '9432109876', email: 'meera@gmail.com', address: 'Karol Bagh, Delhi', balance: -1800, lastTransaction: '2024-01-11', totalTransactions: 15, joinDate: '2023-05-05', businessType: 'Stationery' },
  { id: 'c6', name: 'Vijay Singh', phone: '9321098765', address: 'Nehru Place, Delhi', balance: 6300, lastTransaction: '2024-01-10', totalTransactions: 28, joinDate: '2023-01-20', businessType: 'IT Company' },
  { id: 'c7', name: 'Anita Joshi', phone: '9210987654', email: 'anita@gmail.com', address: 'Greater Kailash, Delhi', balance: 21500, lastTransaction: '2024-01-09', totalTransactions: 56, joinDate: '2022-10-15', businessType: 'Printing Press' },
  { id: 'c8', name: 'Deepak Malhotra', phone: '9109876543', address: 'Pitampura, Delhi', balance: -5600, lastTransaction: '2024-01-08', totalTransactions: 19, joinDate: '2023-06-10', businessType: 'Contractor' },
  { id: 'c9', name: 'Kavita Rao', phone: '9098765432', email: 'kavita@gmail.com', address: 'Mayur Vihar, Delhi', balance: 9800, lastTransaction: '2024-01-07', totalTransactions: 33, joinDate: '2023-03-25', businessType: 'School' },
  { id: 'c10', name: 'Mohan Lal', phone: '8987654321', address: 'Saket, Delhi', balance: 4200, lastTransaction: '2024-01-06', totalTransactions: 22, joinDate: '2023-07-01', businessType: 'Retail Shop' },
  { id: 'c11', name: 'Sunita Devi', phone: '8876543210', email: 'sunita@gmail.com', address: 'Uttam Nagar, Delhi', balance: 13600, lastTransaction: '2024-01-05', totalTransactions: 38, joinDate: '2022-11-20', businessType: 'Wholesale' },
  { id: 'c12', name: 'Rajesh Bansal', phone: '8765432109', address: 'Shahdara, Delhi', balance: -2400, lastTransaction: '2024-01-04', totalTransactions: 11, joinDate: '2023-08-15', businessType: 'Stationery' },
  { id: 'c13', name: 'Pooja Agarwal', phone: '8654321098', email: 'pooja@gmail.com', address: 'Vasant Kunj, Delhi', balance: 7400, lastTransaction: '2024-01-03', totalTransactions: 29, joinDate: '2023-02-28', businessType: 'Office Supplies' },
  { id: 'c14', name: 'Suresh Yadav', phone: '8543210987', address: 'Okhla, Delhi', balance: 18900, lastTransaction: '2024-01-02', totalTransactions: 47, joinDate: '2022-09-10', businessType: 'Printing Press' },
  { id: 'c15', name: 'Rekha Mishra', phone: '8432109876', email: 'rekha@gmail.com', address: 'Patel Nagar, Delhi', balance: -4100, lastTransaction: '2024-01-01', totalTransactions: 16, joinDate: '2023-09-05', businessType: 'IT Company' },
  { id: 'c16', name: 'Ashok Tiwari', phone: '8321098765', address: 'Pandav Nagar, Delhi', balance: 3800, lastTransaction: '2023-12-31', totalTransactions: 20, joinDate: '2023-04-10', businessType: 'Retail Shop' },
  { id: 'c17', name: 'Neha Kapoor', phone: '8210987654', email: 'neha@gmail.com', address: 'Vasant Vihar, Delhi', balance: 11200, lastTransaction: '2023-12-30', totalTransactions: 35, joinDate: '2023-01-15', businessType: 'School' },
  { id: 'c18', name: 'Pankaj Sharma', phone: '8109876543', address: 'Tilak Nagar, Delhi', balance: -6800, lastTransaction: '2023-12-29', totalTransactions: 14, joinDate: '2023-10-01', businessType: 'Contractor' },
];

export const transactions: Transaction[] = [
  { id: 't1', customerId: 'c1', customerName: 'Ramesh Sharma', amount: 5000, type: 'credit', date: '2024-01-15', notes: 'A4 Paper 500 reams', category: 'Paper' },
  { id: 't2', customerId: 'c2', customerName: 'Sunil Verma', amount: 2000, type: 'debit', date: '2024-01-15', notes: 'Payment received via UPI', category: 'Payment' },
  { id: 't3', customerId: 'c3', customerName: 'Priya Gupta', amount: 3500, type: 'credit', date: '2024-01-14', notes: 'Notebook 200 pcs', category: 'Stationery' },
  { id: 't4', customerId: 'c4', customerName: 'Arun Kumar', amount: 8000, type: 'credit', date: '2024-01-14', notes: 'Printing paper 1000 reams', category: 'Paper' },
  { id: 't5', customerId: 'c5', customerName: 'Meera Patel', amount: 1500, type: 'debit', date: '2024-01-13', notes: 'Cash payment', category: 'Payment' },
  { id: 't6', customerId: 'c6', customerName: 'Vijay Singh', amount: 4200, type: 'credit', date: '2024-01-13', notes: 'Office stationery bundle', category: 'Stationery' },
  { id: 't7', customerId: 'c7', customerName: 'Anita Joshi', amount: 12000, type: 'credit', date: '2024-01-12', notes: 'Bulk paper order', category: 'Paper' },
  { id: 't8', customerId: 'c8', customerName: 'Deepak Malhotra', amount: 3000, type: 'debit', date: '2024-01-12', notes: 'Bank transfer', category: 'Payment' },
  { id: 't9', customerId: 'c9', customerName: 'Kavita Rao', amount: 6500, type: 'credit', date: '2024-01-11', notes: 'School supplies Q1', category: 'Stationery' },
  { id: 't10', customerId: 'c10', customerName: 'Mohan Lal', amount: 2800, type: 'credit', date: '2024-01-11', notes: 'Pen sets 50 boxes', category: 'Stationery' },
  { id: 't11', customerId: 'c11', customerName: 'Sunita Devi', amount: 9500, type: 'credit', date: '2024-01-10', notes: 'Wholesale order', category: 'Paper' },
  { id: 't12', customerId: 'c12', customerName: 'Rajesh Bansal', amount: 1200, type: 'debit', date: '2024-01-10', notes: 'Partial payment', category: 'Payment' },
  { id: 't13', customerId: 'c1', customerName: 'Ramesh Sharma', amount: 3000, type: 'debit', date: '2024-01-09', notes: 'Payment received', category: 'Payment' },
  { id: 't14', customerId: 'c13', customerName: 'Pooja Agarwal', amount: 5500, type: 'credit', date: '2024-01-09', notes: 'Office supplies monthly', category: 'Stationery' },
  { id: 't15', customerId: 'c14', customerName: 'Suresh Yadav', amount: 11000, type: 'credit', date: '2024-01-08', notes: 'Printing paper bulk', category: 'Paper' },
  { id: 't16', customerId: 'c15', customerName: 'Rekha Mishra', amount: 2500, type: 'debit', date: '2024-01-08', notes: 'UPI payment', category: 'Payment' },
  { id: 't17', customerId: 'c16', customerName: 'Ashok Tiwari', amount: 4000, type: 'credit', date: '2024-01-07', notes: 'Retail order', category: 'Mixed' },
  { id: 't18', customerId: 'c17', customerName: 'Neha Kapoor', amount: 7200, type: 'credit', date: '2024-01-07', notes: 'School stationery annual', category: 'Stationery' },
  { id: 't19', customerId: 'c18', customerName: 'Pankaj Sharma', amount: 3500, type: 'debit', date: '2024-01-06', notes: 'Cash received', category: 'Payment' },
  { id: 't20', customerId: 'c2', customerName: 'Sunil Verma', amount: 6000, type: 'credit', date: '2024-01-06', notes: 'Wholesale paper supply', category: 'Paper' },
  { id: 't21', customerId: 'c3', customerName: 'Priya Gupta', amount: 2200, type: 'debit', date: '2024-01-05', notes: 'Payment via UPI', category: 'Payment' },
  { id: 't22', customerId: 'c4', customerName: 'Arun Kumar', amount: 9000, type: 'credit', date: '2024-01-05', notes: 'Large office order', category: 'Paper' },
  { id: 't23', customerId: 'c5', customerName: 'Meera Patel', amount: 1800, type: 'credit', date: '2024-01-04', notes: 'New stationery items', category: 'Stationery' },
  { id: 't24', customerId: 'c6', customerName: 'Vijay Singh', amount: 5000, type: 'debit', date: '2024-01-04', notes: 'Bank transfer received', category: 'Payment' },
  { id: 't25', customerId: 'c7', customerName: 'Anita Joshi', amount: 15000, type: 'credit', date: '2024-01-03', notes: 'Monthly press supply', category: 'Paper' },
  { id: 't26', customerId: 'c8', customerName: 'Deepak Malhotra', amount: 4000, type: 'credit', date: '2024-01-03', notes: 'Construction paper', category: 'Paper' },
  { id: 't27', customerId: 'c9', customerName: 'Kavita Rao', amount: 3800, type: 'credit', date: '2024-01-02', notes: 'Exam stationery Q1', category: 'Stationery' },
  { id: 't28', customerId: 'c10', customerName: 'Mohan Lal', amount: 1600, type: 'debit', date: '2024-01-02', notes: 'Partial cash payment', category: 'Payment' },
  { id: 't29', customerId: 'c11', customerName: 'Sunita Devi', amount: 7500, type: 'credit', date: '2024-01-01', notes: 'New year bulk order', category: 'Paper' },
  { id: 't30', customerId: 'c12', customerName: 'Rajesh Bansal', amount: 2800, type: 'credit', date: '2024-01-01', notes: 'Mixed stationery', category: 'Stationery' },
  { id: 't31', customerId: 'c13', customerName: 'Pooja Agarwal', amount: 4500, type: 'debit', date: '2023-12-31', notes: 'Year end payment', category: 'Payment' },
  { id: 't32', customerId: 'c14', customerName: 'Suresh Yadav', amount: 13000, type: 'credit', date: '2023-12-31', notes: 'December press order', category: 'Paper' },
  { id: 't33', customerId: 'c1', customerName: 'Ramesh Sharma', amount: 8000, type: 'credit', date: '2023-12-30', notes: 'Year end large order', category: 'Paper' },
  { id: 't34', customerId: 'c2', customerName: 'Sunil Verma', amount: 4000, type: 'debit', date: '2023-12-30', notes: 'Bank payment', category: 'Payment' },
  { id: 't35', customerId: 'c15', customerName: 'Rekha Mishra', amount: 3200, type: 'credit', date: '2023-12-29', notes: 'IT dept stationery', category: 'Stationery' },
  { id: 't36', customerId: 'c16', customerName: 'Ashok Tiwari', amount: 2400, type: 'debit', date: '2023-12-29', notes: 'Cash paid', category: 'Payment' },
  { id: 't37', customerId: 'c17', customerName: 'Neha Kapoor', amount: 5800, type: 'credit', date: '2023-12-28', notes: 'Annual school order', category: 'Stationery' },
  { id: 't38', customerId: 'c18', customerName: 'Pankaj Sharma', amount: 6000, type: 'credit', date: '2023-12-28', notes: 'Construction stationery', category: 'Paper' },
  { id: 't39', customerId: 'c3', customerName: 'Priya Gupta', amount: 4100, type: 'credit', date: '2023-12-27', notes: 'Mid year order', category: 'Stationery' },
  { id: 't40', customerId: 'c4', customerName: 'Arun Kumar', amount: 7000, type: 'debit', date: '2023-12-27', notes: 'Full payment received', category: 'Payment' },
  { id: 't41', customerId: 'c5', customerName: 'Meera Patel', amount: 2100, type: 'credit', date: '2023-12-26', notes: 'Stationery refill', category: 'Stationery' },
  { id: 't42', customerId: 'c6', customerName: 'Vijay Singh', amount: 9200, type: 'credit', date: '2023-12-26', notes: 'Office quarterly order', category: 'Mixed' },
  { id: 't43', customerId: 'c7', customerName: 'Anita Joshi', amount: 11000, type: 'debit', date: '2023-12-25', notes: 'Partial payment made', category: 'Payment' },
  { id: 't44', customerId: 'c8', customerName: 'Deepak Malhotra', amount: 5500, type: 'credit', date: '2023-12-25', notes: 'Construction paper pack', category: 'Paper' },
  { id: 't45', customerId: 'c9', customerName: 'Kavita Rao', amount: 3200, type: 'debit', date: '2023-12-24', notes: 'UPI payment', category: 'Payment' },
  { id: 't46', customerId: 'c10', customerName: 'Mohan Lal', amount: 4800, type: 'credit', date: '2023-12-24', notes: 'Year end stock', category: 'Mixed' },
  { id: 't47', customerId: 'c11', customerName: 'Sunita Devi', amount: 8200, type: 'credit', date: '2023-12-23', notes: 'Wholesale dec order', category: 'Paper' },
  { id: 't48', customerId: 'c12', customerName: 'Rajesh Bansal', amount: 1900, type: 'debit', date: '2023-12-23', notes: 'Cash payment', category: 'Payment' },
  { id: 't49', customerId: 'c13', customerName: 'Pooja Agarwal', amount: 6200, type: 'credit', date: '2023-12-22', notes: 'Office supplies dec', category: 'Stationery' },
  { id: 't50', customerId: 'c14', customerName: 'Suresh Yadav', amount: 9800, type: 'credit', date: '2023-12-22', notes: 'Press supplies dec', category: 'Paper' },
  { id: 't51', customerId: 'c15', customerName: 'Rekha Mishra', amount: 4700, type: 'credit', date: '2023-12-21', notes: 'IT stationery nov', category: 'Stationery' },
  { id: 't52', customerId: 'c16', customerName: 'Ashok Tiwari', amount: 3100, type: 'credit', date: '2023-12-21', notes: 'Retail stock', category: 'Mixed' },
  { id: 't53', customerId: 'c17', customerName: 'Neha Kapoor', amount: 2700, type: 'debit', date: '2023-12-20', notes: 'Partial payment', category: 'Payment' },
  { id: 't54', customerId: 'c18', customerName: 'Pankaj Sharma', amount: 7800, type: 'credit', date: '2023-12-20', notes: 'Dec construction order', category: 'Paper' },
  { id: 't55', customerId: 'c1', customerName: 'Ramesh Sharma', amount: 5500, type: 'credit', date: '2023-12-19', notes: 'A4 paper restock', category: 'Paper' },
];

export const payments: Payment[] = [
  { id: 'p1', customerId: 'c1', customerName: 'Ramesh Sharma', amount: 5000, method: 'UPI', status: 'completed', date: '2024-01-15', upiId: 'ramesh@paytm', reference: 'UPI123456' },
  { id: 'p2', customerId: 'c2', customerName: 'Sunil Verma', amount: 3200, method: 'Bank Transfer', status: 'completed', date: '2024-01-14', reference: 'NEFT789012' },
  { id: 'p3', customerId: 'c3', customerName: 'Priya Gupta', amount: 2500, method: 'UPI', status: 'pending', date: '2024-01-13', upiId: 'priya@gpay' },
  { id: 'p4', customerId: 'c4', customerName: 'Arun Kumar', amount: 8000, method: 'Cheque', status: 'completed', date: '2024-01-12', reference: 'CHQ445566' },
  { id: 'p5', customerId: 'c5', customerName: 'Meera Patel', amount: 1800, method: 'Cash', status: 'completed', date: '2024-01-11' },
  { id: 'p6', customerId: 'c6', customerName: 'Vijay Singh', amount: 6300, method: 'UPI', status: 'completed', date: '2024-01-10', upiId: 'vijay@phonepe', reference: 'UPI234567' },
  { id: 'p7', customerId: 'c7', customerName: 'Anita Joshi', amount: 12000, method: 'Bank Transfer', status: 'completed', date: '2024-01-09', reference: 'NEFT890123' },
  { id: 'p8', customerId: 'c8', customerName: 'Deepak Malhotra', amount: 4500, method: 'UPI', status: 'failed', date: '2024-01-08', upiId: 'deepak@paytm' },
  { id: 'p9', customerId: 'c9', customerName: 'Kavita Rao', amount: 3800, method: 'Cash', status: 'completed', date: '2024-01-07' },
  { id: 'p10', customerId: 'c10', customerName: 'Mohan Lal', amount: 2200, method: 'UPI', status: 'pending', date: '2024-01-06', upiId: 'mohan@gpay' },
  { id: 'p11', customerId: 'c11', customerName: 'Sunita Devi', amount: 9500, method: 'Bank Transfer', status: 'completed', date: '2024-01-05', reference: 'NEFT901234' },
  { id: 'p12', customerId: 'c12', customerName: 'Rajesh Bansal', amount: 1500, method: 'Cash', status: 'completed', date: '2024-01-04' },
  { id: 'p13', customerId: 'c13', customerName: 'Pooja Agarwal', amount: 5500, method: 'UPI', status: 'completed', date: '2024-01-03', upiId: 'pooja@paytm', reference: 'UPI345678' },
  { id: 'p14', customerId: 'c14', customerName: 'Suresh Yadav', amount: 11000, method: 'Cheque', status: 'pending', date: '2024-01-02', reference: 'CHQ556677' },
  { id: 'p15', customerId: 'c15', customerName: 'Rekha Mishra', amount: 3200, method: 'UPI', status: 'completed', date: '2024-01-01', upiId: 'rekha@gpay', reference: 'UPI456789' },
];

export const reminders: Reminder[] = [
  { id: 'r1', customerId: 'c1', customerName: 'Ramesh Sharma', phone: '9876543210', amount: 12500, message: 'Dear Ramesh ji, aapka ₹12,500 ka bhugtaan baki hai. Kripya jaldi bhugtan karein. - Gupta Paper Stores', status: 'sent', scheduledDate: '2024-01-15', sentDate: '2024-01-15', type: 'payment_due' },
  { id: 'r2', customerId: 'c3', customerName: 'Priya Gupta', phone: '9654321098', amount: 8700, message: 'Dear Priya ji, aapka ₹8,700 ka bhugtaan baki hai. - Gupta Paper Stores', status: 'sent', scheduledDate: '2024-01-14', sentDate: '2024-01-14', type: 'payment_due' },
  { id: 'r3', customerId: 'c4', customerName: 'Arun Kumar', phone: '9543210987', amount: 15200, message: 'Dear Arun ji, aapka ₹15,200 ka bhugtaan 7 din se baki hai. - Gupta Paper Stores', status: 'pending', scheduledDate: '2024-01-16', type: 'overdue' },
  { id: 'r4', customerId: 'c7', customerName: 'Anita Joshi', phone: '9210987654', amount: 21500, message: 'Dear Anita ji, aapka ₹21,500 ka bhugtaan overdue hai. - Gupta Paper Stores', status: 'sent', scheduledDate: '2024-01-13', sentDate: '2024-01-13', type: 'overdue' },
  { id: 'r5', customerId: 'c9', customerName: 'Kavita Rao', phone: '9098765432', amount: 9800, message: 'Dear Kavita ji, aapka ₹9,800 ka bhugtaan baki hai. - Gupta Paper Stores', status: 'failed', scheduledDate: '2024-01-12', type: 'payment_due' },
  { id: 'r6', customerId: 'c11', customerName: 'Sunita Devi', phone: '8876543210', amount: 13600, message: 'Dear Sunita ji, payment reminder for ₹13,600. - Gupta Paper Stores', status: 'sent', scheduledDate: '2024-01-11', sentDate: '2024-01-11', type: 'payment_due' },
  { id: 'r7', customerId: 'c14', customerName: 'Suresh Yadav', phone: '8543210987', amount: 18900, message: 'Dear Suresh ji, aapka ₹18,900 overdue hai. - Gupta Paper Stores', status: 'pending', scheduledDate: '2024-01-17', type: 'overdue' },
  { id: 'r8', customerId: 'c17', customerName: 'Neha Kapoor', phone: '8210987654', amount: 11200, message: 'Dear Neha ji, payment of ₹11,200 is due. - Gupta Paper Stores', status: 'sent', scheduledDate: '2024-01-10', sentDate: '2024-01-10', type: 'payment_due' },
];

export const monthlyData = [
  { month: 'Aug', credit: 85000, debit: 32000, net: 53000 },
  { month: 'Sep', credit: 92000, debit: 38000, net: 54000 },
  { month: 'Oct', credit: 78000, debit: 28000, net: 50000 },
  { month: 'Nov', credit: 110000, debit: 42000, net: 68000 },
  { month: 'Dec', credit: 125000, debit: 48000, net: 77000 },
  { month: 'Jan', credit: 98000, debit: 35000, net: 63000 },
];

export const dashboardStats = {
  totalReceivable: 245680,
  totalPayable: 38420,
  totalCustomers: 24,
  totalTransactions: 158,
  thisMonthCollection: 68500,
  pendingReminders: 12,
};

export const reminderTemplates = [
  { id: 'tmpl1', name: 'Payment Due', message: 'Dear {name} ji, aapka ₹{amount} ka bhugtaan baki hai. Kripya jald bhugtan karein. - Gupta Paper Stores' },
  { id: 'tmpl2', name: 'Overdue Payment', message: 'Dear {name} ji, aapka ₹{amount} ka bhugtaan overdue hai. Kripya turant sampark karein. - Gupta Paper Stores' },
  { id: 'tmpl3', name: 'Thank You', message: 'Dear {name} ji, aapka ₹{amount} ka bhugtaan prapt hua. Dhanyawad! - Gupta Paper Stores' },
  { id: 'tmpl4', name: 'New Invoice', message: 'Dear {name} ji, aapka naya invoice ₹{amount} generate hua hai. - Gupta Paper Stores' },
];
