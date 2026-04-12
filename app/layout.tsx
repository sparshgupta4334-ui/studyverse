import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Gupta Paper Stores - Free Digital Business Management',
  description: "India's most trusted digital ledger solution. Manage customers, transactions, payments, and reminders. 100% FREE forever. No login required to explore.",
  keywords: 'digital ledger, khata app, business management, customer management, payment tracking, SMS reminders',
  openGraph: {
    title: 'Gupta Paper Stores - Free Digital Business Management',
    description: 'Manage your business digitally - customers, ledger, payments, reminders. 100% FREE.',
    type: 'website',
    url: 'https://guptapaperstores.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-gray-950 min-h-screen font-sans">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
