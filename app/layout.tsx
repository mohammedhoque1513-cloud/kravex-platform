import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "KRAVEX | We Fill Your Pipeline. Every Month.",
  description: "Premium UK lead generation platform for public enquiries, admin operations, client leads, invoices, payments and reporting.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://kravex.co.uk"),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}><body>{children}<Toaster richColors position="top-right" /></body></html>;
}
