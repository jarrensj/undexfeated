import { dealNumbers } from "./dex";

// UTC date string like "2026-08-24" — the seed for the day's deal.
// The daily resets at UTC midnight.
export function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

// xmur3 string hash seeding a mulberry32 PRNG — deterministic per date,
// so every player gets the same deal on the same (UTC) day.
function seededRng(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = (h ^= h >>> 16) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function dailyDeal(date: string = todayUtc()): number[] {
  return dealNumbers(seededRng(date));
}
