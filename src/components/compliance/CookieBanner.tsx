"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/i18n/dictionaries";

const COOKIE_KEY = "lueur-cookie-consent-v1";

type Consent = "accepted" | "essential";

export function CookieBanner({ dictionary }: { dictionary: Dictionary }) {
  const [consent, setConsent] = useState<Consent | null>(null);

  useEffect(() => {
    const current = window.localStorage.getItem(COOKIE_KEY) as Consent | null;
    setConsent(current);
  }, []);

  if (consent) {
    return null;
  }

  const save = (value: Consent) => {
    window.localStorage.setItem(COOKIE_KEY, value);
    setConsent(value);
  };

  return (
    <div className="fixed bottom-4 left-1/2 z-[60] w-[calc(100%-1.5rem)] max-w-3xl -translate-x-1/2 rounded-2xl border border-primary/20 bg-background/95 p-4 shadow-2xl backdrop-blur">
      <p className="text-sm font-semibold">{dictionary.cookie.title}</p>
      <p className="mt-2 text-sm text-muted-foreground">{dictionary.cookie.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() => save("essential")}
          className="rounded-full"
        >
          {dictionary.cookie.essential}
        </Button>
        <Button
          variant="ghost"
          onClick={() => save("essential")}
          className="rounded-full"
        >
          {dictionary.cookie.rejectNonEssential}
        </Button>
        <Button onClick={() => save("accepted")} className="rounded-full">
          {dictionary.cookie.acceptAll}
        </Button>
      </div>
    </div>
  );
}
