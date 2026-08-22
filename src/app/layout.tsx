import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const title = "Don Matthews | Journalist, Builder, Author & Artist";
const description =
  "Official site of Don Matthews — investigative journalist, AI builder, civil-rights advocate, songwriter, and author of American Injustice.";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL("https://donmatthews.live"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title,
    description,
    url: "https://donmatthews.live",
    siteName: "Don Matthews",
    images: [
      {
        url: "/images/portrait-bw.jpg",
        width: 960,
        height: 960,
        alt: "Don Matthews portrait",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/portrait-bw.jpg"],
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Don Matthews",
  url: "https://donmatthews.live",
  image: "https://donmatthews.live/images/portrait-bw.jpg",
  description,
  knowsAbout: [
    "Investigative journalism",
    "Artificial intelligence",
    "Software development",
    "Civil rights advocacy",
    "Music production",
    "American Injustice",
  ],
  sameAs: [
    "https://wtpnews.org",
    "https://badactors.online",
    "https://github.com/patriotnewsactivism",
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
