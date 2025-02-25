import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from '@/app/providers';
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: 'build UI',
  description: 'bootstrap your dapp with build UI',
  metadataBase: new URL('https://www.buildui.org'),
  openGraph: {
    title: 'build UI',
    description: 'bootstrap your dapp with build UI',
    url: 'https://www.buildui.org',
    siteName: 'build UI',
    images: [
      {
        url: '/buildui-tbn.png',
        width: 1200,
        height: 630,
        alt: 'og-image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'build UI',
    description: 'bootstrap your dapp with build UI',
    creator: '@builduiorg',
    images: ['/buildui-tbn.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <main className="p-4 md:p-12">
            {children}
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
