export const APP_NAME = 'Gupta Paper Stores';
export const APP_TAGLINE = 'Smart Digital Ledger for Your Business';
export const APP_DESCRIPTION = 'Manage your customers, track transactions, send payment reminders, and grow your business with ease.';

export const COLORS = {
  primary: '#1E40AF',
  primaryLight: '#3B82F6',
  primaryDark: '#1E3A8A',
  accent: '#EA580C',
  accentLight: '#F97316',
  accentDark: '#C2410C',
};

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

export const DASHBOARD_NAV = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Customers', href: '/customers', icon: 'Users' },
  { label: 'Transactions', href: '/transactions', icon: 'ArrowLeftRight' },
  { label: 'Payments', href: '/payments', icon: 'CreditCard' },
  { label: 'Reminders', href: '/reminders', icon: 'Bell' },
  { label: 'Reports', href: '/reports', icon: 'BarChart2' },
  { label: 'Settings', href: '/settings', icon: 'Settings' },
];

export const ADMIN_NAV = [
  { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
  { label: 'Users', href: '/admin/users', icon: 'Users' },
  { label: 'Analytics', href: '/admin/analytics', icon: 'BarChart2' },
  { label: 'System', href: '/admin/system', icon: 'Server' },
  { label: 'Content', href: '/admin/content', icon: 'FileText' },
];

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'upi', label: 'UPI' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'cheque', label: 'Cheque' },
];

export const FEATURES = [
  {
    icon: 'Users',
    title: 'Unlimited Customers',
    description: 'Add and manage unlimited customers with detailed profiles and transaction history.',
  },
  {
    icon: 'ArrowLeftRight',
    title: 'Easy Transactions',
    description: 'Record credit and debit transactions instantly with notes and payment methods.',
  },
  {
    icon: 'Smartphone',
    title: 'UPI Payments',
    description: 'Accept and track UPI payments seamlessly integrated into your ledger.',
  },
  {
    icon: 'Bell',
    title: 'SMS Reminders',
    description: 'Send automated payment reminders via SMS to customers with outstanding balances.',
  },
  {
    icon: 'FileText',
    title: 'PDF Reports',
    description: 'Generate detailed PDF reports for any period to share with customers or accountants.',
  },
  {
    icon: 'WifiOff',
    title: 'Offline Support',
    description: 'Works without internet. All data syncs automatically when you reconnect.',
  },
];

export const FAQS = [
  {
    question: 'Is Gupta Paper Stores really free?',
    answer: 'Yes! Our app is completely free to use with all features included. No hidden charges, no credit card required.',
  },
  {
    question: 'How many customers can I add?',
    answer: 'You can add unlimited customers. There are no restrictions on the number of customers or transactions.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. All data is encrypted and stored securely. We use bank-level security to protect your business information.',
  },
  {
    question: 'Can I use it on my phone?',
    answer: 'Yes! The app is fully responsive and works on any device - mobile, tablet, or desktop.',
  },
  {
    question: 'How do SMS reminders work?',
    answer: 'You can send personalized payment reminders to customers via SMS directly from the app with just one click.',
  },
  {
    question: 'Can I export my data?',
    answer: 'Yes, you can export transaction reports as PDF files for any date range. This is useful for accounting and audits.',
  },
];
