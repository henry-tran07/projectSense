import type { Metadata } from "next";
import { DM_Sans, Space_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import GoogleAnalytics from "./components/GoogleAnalytics";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Project Sense",
    template: "%s | Project S.",
  },
  description:
    "Practice TMSCA/UIL Number Sense Questions using Project Sense and compete against others through a variety of different tricks (including tutorials)!",
  manifest: "/manifest.json",
  twitter: {
    card: "summary_large_image",
  },
  metadataBase: new URL("https://project-sense.vercel.app/"),
  keywords: ["TMSCA", "UIL", "Number Sense", "Project Sense", "Math", "Test", "Question", "Speed"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <GoogleAnalytics />
      <body className={`${dmSans.variable} ${spaceMono.variable} font-sans`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
