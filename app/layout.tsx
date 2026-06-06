import type { Metadata } from "next";
import { Instrument_Serif, DM_Sans } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import ScrollRevealWrapper from "@/components/ScrollRevealWrapper";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Agriconnect — Farm to You, Directly",
  description: "Agriconnect links India's farmers directly to buyers with no middlemen, no markups. Real produce, real prices, real people behind every harvest.",
  keywords: ["agriculture", "direct farm to consumer", "fresh produce", "farmers market", "organic food", "india farmers"],
  authors: [{ name: "Agriconnect" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <CustomCursor />
        <ScrollRevealWrapper />
        {children}
      </body>
    </html>
  );
}
