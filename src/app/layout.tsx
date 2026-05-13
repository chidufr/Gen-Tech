import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import GlobalClientEffects from "@/components/GlobalClientEffects";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { getCategories, getSettings } from "@/lib/supabase";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Gen-Tech Kenya | Powering Kenya with Smart Electronics",
  description: "Your trusted electronics retailer in Kenya. Shop smartphones, laptops, home appliances, and more. Nationwide delivery available.",
  keywords: "electronics Kenya, smartphones Nairobi, laptops Kenya, electronics store, buy electronics online Kenya",
  openGraph: {
    title: "Gen-Tech Kenya | Smart Electronics",
    description: "Powering Kenya with Smart Electronics. Shop smartphones, laptops, appliances and more.",
    type: "website",
    locale: "en_KE",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gen-Tech Kenya",
    description: "Powering Kenya with Smart Electronics",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [categories, settings] = await Promise.all([
    getCategories(),
    getSettings(),
  ]);

  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <SettingsProvider initialSettings={settings} initialCategories={categories}>
          <Navbar />
          <main suppressHydrationWarning className="min-h-screen pt-[70px]">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
          <GlobalClientEffects />
        </SettingsProvider>
      </body>
    </html>
  );
}
