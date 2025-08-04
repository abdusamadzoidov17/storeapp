import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Магазин - Интернет-магазин",
  description: "Лучшие товары по unbeatable ценам. Быстрая доставка по всей России.",
  keywords: ["интернет-магазин", "товары", "доставка", "покупки онлайн", "скидки"],
  authors: [{ name: "Магазин" }],
  openGraph: {
    title: "Магазин - Интернет-магазин",
    description: "Лучшие товары по unbeatable ценам. Быстрая доставка по всей России.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Магазин - Интернет-магазин",
    description: "Лучшие товары по unbeatable ценам. Быстрая доставка по всей России.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <div className="min-h-screen flex flex-col">
          <Providers>
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </Providers>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
