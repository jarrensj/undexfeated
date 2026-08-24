"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { revealTeam } from "@/app/actions";
import type { PokemonInfo } from "@/lib/db";
import { type Decision, TEAM_SIZE, wrapDex } from "@/lib/dex";

const DECISIONS: Decision[] = [-10, 0, 10];

function decisionLabel(decision: Decision): string {
  if (decision === 0) return "keep";
  return decision > 0 ? `+${decision}` : `−${-decision}`;
}

export default function Game({ deal }: { deal: number[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [started, setStarted] = useState(false);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [team, setTeam] = useState<(PokemonInfo | null)[] | null>(null);

  const round = decisions.length;
  const done = round === TEAM_SIZE;

  // −10 and +10 are each usable once per draft; keep is always available.
  const shiftUsed = (decision: Decision) =>
    decision !== 0 && decisions.includes(decision);

  const choose = (decision: Decision) => {
    if (done || shiftUsed(decision)) return;
    const next = [...decisions, decision];
    setDecisions(next);
    if (next.length === TEAM_SIZE) {
      const finals = deal.map((n, i) => wrapDex(n, next[i]));
      revealTeam(finals)
        .then(setTeam)
        .catch(() => setTeam(finals.map(() => null)));
    }
  };

  // A fresh deal remounts this component (keyed by deal), resetting decisions.
  const restart = () => startTransition(() => router.refresh());

  if (!started) {
    return (
      <div className="flex flex-col items-center gap-6">
        <p className="max-w-xs text-center text-sm text-zinc-500">
          draft a team of six by dex number alone — keep what you&apos;re dealt
          or shift it ±10. you only meet your team at the end.
        </p>
        <button
          onClick={() => setStarted(true)}
          className="rounded-full bg-foreground px-6 py-2 text-sm text-background hover:opacity-80"
        >
          start
        </button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-lg font-medium">your team</h2>
        <ol className="flex flex-col gap-3 tabular-nums">
          {deal.map((n, i) => {
            const info = team?.[i];
            return (
              <li key={i} className="flex flex-col gap-0.5">
                <div className="flex items-center gap-3">
                  <span className="w-16 text-right text-zinc-500">#{n}</span>
                  <span className="w-12 text-center text-zinc-500">
                    {decisionLabel(decisions[i])}
                  </span>
                  <span className="w-16 font-semibold">
                    #{wrapDex(n, decisions[i])}
                  </span>
                  <span className="w-32 font-semibold">
                    {team ? (info?.name ?? "?") : "…"}
                  </span>
                </div>
                {info && (
                  <p className="pl-[13.25rem] text-xs text-zinc-500">
                    hp {info.hp} · atk {info.attack} · def {info.defense} · spa{" "}
                    {info.sp_atk} · spd {info.sp_def} · spe {info.speed}
                  </p>
                )}
              </li>
            );
          })}
        </ol>
        <button
          onClick={restart}
          disabled={pending}
          className="rounded-full border border-zinc-300 px-5 py-2 text-sm hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          new draft
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm text-zinc-500">
        round {round + 1} of {TEAM_SIZE}
      </p>
      <p className="text-6xl font-semibold tabular-nums">#{deal[round]}</p>
      <div className="flex gap-3">
        {DECISIONS.map((decision) => (
          <button
            key={decision}
            onClick={() => choose(decision)}
            disabled={shiftUsed(decision)}
            className="rounded-full border border-zinc-300 px-5 py-2 text-sm hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent dark:border-zinc-700 dark:hover:bg-zinc-900 dark:disabled:hover:bg-transparent"
          >
            {decisionLabel(decision)}
          </button>
        ))}
      </div>
      <p className="text-xs text-zinc-500">
        −10 and +10 can each be used once per draft
      </p>
    </div>
  );
}
