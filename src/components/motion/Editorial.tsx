"use client";

import { useRef, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Motion vocabulary for the redesign.
 *
 * Every primitive here checks `useReducedMotion` and renders the *final* state
 * when motion is reduced — never a permanently hidden element. That distinction
 * matters: a reveal implemented as "start at opacity 0, animate to 1" leaves
 * content invisible forever for anyone who disabled animation.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ *
 * MaskReveal — display type rising out of its own overflow mask.
 * ------------------------------------------------------------------ */
export function MaskReveal({
  children,
  delay = 0,
  className,
  as: Tag = 'span',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: 'span' | 'div';
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  /*
   * The observer watches the *mask*, not the text inside it.
   *
   * `whileInView` observes the element it animates. Since this animation starts
   * by translating that element 115% of its own height downward, a tall line of
   * type pushes itself clean out of the observed band — so it never intersects,
   * so it never animates back, so it stays hidden forever. Watching the wrapper
   * (which never moves) makes that deadlock structurally impossible.
   */
  const inView = useInView(ref, { once: true, amount: 0.35 });

  if (reduce) {
    return (
      <Tag className={cn('mask-line', className)}>
        <span className="block">{children}</span>
      </Tag>
    );
  }

  return (
    <Tag ref={ref as never} className={cn('mask-line', className)}>
      <motion.span
        className="block"
        initial={{ y: '115%', rotate: 2 }}
        animate={inView ? { y: '0%', rotate: 0 } : { y: '115%', rotate: 2 }}
        transition={{ duration: 1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </Tag>
  );
}

/* ------------------------------------------------------------------ *
 * Reveal — the general-purpose scroll entrance.
 * ------------------------------------------------------------------ */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  /*
   * A visibility *threshold*, not a shrunken root.
   *
   * A negative bottom root-margin lifts the trigger line above the fold, which
   * reads nicely mid-page but is unreachable at the end of the document:
   * anything inside that last band — the footer newsletter, for one — can never
   * scroll high enough to cross it, so it stayed at opacity 0 permanently. A
   * fraction-of-element threshold is always satisfiable, wherever it sits.
   */
  const inView = useInView(ref, { once: true, amount: 0.2 });

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.85, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ *
 * DrawRule — a hairline that draws in from the left.
 * ------------------------------------------------------------------ */
export function DrawRule({ className, delay = 0 }: { className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 'some' });

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn('block h-px w-full origin-left bg-rule', className)}
      style={{
        transform: reduce || inView ? 'scaleX(1)' : 'scaleX(0)',
        transition: reduce ? undefined : `transform 1.1s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    />
  );
}

/* ------------------------------------------------------------------ *
 * ParallaxImage — image drifts inside a fixed frame while the page scrolls.
 * The frame never moves, so nothing reflows; only the inner layer translates.
 * ------------------------------------------------------------------ */
export function ParallaxFrame({
  children,
  className,
  amount = 12,
}: {
  children: ReactNode;
  className?: string;
  /** Drift in percent of the frame height. */
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${amount}%`, `${amount}%`]);

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={reduce ? undefined : { y, scale: 1 + amount / 100 + 0.06 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Marquee — an infinite horizontal ticker.
 * The children are rendered twice and the track translates by -50%, which is
 * what makes the loop seamless. The duplicate is aria-hidden so a screen reader
 * hears the list once.
 * ------------------------------------------------------------------ */
export function Marquee({
  children,
  className,
  speed = 'normal',
  reverse = false,
}: {
  children: ReactNode;
  className?: string;
  speed?: 'normal' | 'slow';
  reverse?: boolean;
}) {
  return (
    <div className={cn('marquee-mask overflow-hidden', className)}>
      <div
        className={cn(
          'marquee-track',
          speed === 'slow' ? 'animate-marquee-slow' : 'animate-marquee',
        )}
        style={reverse ? { animationDirection: 'reverse' } : undefined}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Magnetic — a control that leans toward the cursor.
 * Pointer-only: it is driven by mouse position, so it simply never engages on
 * touch, and it is disabled entirely under reduced motion.
 * ------------------------------------------------------------------ */
export function Magnetic({
  children,
  className,
  strength = 0.25,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  const handleMove = (event: React.MouseEvent<HTMLSpanElement>) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (event.clientX - (rect.left + rect.width / 2)) * strength;
    const y = (event.clientY - (rect.top + rect.height / 2)) * strength;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = 'translate(0, 0)';
  };

  return (
    <span
      ref={ref}
      className={cn('inline-block transition-transform duration-600 ease-editorial', className)}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      {children}
    </span>
  );
}
