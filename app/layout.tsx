import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gupta Paper Stores – Digital Ledger',
  description: 'Manage your business ledger digitally with Gupta Paper Stores',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>{children}</body>
    </html>
  );
}
