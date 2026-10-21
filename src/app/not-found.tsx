import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 pt-24 text-center">
      <Compass size={48} className="text-flame-500" />
      <h1 className="mt-6 font-display text-5xl text-white">Se perdeu nas dunas?</h1>
      <p className="mt-3 text-white/60">Essa página não existe ou o passeio não está mais disponível.</p>
      <Link href="/passeios" className="mt-8 rounded-full bg-flame-500 px-6 py-3 font-bold text-white">
        Ver passeios
      </Link>
    </div>
  );
}
