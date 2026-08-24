import Link from "next/link";
import { connection } from "next/server";
import Game from "@/components/game";
import { randomDeal } from "@/lib/dex";

export default async function PracticePage() {
  await connection();
  const deal = randomDeal();
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10">
      <div className="flex flex-col items-center gap-1">
        <h1>undexfeated</h1>
        <p className="text-sm text-zinc-500">practice</p>
      </div>
      <Game key={deal.join("-")} deal={deal} />
      <Link href="/" className="text-xs text-zinc-500 underline">
        play today&apos;s daily
      </Link>
    </main>
  );
}
