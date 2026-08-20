import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
  display: 'swap',
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "My Goal - Premium Wallet",
  description: "Personal goal tracking wallet with a premium glassmorphism design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-[#030014] font-sans antialiased text-white relative",
          outfit.variable,
          inter.variable
        )}
      >
        {/* Background Ambient Blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="blob bg-purple-600/30 w-[500px] h-[500px] rounded-full top-[-10%] left-[-10%] mix-blend-screen"></div>
          <div className="blob bg-blue-600/30 w-[600px] h-[600px] rounded-full bottom-[-20%] right-[-10%] mix-blend-screen" style={{ animationDelay: '2s' }}></div>
          <div className="blob bg-pink-600/20 w-[400px] h-[400px] rounded-full top-[40%] left-[40%] mix-blend-screen" style={{ animationDelay: '4s' }}></div>
        </div>
        
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
