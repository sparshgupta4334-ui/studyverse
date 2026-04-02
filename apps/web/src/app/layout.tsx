import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "StudyVerse — The 3D Collaborative Learning Universe",
    template: "%s | StudyVerse",
  },
  description:
    "Study smarter in a shared 3D world. Collaborate, take notes, search your resources, and chat with AI — all in one immersive space.",
  keywords: ["study", "3D", "collaboration", "AI", "learning", "multiplayer"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://studyverse.app",
    title: "StudyVerse — The 3D Collaborative Learning Universe",
    description: "Study smarter in a shared 3D world.",
    siteName: "StudyVerse",
  },
  themeColor: "#0a0a0f",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#0a0a0f] text-gray-100 antialiased">{children}</body>
    </html>
  );
}
