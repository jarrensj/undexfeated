"use server";

import { getTeam, type PokemonInfo } from "@/lib/db";
import { MAX_DEX, TEAM_SIZE } from "@/lib/dex";

export async function revealTeam(finalNumbers: number[]): Promise<(PokemonInfo | null)[]> {
  if (
    !Array.isArray(finalNumbers) ||
    finalNumbers.length !== TEAM_SIZE ||
    finalNumbers.some((n) => !Number.isInteger(n) || n < 1 || n > MAX_DEX)
  ) {
    throw new Error("invalid team");
  }
  const team = await getTeam(finalNumbers);
  return finalNumbers.map((n) => team.get(n) ?? null);
}
