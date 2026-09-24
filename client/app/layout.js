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
import SearchModal from '@/components/SearchModal';

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="bg-gray-50 text-gray-900 dark:bg-brand-bg dark:text-gray-50 min-h-screen font-body flex flex-col transition-colors duration-300">
        <SearchProvider>
          {children}
          <FloatingNav />
          <SearchModal />
        </SearchProvider>
      </body>
    </html>
  );
}
