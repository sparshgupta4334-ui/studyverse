import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gupta Paper Stores - Digital Khata App",
  description: "India ka #1 Free Digital Khata App. Manage customers, track transactions, send SMS reminders and get smart reports.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
