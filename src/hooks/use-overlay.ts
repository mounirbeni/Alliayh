"use client";

import { useEffect, useRef } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Modal overlay behaviour, in one place.
 *
 * The cart drawer, mobile menu and search overlay were all hand-rolled: they
 * rendered on top of the page but left keyboard focus behind them, could not be
 * closed with Escape, and (for the drawer) never locked background scroll. To a
 * screen-reader or keyboard user they were invisible traps.
 *
 * Returns a ref to attach to the panel element. While `isOpen`:
 *   - Escape calls `onClose`
 *   - Tab cycles inside the panel
 *   - background scrolling is locked
 *   - focus moves into the panel, and returns to the trigger on close
 */
export function useOverlay<T extends HTMLElement>(
  isOpen: boolean,
  onClose: () => void,
): React.RefObject<T | null> {
  const panelRef = useRef<T>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    // Move focus into the panel on the next frame, once it is mounted.
    const focusTimer = window.setTimeout(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const first = panel.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? panel).focus({ preventScroll: true });
    }, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (element) => element.offsetParent !== null || element === document.activeElement,
      );
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.body.style.overflow = overflow;
      previouslyFocused.current?.focus({ preventScroll: true });
    };
  }, [isOpen, onClose]);

  return panelRef;
}
