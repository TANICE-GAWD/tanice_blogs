import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tech Blog - System Design, DSA & Career Growth',
  description: 'Practical insights on system design, data structures, career growth, and startup hiring from my experience in tech.',
  keywords: ['system design', 'data structures', 'algorithms', 'career', 'interviews', 'startup hiring'],
  authors: [{ name: 'TANICE (Prince Sharma)' }],
  openGraph: {
    title: 'Tech Blog - System Design, DSA & Career Growth',
    description: 'Practical insights on system design, data structures, career growth, and startup hiring.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}