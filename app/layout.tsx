import type { Metadata } from "next";
import { Inter, Share_Tech_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./components/wrappers/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const shareTechMono = Share_Tech_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-share-tech-mono",
});

export const metadata: Metadata = {
  title: "CodeClash | Competitive Arena",
  description: "High-stakes real-time coding battles. Neobrutalist arcade style.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${shareTechMono.variable} antialiased`}>
            <AuthProvider>
            {children}
            </AuthProvider>
      </body>
    </html>
  );
}
