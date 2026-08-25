import Link from "next/link";

const MODES = [
  {
    key: "daily",
    href: "/",
    label: "daily mode",
    tooltip:
      "everyone's daily is dealt from the same seed — compare your score with anyone playing today",
  },
  {
    key: "practice",
    href: "/practice",
    label: "practice mode",
    tooltip: "a fresh random deal every time",
  },
] as const;

export default function ModeNav({
  active,
}: {
  active: (typeof MODES)[number]["key"];
}) {
  return (
    <nav className="fixed top-4 left-5 z-40 flex items-center gap-3 text-xs">
      {MODES.map((mode) => (
        <span key={mode.key} className="group relative">
          {mode.key === active ? (
            <span aria-current="page" className="font-semibold text-accent">
              {mode.label}
            </span>
          ) : (
            <Link
              href={mode.href}
              className="text-muted underline [text-underline-offset:3px] transition-colors duration-150 hover:text-accent"
            >
              {mode.label}
            </Link>
          )}
          <span
            role="tooltip"
            className="pointer-events-none absolute top-full left-0 mt-1.5 hidden w-60 rounded-md border border-border-2 bg-surface-2 px-3 py-2 text-[11px] leading-relaxed text-muted group-hover:block"
          >
            {mode.tooltip}
          </span>
        </span>
      ))}
    </nav>
  );
}
