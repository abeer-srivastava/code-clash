import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Source_Code_Pro } from "next/font/google";
import { IBM_Plex_Mono } from "next/font/google";
import { Share_Tech_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./components/wrappers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sourceCode = Source_Code_Pro({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const ibmPlex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
});
const shareTechMono = Share_Tech_Mono({
  subsets: ["latin"],
  weight: "400",
  display: "swap", // optional but improves performance
});

export const metadata: Metadata = {
  title: "CodeClash",
  description: "A Real Time Coding Battle Platform with Next.js + Firebase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${sourceCode.className} ${ibmPlex.className} ${shareTechMono.className} antialiased` }>
            <AuthProvider>
            {children}
            </AuthProvider>
      </body>
    </html>
  );
}
