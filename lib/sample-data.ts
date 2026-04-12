export const sampleCustomers = [
  { id: '1', name: 'Rajesh Kumar', phone: '9876543210', business: 'Sharma Kirana Store', city: 'Delhi', balance: 15200, type: 'receivable', lastTransaction: '2024-01-15', totalTransactions: 23 },
  { id: '2', name: 'Priya Sharma', phone: '9865432109', business: 'Priya Fashion House', city: 'Mumbai', balance: -8500, type: 'payable', lastTransaction: '2024-01-14', totalTransactions: 17 },
  { id: '3', name: 'Amit Singh', phone: '9854321098', business: 'Singh Electronics', city: 'Bangalore', balance: 32100, type: 'receivable', lastTransaction: '2024-01-13', totalTransactions: 45 },
  { id: '4', name: 'Sunita Devi', phone: '9843210987', business: 'Sunita Medical Store', city: 'Chennai', balance: -12400, type: 'payable', lastTransaction: '2024-01-12', totalTransactions: 31 },
  { id: '5', name: 'Vikram Patel', phone: '9832109876', business: 'Patel Wholesale', city: 'Ahmedabad', balance: 67800, type: 'receivable', lastTransaction: '2024-01-11', totalTransactions: 58 },
  { id: '6', name: 'Meera Joshi', phone: '9821098765', business: 'Meera Cafe', city: 'Pune', balance: 5600, type: 'receivable', lastTransaction: '2024-01-10', totalTransactions: 12 },
  { id: '7', name: 'Rahul Gupta', phone: '9810987654', business: 'Gupta Textiles', city: 'Surat', balance: -21000, type: 'payable', lastTransaction: '2024-01-09', totalTransactions: 39 },
  { id: '8', name: 'Kavita Reddy', phone: '9809876543', business: 'Reddy Restaurant', city: 'Hyderabad', balance: 9300, type: 'receivable', lastTransaction: '2024-01-08', totalTransactions: 27 },
  { id: '9', name: 'Deepak Verma', phone: '9798765432', business: 'Verma Construction', city: 'Jaipur', balance: 45600, type: 'receivable', lastTransaction: '2024-01-07', totalTransactions: 15 },
  { id: '10', name: 'Anita Mishra', phone: '9787654321', business: 'Mishra General Store', city: 'Lucknow', balance: -6700, type: 'payable', lastTransaction: '2024-01-06', totalTransactions: 20 },
  { id: '11', name: 'Suresh Yadav', phone: '9776543210', business: 'Yadav Hardware', city: 'Kanpur', balance: 18900, type: 'receivable', lastTransaction: '2024-01-05', totalTransactions: 34 },
  { id: '12', name: 'Rekha Nair', phone: '9765432109', business: 'Nair Supermarket', city: 'Kochi', balance: 28700, type: 'receivable', lastTransaction: '2024-01-04', totalTransactions: 41 },
  { id: '13', name: 'Mohan Das', phone: '9754321098', business: 'Das Pharmacy', city: 'Bhopal', balance: -3400, type: 'payable', lastTransaction: '2024-01-03', totalTransactions: 18 },
  { id: '14', name: 'Pooja Agarwal', phone: '9743210987', business: 'Agarwal Cloth Store', city: 'Indore', balance: 11200, type: 'receivable', lastTransaction: '2024-01-02', totalTransactions: 26 },
  { id: '15', name: 'Kiran Shah', phone: '9732109876', business: 'Shah Trading Co.', city: 'Vadodara', balance: 54300, type: 'receivable', lastTransaction: '2024-01-01', totalTransactions: 52 },
  { id: '16', name: 'Naresh Pandey', phone: '9721098765', business: 'Pandey Stationery', city: 'Varanasi', balance: -9800, type: 'payable', lastTransaction: '2023-12-31', totalTransactions: 22 },
  { id: '17', name: 'Sonia Kapoor', phone: '9710987654', business: 'Kapoor Beauty Salon', city: 'Chandigarh', balance: 7600, type: 'receivable', lastTransaction: '2023-12-30', totalTransactions: 14 },
  { id: '18', name: 'Arun Kumar', phone: '9709876543', business: 'Kumar Dairy Farm', city: 'Patna', balance: 23400, type: 'receivable', lastTransaction: '2023-12-29', totalTransactions: 47 },
  { id: '19', name: 'Geeta Singh', phone: '9698765432', business: 'Singh Furniture', city: 'Nagpur', balance: -15600, type: 'payable', lastTransaction: '2023-12-28', totalTransactions: 29 },
  { id: '20', name: 'Rohit Malhotra', phone: '9687654321', business: 'Malhotra Auto Parts', city: 'Faridabad', balance: 38200, type: 'receivable', lastTransaction: '2023-12-27', totalTransactions: 36 },
  { id: '21', name: 'Shanti Devi', phone: '9676543210', business: 'Devi Sarees', city: 'Agra', balance: 6100, type: 'receivable', lastTransaction: '2023-12-26', totalTransactions: 19 },
  { id: '22', name: 'Prakash Jain', phone: '9665432109', business: 'Jain Jewellers', city: 'Jodhpur', balance: -42000, type: 'payable', lastTransaction: '2023-12-25', totalTransactions: 8 },
];

