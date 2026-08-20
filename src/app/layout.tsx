import type { Metadata } from "next";
import { PT_Serif, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const ptSerif = PT_Serif({
  subsets: ["latin", "cyrillic"],
  weight: ["400"],
  variable: "--font-pt-serif",
  display: 'swap',
});

const interTight = Inter_Tight({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-inter-tight",
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains-mono",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Present for Ira - Wallet",
  description: "Personal goal tracking wallet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={cn(
          "min-h-screen bg-carbon font-sans antialiased selection:bg-signal-lime selection:text-void-black",
          ptSerif.variable,
          interTight.variable,
          jetBrainsMono.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
