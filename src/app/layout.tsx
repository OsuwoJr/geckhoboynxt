import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./styles/wallet.css";
import { Providers } from './providers';
import { Suspense } from 'react';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GECKHONFT",
  description: "NFT Minting Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background antialiased`} suppressHydrationWarning>
        <Providers>
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#a0b921]"></div>
          </div>}>
            {children}
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
