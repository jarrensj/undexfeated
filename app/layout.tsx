import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// SIL Open Font License 1.1 — free for commercial use, self-hosted at build.
const mono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "undexfeated",
  description: "undexfeated",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${mono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {children}
        <footer className="mx-auto max-w-[720px] px-6 pt-5 pb-7 text-center text-[11px] leading-[1.6] text-ghost">
          undexfeated is a free, unofficial, fan-made project. It is not
          affiliated with, endorsed, or sponsored by Nintendo, Creatures Inc.,
          GAME FREAK inc., or The Pokémon Company. All Pokémon-related content
          and materials that may appear on this site — including but not
          limited to names, Pokédex numbers, images, and any other related
          intellectual property — are trademarks and copyrights of their
          respective owners, © Nintendo, Creatures Inc., GAME FREAK inc.
          This project claims no ownership of any such material and intends no
          infringement. Team ratings are fan-made opinions for entertainment
          purposes only. Any material will be removed promptly at a rights
          holder&apos;s request.
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
