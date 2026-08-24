import { connection } from "next/server";
import Game from "@/components/game";
import { randomDeal } from "@/lib/dex";

export default async function Home() {
  await connection();
  const deal = randomDeal();
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10">
      <h1>undexfeated</h1>
      <Game key={deal.join("-")} deal={deal} />
    </main>
  );
}