export const sampleTransactions = [
  { id: 'T001', customerId: '1', customerName: 'Rajesh Kumar', type: 'credit', amount: 5000, balance: 15200, date: '2024-01-15', description: 'Paper supply payment', category: 'sales' },
  { id: 'T002', customerId: '3', customerName: 'Amit Singh', type: 'credit', amount: 12000, balance: 32100, date: '2024-01-14', description: 'Electronics bulk order', category: 'sales' },
  { id: 'T003', customerId: '2', customerName: 'Priya Sharma', type: 'debit', amount: 3500, balance: -8500, date: '2024-01-14', description: 'Fashion items purchase', category: 'purchase' },
  { id: 'T004', customerId: '5', customerName: 'Vikram Patel', type: 'credit', amount: 25000, balance: 67800, date: '2024-01-13', description: 'Wholesale goods payment', category: 'sales' },
  { id: 'T005', customerId: '4', customerName: 'Sunita Devi', type: 'debit', amount: 8000, balance: -12400, date: '2024-01-12', description: 'Medical supplies', category: 'purchase' },
  { id: 'T006', customerId: '9', customerName: 'Deepak Verma', type: 'credit', amount: 15000, balance: 45600, date: '2024-01-11', description: 'Construction materials', category: 'sales' },
  { id: 'T007', customerId: '6', customerName: 'Meera Joshi', type: 'credit', amount: 2200, balance: 5600, date: '2024-01-10', description: 'Cafe supplies', category: 'sales' },
  { id: 'T008', customerId: '7', customerName: 'Rahul Gupta', type: 'debit', amount: 7000, balance: -21000, date: '2024-01-09', description: 'Textile purchase', category: 'purchase' },
  { id: 'T009', customerId: '12', customerName: 'Rekha Nair', type: 'credit', amount: 11000, balance: 28700, date: '2024-01-08', description: 'Supermarket supplies', category: 'sales' },
  { id: 'T010', customerId: '8', customerName: 'Kavita Reddy', type: 'credit', amount: 4500, balance: 9300, date: '2024-01-08', description: 'Restaurant items', category: 'sales' },
  { id: 'T011', customerId: '11', customerName: 'Suresh Yadav', type: 'credit', amount: 6800, balance: 18900, date: '2024-01-07', description: 'Hardware supplies', category: 'sales' },
  { id: 'T012', customerId: '15', customerName: 'Kiran Shah', type: 'credit', amount: 19000, balance: 54300, date: '2024-01-06', description: 'Trading goods', category: 'sales' },
  { id: 'T013', customerId: '10', customerName: 'Anita Mishra', type: 'debit', amount: 2100, balance: -6700, date: '2024-01-05', description: 'Store items purchase', category: 'purchase' },
  { id: 'T014', customerId: '14', customerName: 'Pooja Agarwal', type: 'credit', amount: 4300, balance: 11200, date: '2024-01-04', description: 'Cloth supply payment', category: 'sales' },
  { id: 'T015', customerId: '20', customerName: 'Rohit Malhotra', type: 'credit', amount: 14500, balance: 38200, date: '2024-01-03', description: 'Auto parts payment', category: 'sales' },
  { id: 'T016', customerId: '18', customerName: 'Arun Kumar', type: 'credit', amount: 9000, balance: 23400, date: '2024-01-02', description: 'Dairy products payment', category: 'sales' },
  { id: 'T017', customerId: '17', customerName: 'Sonia Kapoor', type: 'credit', amount: 3200, balance: 7600, date: '2024-01-01', description: 'Salon supplies', category: 'sales' },
  { id: 'T018', customerId: '16', customerName: 'Naresh Pandey', type: 'debit', amount: 5500, balance: -9800, date: '2023-12-31', description: 'Stationery purchase', category: 'purchase' },
  { id: 'T019', customerId: '13', customerName: 'Mohan Das', type: 'debit', amount: 1800, balance: -3400, date: '2023-12-30', description: 'Pharmacy items', category: 'purchase' },
  { id: 'T020', customerId: '21', customerName: 'Shanti Devi', type: 'credit', amount: 2500, balance: 6100, date: '2023-12-29', description: 'Sarees payment', category: 'sales' },
  { id: 'T021', customerId: '1', customerName: 'Rajesh Kumar', type: 'credit', amount: 3000, balance: 10200, date: '2023-12-28', description: 'Paper bulk supply', category: 'sales' },
  { id: 'T022', customerId: '3', customerName: 'Amit Singh', type: 'debit', amount: 5000, balance: 20100, date: '2023-12-27', description: 'Returned goods', category: 'return' },
  { id: 'T023', customerId: '5', customerName: 'Vikram Patel', type: 'credit', amount: 30000, balance: 42800, date: '2023-12-26', description: 'Year-end wholesale', category: 'sales' },
  { id: 'T024', customerId: '19', customerName: 'Geeta Singh', type: 'debit', amount: 8200, balance: -15600, date: '2023-12-25', description: 'Furniture purchase', category: 'purchase' },
  { id: 'T025', customerId: '22', customerName: 'Prakash Jain', type: 'debit', amount: 15000, balance: -42000, date: '2023-12-24', description: 'Jewellery items', category: 'purchase' },
];

