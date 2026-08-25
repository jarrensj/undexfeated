import Link from "next/link";
import { connection } from "next/server";
import Game from "@/components/game";
import { randomDeal } from "@/lib/dex";

export default async function PracticePage() {
  await connection();
  const deal = randomDeal();
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-5 py-12">
      <div className="flex flex-col items-center gap-1.5">
        <h1 className="text-xl font-bold tracking-[0.06em]">undexfeated</h1>
        <p className="text-[13px] text-muted">practice</p>
      </div>
      <Game key={deal.join("-")} deal={deal} />
      <Link
        href="/"
        className="text-xs text-muted underline [text-underline-offset:3px] transition-colors duration-150 hover:text-accent"
      >
        play today&apos;s daily
      </Link>
    </main>
  );
}
