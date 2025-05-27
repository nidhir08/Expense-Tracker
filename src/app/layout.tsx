'use client'
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-white dark:bg-black">
      <body className="text-black transition-colors duration-300 bg-white dark:bg-black">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
