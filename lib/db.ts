const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export type PokemonInfo = {
  dex_number: number;
  name: string;
  sprite_url: string | null;
  type1: string;
  type2: string | null;
  hp: number;
  attack: number;
  defense: number;
  sp_atk: number;
  sp_def: number;
  speed: number;
};

type StatsRow = Omit<PokemonInfo, "name" | "sprite_url"> & {
  pokemon_numbers: { name: string; sprite_url: string | null };
};

// Server-side only — the anon key has read-only RLS access, but the client
// should never talk to the database directly (teams stay hidden until reveal).
export async function getTeam(dexNumbers: number[]): Promise<Map<number, PokemonInfo>> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Missing SUPABASE_URL / SUPABASE_ANON_KEY");
  }
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/pokemon_stats?dex_number=in.(${dexNumbers.join(",")})&select=dex_number,type1,type2,hp,attack,defense,sp_atk,sp_def,speed,pokemon_numbers(name,sprite_url)`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      // Revalidate hourly so database edits (e.g. image changes) propagate
      // without a redeploy.
      next: { revalidate: 3600 },
    },
  );
  if (!res.ok) throw new Error(`team lookup failed: ${res.status}`);
  const rows: StatsRow[] = await res.json();
  return new Map(
    rows.map(({ pokemon_numbers, ...stats }) => [
      stats.dex_number,
      {
        ...stats,
        name: pokemon_numbers.name,
        sprite_url: pokemon_numbers.sprite_url,
      },
    ]),
  );
}
