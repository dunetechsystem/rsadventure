"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";

const ease = [0.22, 1, 0.36, 1] as const;
const logoMask = { maskImage: "url(/brand/rs-logo.png)", maskSize: "contain", maskRepeat: "no-repeat", maskPosition: "center" } as const;
// Centro da roda traseira no PNG de 512px — eixo do empinar.
const rearWheel = "43.6% 74.8%";

/**
 * Selo da RS Adventure animado. A logo foi separada em duas camadas do mesmo tamanho
 * (/brand/rs-logo-base.png sem a moto e /brand/rs-logo-moto.png só com a moto): o selo nasce
 * de baixo pra cima, a moto chega acelerando e depois fica com o motor tremendo e empinando
 * de tempos em tempos.
 */
export function AnimatedRsMark({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <div className={cn("relative aspect-square", className ?? "w-full")}>
      <motion.div
        aria-hidden
        className="absolute inset-[4%] animate-sun-halo rounded-full bg-[radial-gradient(circle,rgba(255,138,43,0.5),rgba(255,106,0,0.15)_45%,transparent_70%)] blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.5, duration: 1.6 }}
      />

      {/* Nascer: revela de baixo pra cima enquanto sobe */}
      <motion.div
        className="relative"
        initial={{ clipPath: "inset(100% 0 0 0)", y: 40, rotate: -8 }}
        animate={{ clipPath: "inset(0% 0 0 0)", y: 0, rotate: 0 }}
        transition={{ delay, duration: 1.4, ease }}
      >
        <Image src="/brand/rs-logo-base.png" alt="RS Adventure" width={512} height={512} priority className="h-auto w-full select-none" />
        <div
          aria-hidden
          className="absolute inset-0 animate-logo-shine bg-[linear-gradient(110deg,transparent_40%,rgba(255,255,255,0.75)_50%,transparent_60%)] bg-[length:250%_100%] mix-blend-overlay"
          style={logoMask}
        />

        {/* Moto: chega acelerando da esquerda, freia com um tranco e segue empinando de vez em quando */}
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={{ transformOrigin: rearWheel }}
          initial={{ x: "-45%", opacity: 0, rotate: 0 }}
          animate={{ x: ["-45%", "4%", "0%"], opacity: [0, 1, 1], rotate: [0, -10, 0] }}
          transition={{ delay: delay + 0.8, duration: 1.1, times: [0, 0.6, 1], ease: "easeOut" }}
        >
          <motion.div
            className="h-full w-full"
            style={{ transformOrigin: rearWheel }}
            animate={{ rotate: [0, -16, -13, -17, 0, 2, 0] }}
            transition={{ delay: delay + 3, duration: 1.8, times: [0, 0.25, 0.45, 0.65, 0.88, 0.94, 1], ease: "easeInOut", repeat: Infinity, repeatDelay: 3.5 }}
          >
            <Image src="/brand/rs-logo-moto.png" alt="" width={512} height={512} className="h-auto w-full animate-engine select-none" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
