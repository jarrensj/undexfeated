import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "undexfeated",
  description: "undexfeated",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <footer className="p-4 text-center text-xs text-zinc-500">
          undexfeated is a free, unofficial, fan-made project. It is not
          affiliated with, endorsed, sponsored, or approved by Nintendo,
          Creatures Inc., GAME FREAK inc., or The Pokémon Company. All
          Pokémon-related content and materials that may appear on this site —
          including but not limited to names, Pokédex numbers, images, and any
          other related intellectual property — are trademarks and copyrights
          of their respective owners, © Nintendo, Creatures Inc., GAME FREAK
          inc. Names and numbers are used solely to identify the characters
          referred to. This project claims no ownership of any such material,
          is entirely non-commercial, and intends no infringement. Team
          ratings are fan-made opinions for entertainment purposes only. Any
          material will be removed promptly at a rights holder&apos;s request.
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