export const samplePayments = [
  { id: 'P001', customerId: '1', customerName: 'Rajesh Kumar', amount: 5000, method: 'UPI', upiId: 'rajesh@paytm', status: 'success', date: '2024-01-15', transactionId: 'UPI202401150001' },
  { id: 'P002', customerId: '3', customerName: 'Amit Singh', amount: 12000, method: 'UPI', upiId: 'amit@googlepay', status: 'success', date: '2024-01-14', transactionId: 'UPI202401140002' },
  { id: 'P003', customerId: '5', customerName: 'Vikram Patel', amount: 25000, method: 'Bank Transfer', upiId: 'vikram@phonepe', status: 'success', date: '2024-01-13', transactionId: 'NEFT202401130003' },
  { id: 'P004', customerId: '9', customerName: 'Deepak Verma', amount: 15000, method: 'UPI', upiId: 'deepak@paytm', status: 'pending', date: '2024-01-12', transactionId: 'UPI202401120004' },
  { id: 'P005', customerId: '12', customerName: 'Rekha Nair', amount: 11000, method: 'Cash', upiId: '-', status: 'success', date: '2024-01-11', transactionId: 'CASH202401110005' },
  { id: 'P006', customerId: '15', customerName: 'Kiran Shah', amount: 19000, method: 'UPI', upiId: 'kiran@phonepe', status: 'failed', date: '2024-01-10', transactionId: 'UPI202401100006' },
  { id: 'P007', customerId: '20', customerName: 'Rohit Malhotra', amount: 14500, method: 'UPI', upiId: 'rohit@googlepay', status: 'success', date: '2024-01-09', transactionId: 'UPI202401090007' },
  { id: 'P008', customerId: '18', customerName: 'Arun Kumar', amount: 9000, method: 'Bank Transfer', upiId: 'arun@sbi', status: 'success', date: '2024-01-08', transactionId: 'NEFT202401080008' },
];

