import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Don Matthews | AI Builder, Journalist, Litigator, Artist, Author",
  description: "Official portfolio of Don Matthews — software developer, AI architect, investigative journalist, civil rights litigator, and songwriter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans bg-background text-foreground antialiased selection:bg-gold/30 selection:text-white`}>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1419193124255967"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
        {children}
      </body>
    </html>
  );
}
// deploy-sync 1785483318
