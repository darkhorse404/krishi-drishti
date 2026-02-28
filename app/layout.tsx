import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Krishi Drishti - Smart Farm Machinery Tracking",
  description:
    "Empowering Indian farmers with real-time AI tracking of 3 Lakh+ CRM machines to ensure 100% utilization and Zero Stubble Burning",
  generator: "v0.app",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${geistSans.className} antialiased`}>{children}</body>
    </html>
  );
}
