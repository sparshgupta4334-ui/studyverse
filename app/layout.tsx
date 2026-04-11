import type { Metadata } from "next";
import "./globals.css";
import { Toast } from "@/components/common/Toast";

export const metadata: Metadata = {
  title: "Gupta Paper Stores - Smart Digital Ledger",
  description: "Manage your customers, track transactions, send payment reminders, and grow your business with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <Toast />
      </body>
    </html>
  );
}
