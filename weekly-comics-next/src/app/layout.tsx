import type { Metadata } from "next";
import { Grandstander} from "next/font/google";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./globals.css";

const grandstanderFont = Grandstander({
  variable: "--font-grandstander",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Weekly Comics | Discover New Comic Releases",
  description: "Explore the latest weekly comic book releases with detailed issue info, blur previews, and series insights.",
  themeColor: "#ffffff",
  openGraph: {
    title: "Weekly Comics",
    description: "Stay up to date with new comic releases every week.",
    url: "https://weekly-comic.vercel.app",
    siteName: "Weekly Comics",
    images: [
      {
        url: "https://weekly-comic.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Weekly Comics OpenGraph Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Weekly Comics",
    description: "Browse weekly comic book releases with previews and details.",
    images: ["https://weekly-comic.vercel.app/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${grandstanderFont.className} flex flex-col min-h-screen antialiased bg-gradient-to-t from-emerald-50 from-85% to-emerald-400`}
      >
        <Header />
          {children}
        <Footer />
      </body>
    </html>
  );
}
