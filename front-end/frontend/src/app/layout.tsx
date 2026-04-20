import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AppProvider } from "@/context/CartContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aura Coffee | Premium Roasters",
  description: "Experience the ultimate coffee journey. Premium beans, expert roasting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased bg-background text-foreground`}
      >
        <AppProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
