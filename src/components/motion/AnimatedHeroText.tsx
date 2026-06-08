"use client";

import { motion } from "framer-motion";
import { heroStagger, heroLine } from "@/lib/animations";
import type { ReactNode } from "react";

interface AnimatedHeroTextProps {
  kicker: ReactNode;
  titleParts: string[];
  subtitle: ReactNode;
  cta: ReactNode;
}

export function AnimatedHeroText({ kicker, titleParts, subtitle, cta }: AnimatedHeroTextProps) {
  return (
    <motion.div
      className="max-w-xl"
      initial="hidden"
      animate="visible"
      variants={heroStagger}
    >
      <motion.p
        variants={heroLine}
        className="text-[11px] uppercase tracking-[0.5em] text-white/60"
      >
        {kicker}
      </motion.p>

      <motion.h1
        variants={heroStagger}
        className="mt-5 font-headline text-6xl leading-[0.95] text-white md:text-8xl"
      >
        {titleParts.map((part, i) => (
          <motion.span key={i} variants={heroLine} className="block overflow-hidden">
            <motion.span className="block">
              {part}
              {i < titleParts.length - 1 ? "," : ""}
            </motion.span>
          </motion.span>
        ))}
      </motion.h1>

      <motion.p
        variants={heroLine}
        className="mt-7 max-w-sm text-base leading-relaxed text-white/70"
      >
        {subtitle}
      </motion.p>

      <motion.div variants={heroLine} className="mt-10 flex flex-wrap gap-4">
        {cta}
      </motion.div>
    </motion.div>
  );
}
