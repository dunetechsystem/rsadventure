/**
 * Descrição dos passeios como a agência escreve no DunasTour: linhas com emoji, títulos em
 * MAIÚSCULAS e "⸻" separando blocos. Vira títulos, parágrafos e divisórias.
 */
export function RichText({ text }: { text: string }) {
  const blocks: React.ReactNode[] = [];
  text.split("\n").forEach((raw, i) => {
    const line = raw.trim();
    if (!line) return;
    if (/^[⸻—–_\-=•.\s]{3,}$/.test(line)) {
      blocks.push(<hr key={i} className="my-6 border-0 border-t border-dashed border-white/15" />);
      return;
    }
    const letters = line.replace(/[^\p{L}]/gu, "");
    if (letters.length >= 4 && letters === letters.toUpperCase() && line.length < 70) {
      blocks.push(
        <h3 key={i} className="mb-2 mt-6 font-display text-2xl text-white first:mt-0">
          {line}
        </h3>
      );
      return;
    }
    blocks.push(
      <p key={i} className="mb-2 leading-relaxed text-white/75">
        {line}
      </p>
    );
  });
  return <div>{blocks}</div>;
}

export function LineList({ text, icon }: { text: string; icon: React.ReactNode }) {
  const lines = text
    .split("\n")
    .map((l) => l.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
  return (
    <ul className="space-y-2.5">
      {lines.map((l, i) => (
        <li key={i} className="flex gap-3 text-white/75">
          <span className="mt-0.5 shrink-0">{icon}</span>
          {l}
        </li>
      ))}
    </ul>
  );
}
