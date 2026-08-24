const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// Server-side only — the anon key has read-only RLS access, but the client
// should never talk to the database directly (names stay hidden until reveal).
export async function getNames(dexNumbers: number[]): Promise<Map<number, string>> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Missing SUPABASE_URL / SUPABASE_ANON_KEY");
  }
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/pokemon_numbers?dex_number=in.(${dexNumbers.join(",")})&select=dex_number,name`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      // Dex data never changes; cache lookups indefinitely.
      cache: "force-cache",
    },
  );
  if (!res.ok) throw new Error(`name lookup failed: ${res.status}`);
  const rows: { dex_number: number; name: string }[] = await res.json();
  return new Map(rows.map((row) => [row.dex_number, row.name]));
}
