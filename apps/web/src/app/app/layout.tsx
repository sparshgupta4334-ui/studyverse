import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "StudyVerse — Your 3D Study World",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen overflow-hidden bg-[#050508]">
      {children}
    </div>
  );
}
