import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import AdminSidebar from "@/components/admin/AdminSidebar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aura Admin",
  description: "Standalone admin frontend for the Aura store.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(178,124,78,0.16),_transparent_28%),linear-gradient(180deg,_#f8f1e7_0%,_#fcfaf7_34%,_#f3ece3_100%)] px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
          <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start">
            <AdminSidebar />
            <main className="min-w-0 flex-1">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
