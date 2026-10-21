/** Onda que separa as seções — a mesma curva da lagoa da logo. Cor = currentColor. */
export function Wave({ className, flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      className={className}
      style={flip ? { transform: "scaleY(-1)" } : undefined}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M0 38c120-20 240-30 360-24s240 30 360 30 240-28 360-34 240 8 360 22v28H0z"
      />
    </svg>
  );
}
