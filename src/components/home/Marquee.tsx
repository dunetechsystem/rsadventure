export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-night-950 py-4">
      <div className="flex w-max animate-marquee gap-8 hover:[animation-play-state:paused]">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-8 whitespace-nowrap font-label text-2xl font-semibold text-white/85 sm:text-3xl">
            {item}
            <span className="h-2.5 w-2.5 rotate-45 bg-flame-500" />
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-night-950" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-night-950" />
    </div>
  );
}
