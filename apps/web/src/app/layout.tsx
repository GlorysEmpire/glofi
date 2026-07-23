/**
 * Root layout — fonts, wallet provider, i18n, sitewide testnet banner (N5).
 */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WalletProvider } from '@/providers/WalletProvider';
import I18nProvider from '@/providers/I18nProvider';
import TestnetBanner from '@/components/TestnetBanner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Glofi — The Future of Prop Trading",
  description:
    "The first fully on-chain proprietary trading firm. Testnet MVP on Polygon Amoy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-black text-white">
        <I18nProvider>
          <WalletProvider>
            {/* Always-on testnet disclaimer above the app chrome */}
            <TestnetBanner />
            {children}
          </WalletProvider>
        </I18nProvider>
      </body>
    </html>
  );
}