"use client";

import { motion } from "framer-motion";
import { slideLeft, slideRight } from "@/lib/animations";
import type { ReactNode } from "react";

interface SlideInProps {
  children: ReactNode;
  className?: string;
  direction?: "left" | "right";
  delay?: number;
}

export function SlideIn({ children, className, direction = "left", delay = 0 }: SlideInProps) {
  const base = direction === "left" ? slideLeft : slideRight;
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: base.hidden,
        visible: {
          ...base.visible,
          transition: {
            ...(base.visible as { transition?: object }).transition,
            delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
