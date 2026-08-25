import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function GatePage({
  searchParams,
}: {
  searchParams: Promise<{ wrong?: string }>;
}) {
  const { wrong } = await searchParams;

  async function unlock(formData: FormData) {
    "use server";
    const password = process.env.WEBSITE_PASSWORD;
    if (password && formData.get("password") === password) {
      const cookieStore = await cookies();
      cookieStore.set("website_password", password, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
      redirect("/");
    }
    redirect("/gate?wrong=1");
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-12 px-5 py-12">
      <h1 className="text-xl font-bold tracking-[0.06em]">
          <span className="text-accent">&gt;</span> undexfeated
        </h1>
      <form action={unlock} className="flex flex-col items-center gap-4">
        <input
          type="password"
          name="password"
          placeholder="password"
          autoFocus
          className="rounded-none border border-border-1 bg-surface px-4 py-2 text-sm outline-none focus:border-accent"
        />
        <button
          type="submit"
          className="rounded-none bg-accent px-9 py-3 text-sm font-bold tracking-[0.04em] text-background transition-[filter] duration-150 hover:brightness-[1.12]"
        >
          [ enter ]
        </button>
        {wrong && <p className="text-xs text-faint">wrong password</p>}
      </form>
    </main>
  );
}
