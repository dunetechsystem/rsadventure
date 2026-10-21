import Image from "next/image";
import { cn } from "@/lib/cn";

/** Selo da RS Adventure (o círculo listrado com a moto) — arquivo em /public/brand/rs-logo.png. */
export function RsMark({ className, priority = false }: { className?: string; priority?: boolean }) {
  return <Image src="/brand/rs-logo.png" alt="RS Adventure" width={512} height={512} priority={priority} className={cn("h-auto select-none", className ?? "w-full")} />;
}

/** Selo + "RS ADVENTURE" em letreiro condensado (cabeçalho e rodapé). */
export function RsLogo({ className, label = true }: { className?: string; label?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <RsMark className="w-[2.6em]" priority />
      {label && (
        <span className="font-label text-[1.25em] font-bold leading-[0.9] tracking-[0.04em] text-white">
          RS<span className="block text-flame-500">ADVENTURE</span>
        </span>
      )}
    </span>
  );
}
