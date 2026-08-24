"use server";

import { getNames } from "@/lib/db";
import { MAX_DEX, TEAM_SIZE } from "@/lib/dex";

export async function revealTeam(finalNumbers: number[]): Promise<string[]> {
  if (
    !Array.isArray(finalNumbers) ||
    finalNumbers.length !== TEAM_SIZE ||
    finalNumbers.some((n) => !Number.isInteger(n) || n < 1 || n > MAX_DEX)
  ) {
    throw new Error("invalid team");
  }
  const names = await getNames(finalNumbers);
  return finalNumbers.map((n) => names.get(n) ?? `#${n}`);
}
