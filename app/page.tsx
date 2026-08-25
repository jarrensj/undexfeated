import { connection } from "next/server";
import Game from "@/components/game";
import ModeNav from "@/components/mode-nav";
import { dailyDeal, todayPacific } from "@/lib/daily";

export default async function Home() {
  await connection();
  const date = todayPacific();
  const deal = dailyDeal(date);
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-12 px-5 py-12">
      <ModeNav active="daily" />
      <div className="flex flex-col items-center gap-1.5">
        <h1 className="text-xl font-bold tracking-[0.06em]">undexfeated</h1>
        <p className="text-[13px] text-muted tabular-nums">daily · {date}</p>
      </div>
      <Game key={date} deal={deal} restartable={false} dailyDate={date} />
    </main>
  );
}
