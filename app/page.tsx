import Link from "next/link";
import { connection } from "next/server";
import Game from "@/components/game";
import { dailyDeal, todayPacific } from "@/lib/daily";

export default async function Home() {
  await connection();
  const date = todayPacific();
  const deal = dailyDeal(date);
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-12 px-5 py-12">
      <div className="flex flex-col items-center gap-1.5">
        <h1 className="text-xl font-bold tracking-[0.06em]">
          <span className="text-accent">&gt;</span> undexfeated
        </h1>
        <p className="text-[13px] text-muted tabular-nums">daily · {date}</p>
      </div>
      <Game key={date} deal={deal} restartable={false} dailyDate={date} />
      <Link
        href="/practice"
        className="text-xs text-muted underline [text-underline-offset:3px] transition-colors duration-150 hover:text-accent"
      >
        practice mode
      </Link>
    </main>
  );
}
