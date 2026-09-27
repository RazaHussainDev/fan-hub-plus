import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: 'Fan Hub Plus | Your Ultimate Fandom Universe',
  description: 'Stream movies, anime, K-dramas, gaming content and more on Fan Hub Plus.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Fan Hub Plus',
    description: 'Explore premium streaming content.',
    url: 'https://fanhubplus.com',
    siteName: 'Fan Hub Plus',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0b0f0a',
};

import FloatingNav from '@/components/FloatingNav';
import MobileBottomNav from '@/components/MobileBottomNav';
import SplashIntro from '@/components/SplashIntro';
import NavigationProgress from '@/components/NavigationProgress';
import { SearchProvider } from '@/context/SearchContext';
import { AuthProvider } from '@/context/AuthContext';
import SearchModal from '@/components/SearchModal';
import { Toaster } from 'react-hot-toast';
import NetworkDetector from '@/components/NetworkDetector';
import MaintenanceGuard from '@/components/MaintenanceGuard';
import FanHubAI from '@/components/FanHubAI';
import GoogleAuthProvider from '@/components/GoogleAuthProvider';
import 'nprogress/nprogress.css';

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-[#FBFBFD] text-[#1d1d1f] dark:bg-brand-bg dark:text-brand-light transition-colors duration-500 min-h-screen font-body flex flex-col" suppressHydrationWarning>
        <NavigationProgress />
        <SplashIntro />
        <GoogleAuthProvider>
          <AuthProvider>
            <SearchProvider>
              <MaintenanceGuard>
                {children}
                <FloatingNav />
                <MobileBottomNav />
                <SearchModal />
                <FanHubAI />
              </MaintenanceGuard>
              <Toaster position="top-center" />
              <NetworkDetector />
            </SearchProvider>
          </AuthProvider>
        </GoogleAuthProvider>
      </body>
    </html>
  );
}
