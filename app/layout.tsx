import type { Metadata } from "next";
import { Playfair_Display, EB_Garamond } from "next/font/google";
import "./globals.css";
import PaperTexture from "@/components/PaperTexture";

const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rakta — Menstrual Health Companion",
  description:
    "Her strength. Her cycle. Her story. A menstrual health app built for Indian women.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${ebGaramond.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <PaperTexture />
        {children}
      </body>
    </html>
  );
}