"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function NewsletterForm({ locale }: { locale: string }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const pt = locale === "pt-PT";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="mt-6 flex flex-col items-center gap-3">
        <CheckCircle2 className="h-7 w-7 text-primary-foreground/60" />
        <p className="text-sm text-primary-foreground/60">
          {pt ? "Obrigada por se juntar ao ritual." : "Thank you for joining the ritual."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
      <Input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={pt ? "O seu endereço de email" : "Your email address"}
        className="flex-1 rounded-full border-white/15 bg-white/8 text-primary-foreground placeholder:text-primary-foreground/35 focus-visible:ring-white/25"
      />
      <Button
        type="submit"
        disabled={loading}
        size="icon"
        className="h-10 w-10 shrink-0 rounded-full bg-white text-primary hover:bg-white/90"
        aria-label={pt ? "Subscrever" : "Subscribe"}
      >
        {loading ? (
          <span className="block h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        ) : (
          <ArrowRight className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
}
