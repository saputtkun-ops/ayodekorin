import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Saputt Project - Sistem Monitoring Konstruksi Sipil",
  description: "Aplikasi manajemen dan tracking progres proyek konstruksi sipil real-time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#F4F6F9] text-[#0F172A]">{children}</body>
    </html>
  );
}
