import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KingsPay — Smart Payments",
  description:
    "KingsPay is a next-generation payments platform for merchants and consumers. Accept payments online, in-person, and everywhere in between.",
  keywords: ["payments", "fintech", "merchant", "KingsPay", "online payments"],
  openGraph: {
    title: "KingsPay — Smart Payments",
    description:
      "Payments that move at the speed of trust. KingsPay powers merchants and payers worldwide.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#030712] text-[#000000]">
        {children}
      </body>
    </html>
  );
}
