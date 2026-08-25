export const MAX_DEX = 1025;
export const TEAM_SIZE = 6;

// Shifts come from a two-d6 roll, so the largest possible shift is 12.
export const MAX_SHIFT = 12;

// Dealt numbers stay this far apart (circularly) so no two slots can
// land on the same dex number even after opposing max shifts.
export const MIN_GAP = 2 * MAX_SHIFT;

// Shifting wraps around the dex: #5 - 10 → #1020, #1020 + 10 → #5.
export function wrapDex(n: number, delta: number): number {
  return ((((n - 1 + delta) % MAX_DEX) + MAX_DEX) % MAX_DEX) + 1;
}

function circularDistance(a: number, b: number): number {
  const d = Math.abs(a - b);
  return Math.min(d, MAX_DEX - d);
}

// rng returns floats in [0, 1), like Math.random.
export function dealNumbers(rng: () => number, count = TEAM_SIZE): number[] {
  const deal: number[] = [];
  while (deal.length < count) {
    const candidate = Math.floor(rng() * MAX_DEX) + 1;
    if (deal.every((n) => circularDistance(n, candidate) > MIN_GAP)) {
      deal.push(candidate);
    }
  }
  return deal;
}

export function randomDeal(count = TEAM_SIZE): number[] {
  return dealNumbers(Math.random, count);
}
