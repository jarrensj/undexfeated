import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
          undexfeated is a fan-made project not affiliated with, endorsed,
          sponsored, or approved by Nintendo, Creatures Inc., GAME FREAK inc.,
          or The Pokémon Company. Pokémon names and Pokédex numbers are
          trademarks of their respective owners, used for identification
          purposes only. Team ratings are fan-made opinions for entertainment
          purposes.
        </footer>
      </body>
    </html>
  );
}
