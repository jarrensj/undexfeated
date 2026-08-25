import Link from "next/link";

const MODES = [
  { key: "daily", href: "/", label: "daily mode" },
  { key: "practice", href: "/practice", label: "practice mode" },
] as const;

export default function ModeNav({
  active,
}: {
  active: (typeof MODES)[number]["key"];
}) {
  return (
    <nav className="fixed top-4 left-5 z-40 flex items-center gap-3 text-xs">
      {MODES.map((mode) =>
        mode.key === active ? (
          <span key={mode.key} aria-current="page" className="font-semibold text-accent">
            {mode.label}
          </span>
        ) : (
          <Link
            key={mode.key}
            href={mode.href}
            className="text-muted underline [text-underline-offset:3px] transition-colors duration-150 hover:text-accent"
          >
            {mode.label}
          </Link>
        ),
      )}
    </nav>
  );
}
