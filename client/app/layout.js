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
  title: "Fan Hub Plus",
  description: "A dynamic fandom information hub.",
};

import FloatingNav from '@/components/FloatingNav';
import { SearchProvider } from '@/context/SearchContext';
import { AuthProvider } from '@/context/AuthContext';
import SearchModal from '@/components/SearchModal';
import { Toaster } from 'react-hot-toast';
import NetworkDetector from '@/components/NetworkDetector';

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-[#FBFBFD] text-[#1d1d1f] dark:bg-brand-bg dark:text-brand-light transition-colors duration-500 min-h-screen font-body flex flex-col" suppressHydrationWarning>
        <AuthProvider>
          <SearchProvider>
            {children}
            <FloatingNav />
            <SearchModal />
            <Toaster position="top-center" />
            <NetworkDetector />
          </SearchProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
