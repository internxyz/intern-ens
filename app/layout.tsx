import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "@/app/providers";
import { Toaster } from "@/components/ui/toaster";
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/header";

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
  title: "EthUI",
  description: "bootstrap your dapp with EthUI",
  metadataBase: new URL("https://ethui.buildstation.org"),
  openGraph: {
    title: "EthUI",
    description: "bootstrap your dapp with EthUI",
    url: "https://ethui.buildstation.org",
    siteName: "EthUI",
    images: [
      {
        url: "/buildui-tbn.png",
        width: 1200,
        height: 630,
        alt: "og-image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EthUI",
    description: "bootstrap your dapp with EthUI",
    creator: "@buildstationorg",
    images: ["/buildui-tbn.png"],
  },
};

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
          <main>
            <Header />
            {children}
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
