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

function statTotal(info: PokemonInfo): number {
  return (
    info.hp + info.attack + info.defense + info.sp_atk + info.sp_def + info.speed
  );
}

// The native share sheet is only worth invoking on phones/tablets — desktop
// browsers also expose navigator.share, but there a plain copy is nicer.
function isMobileDevice(): boolean {
  return (
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    // iPadOS reports itself as a Mac but is the only "Mac" with multitouch.
    (navigator.userAgent.includes("Mac") && navigator.maxTouchPoints > 1)
  );
}

// Highest possible base stat total — scales the reveal stat bars.
const MAX_MEMBER_TOTAL = 720;

export default function Game({
  deal,
  restartable = true,
  dailyDate,
}: {
  deal: number[];
  restartable?: boolean;
  dailyDate?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [started, setStarted] = useState(false);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [team, setTeam] = useState<(PokemonInfo | null)[] | null>(null);
  // Brief pause after the sixth pick so the completed draft registers
  // before the results take over.
  const [showResults, setShowResults] = useState(false);
  // Quick feedback after each decision; keyed so back-to-back picks re-animate.
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const round = decisions.length;
  const done = round === TEAM_SIZE;

  // −10 and +10 are each usable once per draft; keep is always available.
  const shiftUsed = (decision: Decision) =>
    decision !== 0 && decisions.includes(decision);

  const choose = (decision: Decision) => {
    if (done || shiftUsed(decision)) return;
    const dealt = deal[round];
    const landed = wrapDex(dealt, decision);
    // The round number is unique per pick, so consecutive toasts re-key.
    const id = round;
    setToast({
      id,
      text:
        decision === 0
          ? `kept #${landed}`
          : `#${dealt} ${decisionLabel(decision)} → #${landed}`,
    });
    setTimeout(() => setToast((t) => (t?.id === id ? null : t)), 1600);
    const next = [...decisions, decision];
    setDecisions(next);
    if (next.length === TEAM_SIZE) {
      const finals = deal.map((n, i) => wrapDex(n, next[i]));
      revealTeam(finals)
        .then(setTeam)
        .catch(() => setTeam(finals.map(() => null)));
      setTimeout(() => setShowResults(true), 1000);
    }
  };

  // A fresh deal remounts this component (keyed by deal), resetting decisions.
  const restart = () => startTransition(() => router.refresh());

  // Replay the same deal from round one (the daily's deal never changes).
  const playAgain = () => {
    setDecisions([]);
    setTeam(null);
    setShowResults(false);
    setToast(null);
    setCopied(false);
  };

  // Overlay anchored just above the wordmark — outside the layout flow,
  // so it never pushes content around.
  const toastEl = (
    <div
      aria-live="polite"
      className="pointer-events-none absolute inset-x-0 bottom-full z-50 mb-[88px] flex justify-center"
    >
      {toast && (
        <p
          key={toast.id}
          className="rounded-md bg-accent px-4 py-1.5 text-sm font-bold whitespace-nowrap tabular-nums text-background [animation:toast-in_0.2s_ease-out]"
        >
          {toast.text}
        </p>
      )}
    </div>
  );

  if (!started) {
    return (
      <div className="flex animate-fade-up flex-col items-center gap-7">
        <p className="max-w-[360px] text-center text-sm leading-[1.7] text-muted">
          draft a team of six by dex number alone — keep what you&apos;re dealt
          or shift it ±10. you only meet your team at the end.
        </p>
        <button
          onClick={() => setStarted(true)}
          className="rounded-md bg-accent px-9 py-[13px] text-sm font-bold tracking-[0.04em] text-background transition-[filter] duration-150 hover:brightness-[1.12]"
        >
          start draft
        </button>
      </div>
    );
  }

  if (done && showResults) {
    const members = (team ?? []).filter((m): m is PokemonInfo => m !== null);
    const sumStat = (
      key: "hp" | "attack" | "defense" | "sp_atk" | "sp_def" | "speed",
    ) => members.reduce((sum, m) => sum + m[key], 0);
    const teamTotal = members.reduce((sum, m) => sum + statTotal(m), 0);

    const shareDaily = async () => {
      const text = [
        "undexfeated",
        `daily · ${dailyDate}`,
        `team stat total ${teamTotal}`,
      ].join("\n");
      if (navigator.share && isMobileDevice()) {
        try {
          await navigator.share({ text });
        } catch {
          // user closed the share sheet
        }
        return;
      }
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="relative flex w-full max-w-[600px] animate-fade-up flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-0.5">
          <p className="text-xs uppercase tracking-[0.12em] text-muted">
            team stat total
          </p>
          <p className="text-[52px] font-bold leading-none text-accent tabular-nums">
            {team ? teamTotal : "…"}
          </p>
        </div>
        <ol className="flex w-full flex-col gap-2.5">
          {deal.map((n, i) => {
            const info = team?.[i];
            return (
              <li
                key={i}
                className="flex animate-fade-up flex-col gap-2 rounded-lg border border-border-2 bg-surface-2 px-4 py-3.5"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-[17px] font-bold tabular-nums">
                    #{wrapDex(n, decisions[i])}
                  </span>
                  <span className="flex-1 text-[15px] font-semibold">
                    {team ? (info?.name ?? "?") : "…"}
                  </span>
                  <span className="text-xs text-muted">
                    {info &&
                      (info.type2
                        ? `${info.type1} · ${info.type2}`
                        : info.type1)}
                  </span>
                </div>
                {info && (
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[11px] text-faint tabular-nums">
                      dealt #{n} ·{" "}
                      {decisions[i] === 0
                        ? "kept"
                        : `shifted ${decisionLabel(decisions[i])}`}
                    </p>
                    <p className="text-[11px] text-muted tabular-nums">
                      hp {info.hp} · atk {info.attack} · def {info.defense} ·
                      spa {info.sp_atk} · spd {info.sp_def} · spe {info.speed}
                    </p>
                    <div className="h-[3px] w-full rounded-sm bg-border-2">
                      <div
                        className="h-full rounded-sm bg-muted"
                        style={{
                          width: `${Math.min(100, (statTotal(info) / MAX_MEMBER_TOTAL) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
        {team && (
          <p className="text-xs text-muted tabular-nums">
            hp {sumStat("hp")} · atk {sumStat("attack")} · def{" "}
            {sumStat("defense")} · spa {sumStat("sp_atk")} · spd{" "}
            {sumStat("sp_def")} · spe {sumStat("speed")}
          </p>
        )}
        {dailyDate && team && (
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={shareDaily}
              className="rounded-md bg-accent px-9 py-[13px] text-sm font-bold tracking-[0.04em] text-background transition-[filter] duration-150 hover:brightness-[1.12]"
            >
              {copied ? "copied!" : "share result"}
            </button>
            <button
              onClick={playAgain}
              className="rounded-md border border-border-1 bg-surface px-5 py-3 text-sm font-semibold transition-colors duration-150 hover:border-accent hover:text-accent"
            >
              play again
            </button>
          </div>
        )}
        {restartable ? (
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={playAgain}
              className="rounded-md border border-border-1 bg-surface px-5 py-3 text-sm font-semibold transition-colors duration-150 hover:border-accent hover:text-accent"
            >
              play again
            </button>
            <button
              onClick={restart}
              disabled={pending}
              className="rounded-md border border-border-1 bg-surface px-5 py-3 text-sm font-semibold transition-colors duration-150 hover:border-accent hover:text-accent disabled:opacity-50"
            >
              new draft
            </button>
          </div>
        ) : (
          <p className="text-xs text-faint">new daily at midnight pst</p>
        )}
        {toastEl}
      </div>
    );
  }

  return (
    <div className="relative flex animate-fade-up flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-2.5">
        <div className="flex items-center gap-2">
          {Array.from({ length: TEAM_SIZE }, (_, i) => (
            <span
              key={i}
              className={`h-2.5 w-2.5 rounded-sm ${
                i < round
                  ? "bg-muted"
                  : i === round
                    ? "bg-accent"
                    : "border border-border-1"
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-muted">
          {done ? "draft complete" : `round ${round + 1} of ${TEAM_SIZE}`}
        </p>
        {round > 0 && (
          <p className="text-[11px] text-faint tabular-nums">
            so far:{" "}
            {decisions.map((d, i) => `#${wrapDex(deal[i], d)}`).join(" · ")}
          </p>
        )}
      </div>
      {toastEl}
      {done ? (
        <p className="animate-pulse text-sm text-muted">revealing your team…</p>
      ) : (
        <>
          <p className="text-[clamp(72px,16vw,120px)] font-bold leading-none tracking-[-0.02em] tabular-nums">
            <span className="text-hash">#</span>
            {deal[round]}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {DECISIONS.map((decision) => (
              <button
                key={decision}
                onClick={() => choose(decision)}
                disabled={shiftUsed(decision)}
                className="flex min-w-24 flex-col items-center gap-0.5 rounded-md border border-border-1 bg-surface px-5 py-3 transition-colors duration-150 hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-border-1 disabled:hover:text-foreground"
              >
                <span
                  className={`text-sm font-semibold ${
                    shiftUsed(decision) ? "line-through" : ""
                  }`}
                >
                  {decisionLabel(decision)}
                </span>
                <span className="text-[11px] text-muted tabular-nums">
                  → #{wrapDex(deal[round], decision)}
                </span>
              </button>
            ))}
          </div>
          <p className="text-xs text-faint">
            −10 and +10 can each be used once per draft
          </p>
        </>
      )}
    </div>
  );
}
