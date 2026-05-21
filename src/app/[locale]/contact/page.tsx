"use client";

import { use, useState, useTransition } from "react";
import { notFound } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { dictionaries } from "@/i18n/dictionaries";
import { isValidLocale } from "@/i18n/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Mail, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  if (!isValidLocale(locale)) notFound();
  const dictionary = dictionaries[locale];
  const t = dictionary.contact;

  const contactSchema = z.object({
    name: z.string().min(1, t.form.validation.name),
    email: z.string().email(t.form.validation.email),
    message: z.string().min(10, t.form.validation.message),
  });

  type ContactValues = z.infer<typeof contactSchema>;

  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);

  function onSubmit(_values: ContactValues) {
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 900));
      setIsSuccess(true);
      form.reset();
    });
  }

  return (
    <section className="container mx-auto max-w-4xl px-4 py-14">
      <p className="text-xs uppercase tracking-[0.35em] text-primary/70">{t.kicker}</p>
      <h1 className="mt-2 font-headline text-5xl">{t.title}</h1>
      <p className="mt-4 text-muted-foreground">{t.subtitle}</p>

      <div className="mt-10 grid gap-10 md:grid-cols-[1fr_280px]">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-start gap-4 rounded-3xl border border-primary/10 bg-white/70 p-8"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-7 w-7 text-primary" />
              </div>
              <p className="font-headline text-2xl">{t.form.success}</p>
              <Button
                variant="outline"
                onClick={() => setIsSuccess(false)}
                className="rounded-full"
              >
                {locale === "pt-PT" ? "Enviar outra mensagem" : "Send another message"}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 rounded-3xl border border-primary/10 bg-white/70 p-6 shadow-sm"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.form.name}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t.form.namePlaceholder}
                            className="rounded-xl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.form.email}</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder={t.form.emailPlaceholder}
                            className="rounded-xl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.form.message}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t.form.messagePlaceholder}
                            rows={5}
                            className="resize-none rounded-xl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full rounded-full"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {locale === "pt-PT" ? "A enviar…" : "Sending…"}
                      </>
                    ) : (
                      t.form.send
                    )}
                  </Button>
                </form>
              </Form>
            </motion.div>
          )}
        </AnimatePresence>

        <aside className="space-y-4">
          <div className="flex items-start gap-3 rounded-2xl border border-primary/10 bg-white/70 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {t.info.emailLabel}
              </p>
              <p className="mt-0.5 text-sm">{t.info.emailValue}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-primary/10 bg-white/70 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {t.info.hoursLabel}
              </p>
              <p className="mt-0.5 text-sm">{t.info.hoursValue}</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
