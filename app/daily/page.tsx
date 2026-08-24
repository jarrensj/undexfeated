import Link from "next/link";
import { connection } from "next/server";
import Game from "@/components/game";
import { dailyDeal, todayUtc } from "@/lib/daily";

export default async function DailyPage() {
  await connection();
  const date = todayUtc();
  const deal = dailyDeal(date);
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10">
      <div className="flex flex-col items-center gap-1">
        <h1>undexfeated</h1>
        <p className="text-sm text-zinc-500 tabular-nums">daily · {date}</p>
      </div>
      <Game key={date} deal={deal} restartable={false} dailyDate={date} />
      <Link href="/" className="text-xs text-zinc-500 underline">
        practice mode
      </Link>
    </main>
  );
}
