"use client";

import { use, useState, useTransition } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { notFound } from "next/navigation";
import { dictionaries } from "@/i18n/dictionaries";
import { isValidLocale } from "@/i18n/config";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getSkincareAdvice } from "@/app/actions/skincare-advisor-action";
import type { SkincareAdvisorOutput } from "@/ai/flows/ai-powered-skincare-advisor-flow";
import { Loader2, RotateCcw, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SKIN_TYPES = ["oily", "dry", "combination", "sensitive", "normal"] as const;
type SkinTypeValue = (typeof SKIN_TYPES)[number];

export default function AdvisorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  if (!isValidLocale(locale)) notFound();
  const dictionary = dictionaries[locale];
  const t = dictionary.advisor;

  const advisorSchema = z.object({
    skinType: z.enum(SKIN_TYPES, {
      required_error: t.validation.required,
      invalid_type_error: t.validation.skinType,
    }),
    concerns: z.string({ required_error: t.validation.required }).min(3, t.validation.minConcerns),
    goals: z.string({ required_error: t.validation.required }).min(3, t.validation.minGoals),
  });

  type AdvisorValues = z.infer<typeof advisorSchema>;

  const form = useForm<AdvisorValues>({
    resolver: zodResolver(advisorSchema),
    defaultValues: { concerns: "", goals: "" },
  });

  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState<SkincareAdvisorOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(values: AdvisorValues) {
    setError(null);
    setResults(null);
    const skinConcerns = values.concerns
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const goals = values.goals
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    startTransition(async () => {
      const result = await getSkincareAdvice({
        skinType: values.skinType,
        skinConcerns,
        goals,
      });
      if (result.success) {
        setResults(result.data);
      } else {
        setError(t.results.error);
      }
    });
  }

  return (
    <section className="container mx-auto max-w-3xl px-4 py-14">
      <p className="text-xs uppercase tracking-[0.35em] text-primary/70">{t.title}</p>
      <h1 className="mt-2 font-headline text-5xl">{t.title}</h1>
      <p className="mt-4 text-muted-foreground">{t.subtitle}</p>

      <AnimatePresence mode="wait">
        {!results ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-8 space-y-5 rounded-3xl border border-primary/10 bg-white/70 p-6 shadow-sm"
              >
                <FormField
                  control={form.control}
                  name="skinType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.fields.skinType.label}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder={t.fields.skinType.placeholder} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SKIN_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {t.skinTypeOptions[type]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="concerns"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.fields.concerns.label}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t.fields.concerns.placeholder}
                          rows={2}
                          className="rounded-xl resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">{t.fields.concerns.helper}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="goals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.fields.goals.label}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t.fields.goals.placeholder}
                          rows={2}
                          className="rounded-xl resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">{t.fields.goals.helper}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full rounded-full"
                  size="lg"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t.loading}
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      {t.submit}
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >
            <div className="mb-6 flex items-center gap-2 text-primary">
              <CheckCircle2 className="h-5 w-5" />
              <h2 className="font-headline text-2xl">{t.results.title}</h2>
            </div>
            <p className="mb-6 text-sm text-muted-foreground">{t.results.subtitle}</p>

            <div className="space-y-5">
              {results.recommendations.map((rec, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="rounded-3xl border border-primary/10 bg-white/80 p-6 shadow-sm"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-primary/60">
                    {t.results.product} {idx + 1}
                  </p>
                  <h3 className="mt-2 font-headline text-2xl">{rec.productName}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{rec.description}</p>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl bg-secondary/30 p-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary/70">
                        {t.results.benefits}
                      </p>
                      <p className="text-sm text-foreground/80">{rec.benefits}</p>
                    </div>
                    <div className="rounded-2xl bg-muted/50 p-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary/70">
                        {t.results.howToUse}
                      </p>
                      <p className="text-sm text-foreground/80">{rec.usageInstructions}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() => { setResults(null); form.reset(); }}
              className="mt-8 rounded-full"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              {t.results.tryAgain}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
