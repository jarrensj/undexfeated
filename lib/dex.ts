export const MAX_DEX = 1025;
export const SHIFT = 10;
export const TEAM_SIZE = 6;

// Dealt numbers stay this far apart (circularly) so no two slots can
// land on the same dex number after shifting.
export const MIN_GAP = 2 * SHIFT;

export type Decision = -10 | 0 | 10;

// Shifting wraps around the dex: #5 - 10 → #1020, #1020 + 10 → #5.
export function wrapDex(n: number, delta: number): number {
  return ((((n - 1 + delta) % MAX_DEX) + MAX_DEX) % MAX_DEX) + 1;
}

function circularDistance(a: number, b: number): number {
  const d = Math.abs(a - b);
  return Math.min(d, MAX_DEX - d);
}

export function randomDeal(count = TEAM_SIZE): number[] {
  const deal: number[] = [];
  while (deal.length < count) {
    const candidate = Math.floor(Math.random() * MAX_DEX) + 1;
    if (deal.every((n) => circularDistance(n, candidate) > MIN_GAP)) {
      deal.push(candidate);
    }
  }
  return deal;
}
