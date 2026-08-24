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
    <main className="flex flex-1 flex-col items-center justify-center gap-6">
      <h1>undexfeated</h1>
      <form action={unlock} className="flex flex-col items-center gap-4">
        <input
          type="password"
          name="password"
          placeholder="password"
          autoFocus
          className="rounded-full border border-zinc-300 bg-transparent px-4 py-2 text-sm dark:border-zinc-700"
        />
        <button
          type="submit"
          className="rounded-full bg-foreground px-6 py-2 text-sm text-background hover:opacity-80"
        >
          enter
        </button>
        {wrong && <p className="text-xs text-zinc-500">wrong password</p>}
      </form>
    </main>
  );
}