export const sampleReminders = [
  { id: 'R001', customerId: '2', customerName: 'Priya Sharma', phone: '9865432109', amount: 8500, message: 'Dear Priya ji, your payment of ₹8,500 is due. Please pay at earliest. - Gupta Paper Stores', status: 'sent', date: '2024-01-14', deliveryStatus: 'delivered' },
  { id: 'R002', customerId: '4', customerName: 'Sunita Devi', phone: '9843210987', amount: 12400, message: 'Dear Sunita ji, you have an outstanding balance of ₹12,400. Kindly settle soon. - Gupta Paper Stores', status: 'sent', date: '2024-01-13', deliveryStatus: 'delivered' },
  { id: 'R003', customerId: '7', customerName: 'Rahul Gupta', phone: '9810987654', amount: 21000, message: 'Dear Rahul ji, please clear your dues of ₹21,000 at your earliest convenience. - Gupta Paper Stores', status: 'sent', date: '2024-01-12', deliveryStatus: 'pending' },
  { id: 'R004', customerId: '10', customerName: 'Anita Mishra', phone: '9787654321', amount: 6700, message: 'Dear Anita ji, reminder for payment of ₹6,700. Thank you. - Gupta Paper Stores', status: 'sent', date: '2024-01-11', deliveryStatus: 'delivered' },
  { id: 'R005', customerId: '13', customerName: 'Mohan Das', phone: '9754321098', amount: 3400, message: 'Dear Mohan ji, small reminder for ₹3,400 payment pending. - Gupta Paper Stores', status: 'sent', date: '2024-01-10', deliveryStatus: 'failed' },
];

export const sampleTestimonials = [
  { id: 1, name: 'Ramesh Agarwal', business: 'Agarwal Kirana Store, Delhi', image: '/images/testimonial1.jpg', rating: 5, text: 'Gupta Paper Stores software has completely transformed how I manage my business. I can now track all my customers and payments from my phone. Highly recommended!' },
  { id: 2, name: 'Sunita Sharma', business: 'Sharma Fashion, Mumbai', image: '/images/testimonial2.jpg', rating: 5, text: 'Earlier I used to maintain paper registers. Now everything is digital and organized. The SMS reminder feature saves me so much time and money!' },
  { id: 3, name: 'Mahesh Patel', business: 'Patel Wholesale, Ahmedabad', image: '/images/testimonial3.jpg', rating: 5, text: 'Best business management app for small traders. The PDF report feature is excellent. My accountant loves the organized data. 100% free forever!' },
  { id: 4, name: 'Kavita Nair', business: 'Nair Supermarket, Kochi', image: '/images/testimonial4.jpg', rating: 4, text: 'Very easy to use even for someone who is not tech-savvy. Customer support is excellent. The app works perfectly even without internet!' },
  { id: 5, name: 'Deepak Verma', business: 'Verma Construction, Jaipur', image: '/images/testimonial5.jpg', rating: 5, text: 'Managing 200+ customer accounts was a nightmare before this app. Now it takes just minutes. The receivables tracking feature is a game-changer!' },
];

export const blogPosts = [
  { id: 1, slug: 'digital-khata-vs-paper-khata', title: 'Digital Khata vs Paper Khata: Which is Better for Your Business?', excerpt: 'Learn why thousands of small business owners are switching from paper ledgers to digital management systems.', date: '2024-01-15', author: 'Team Gupta', category: 'Business Tips', readTime: '5 min read', image: '/images/blog1.jpg' },
  { id: 2, slug: 'upi-payment-collection-guide', title: 'Complete Guide to UPI Payment Collection for Small Businesses', excerpt: 'Step-by-step guide to setting up and using UPI payments for your business with automatic tracking.', date: '2024-01-10', author: 'Rajesh Kumar', category: 'Payments', readTime: '7 min read', image: '/images/blog2.jpg' },
  { id: 3, slug: 'sms-reminders-reduce-bad-debt', title: 'How SMS Reminders Can Reduce Your Bad Debt by 60%', excerpt: 'Real data from 500+ businesses shows that regular payment reminders dramatically improve collection rates.', date: '2024-01-05', author: 'Team Gupta', category: 'Collections', readTime: '4 min read', image: '/images/blog3.jpg' },
  { id: 4, slug: 'gst-ready-business-management', title: 'Is Your Business GST Ready? A Complete Checklist', excerpt: 'Everything you need to know about maintaining GST-compliant records for your small business.', date: '2023-12-28', author: 'CA Amit Joshi', category: 'GST & Tax', readTime: '8 min read', image: '/images/blog4.jpg' },
  { id: 5, slug: 'top-10-features-small-business', title: 'Top 10 Features Every Small Business Owner Needs in 2024', excerpt: 'From payment tracking to automated reports - here are the must-have features for modern small businesses.', date: '2023-12-20', author: 'Team Gupta', category: 'Features', readTime: '6 min read', image: '/images/blog5.jpg' },
];

export const stats = {
  activeUsers: 12847,
  transactionsProcessed: 2456789,
  totalAmountManaged: 892345678,
  citiesServed: 450,
  customersManaged: 5234567,
  successRate: 99.9,
};
