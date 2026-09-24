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

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} h-full antialiased dark`}
    >
      <body className="bg-brand-bg text-white min-h-screen font-body flex flex-col">
        {children}
        <FloatingNav />
      </body>
    </html>
  );
}
