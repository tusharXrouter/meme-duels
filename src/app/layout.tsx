import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { PrivyProvider } from "@/components/providers/privy-provider";
import { Buffer } from 'buffer'
import process from 'process'
import { Header } from "@/components/Header";
import { AppToaster } from "@/components/ToasterClient";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meme Duels",
  description: "A fun meme dueling application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // Setup complete polyfills
  global.Buffer = Buffer
  global.process = process
  // window.Buffer = Buffer
  // window.process = process
  
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PrivyProvider>
          <QueryProvider>
            {/* Header Component */}
            <Header />
            {children}
            <AppToaster />
          </QueryProvider>
        </PrivyProvider>
      </body>
    </html>
  );
}
