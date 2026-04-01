import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import TopNav from "@/components/TopNav";
import Providers from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Peroxo — Real-time Messaging Infrastructure",
  description:
    "High-performance WebSocket messaging backend with actor-based routing, sub-millisecond delivery, and zero lock contention.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <Providers>
          <TopNav />
          <div className="flex-1 pt-16">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
