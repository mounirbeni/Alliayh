"use client";

import { use, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { dictionaries } from "@/i18n/dictionaries";
import { isValidLocale } from "@/i18n/config";
import { localizedPath } from "@/lib/locale-path";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/i18n/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ShieldCheck, Package, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  if (!isValidLocale(locale)) notFound();
  const dictionary = dictionaries[locale];
  const t = dictionary.checkout;
  const v = t.validation;

  const checkoutSchema = z.object({
    firstName: z.string().min(1, v.required),
    lastName: z.string().min(1, v.required),
    email: z.string().min(1, v.required).email(v.email),
    phone: z.string().optional(),
    address: z.string().min(5, v.required),
    city: z.string().min(2, v.required),
    postalCode: z.string().min(3, v.postalCode),
    country: z.string().min(2, v.required),
    agree: z.literal(true, {
      errorMap: () => ({ message: v.agree }),
    }),
  });

  type CheckoutValues = z.infer<typeof checkoutSchema>;

  const { items, clear } = useCartStore();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
    },
  });

  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderRef] = useState(() =>
    `LS-${Math.random().toString(36).toUpperCase().slice(2, 9)}`,
  );

  function onSubmit(_values: CheckoutValues) {
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      clear();
      setIsSuccess(true);
    });
  }

  if (items.length === 0 && !isSuccess) {
    return (
      <section className="container mx-auto max-w-3xl px-4 py-24 text-center">
        <Package className="mx-auto h-12 w-12 text-muted-foreground/40" />
        <p className="mt-6 font-headline text-2xl text-muted-foreground">{t.emptyCart}</p>
        <Button asChild className="mt-6 rounded-full" variant="outline">
          <Link href={localizedPath("/products", locale)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backToShop}
          </Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="container mx-auto max-w-5xl px-4 py-14">
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-lg py-10 text-center"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <h1 className="mt-6 font-headline text-4xl">{t.success.title}</h1>
            <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
              {orderRef}
            </p>
            <p className="mt-4 text-muted-foreground">{t.success.message}</p>
            <Button asChild className="mt-8 rounded-full" size="lg">
              <Link href={localizedPath("/products", locale)}>{t.success.cta}</Link>
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-headline text-5xl">{t.title}</h1>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="rounded-3xl border border-primary/10 p-6">
                    <h2 className="mb-5 font-medium">{t.customerSection}</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t.fields.firstName}</FormLabel>
                            <FormControl>
                              <Input className="rounded-xl" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t.fields.lastName}</FormLabel>
                            <FormControl>
                              <Input className="rounded-xl" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t.fields.email}</FormLabel>
                            <FormControl>
                              <Input type="email" className="rounded-xl" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t.fields.phone}</FormLabel>
                            <FormControl>
                              <Input type="tel" className="rounded-xl" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-primary/10 p-6">
                    <h2 className="mb-5 font-medium">{t.shippingSection}</h2>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t.fields.address}</FormLabel>
                            <FormControl>
                              <Input className="rounded-xl" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t.fields.city}</FormLabel>
                              <FormControl>
                                <Input className="rounded-xl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="postalCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t.fields.postalCode}</FormLabel>
                              <FormControl>
                                <Input className="rounded-xl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t.fields.country}</FormLabel>
                            <FormControl>
                              <Input className="rounded-xl" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-primary/10 p-6">
                    <h2 className="mb-4 font-medium">{t.paymentSection}</h2>
                    <div className="flex items-center gap-3 rounded-2xl border border-dashed border-primary/20 bg-muted/40 p-4">
                      <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
                      <p className="text-sm text-muted-foreground">{t.paymentNote}</p>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="agree"
                    render={({ field }) => (
                      <FormItem className="flex items-start gap-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-0.5"
                          />
                        </FormControl>
                        <div>
                          <FormLabel className="font-normal leading-relaxed text-muted-foreground">
                            {t.fields.agree}
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full rounded-full"
                    size="lg"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t.processing}
                      </>
                    ) : (
                      t.placeOrder
                    )}
                  </Button>
                </form>
              </Form>

              <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
                <div className="rounded-3xl border border-primary/10 p-5">
                  <h2 className="mb-4 font-medium">{t.summarySection}</h2>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-muted">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {dictionary.cart.singleItem} × {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium">
                          {formatCurrency(item.price * item.quantity, locale)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 space-y-2 border-t border-primary/10 pt-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t.subtotal}</span>
                      <span>{formatCurrency(subtotal, locale)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t.shipping}</span>
                      <span className="text-primary">{t.free}</span>
                    </div>
                    <div className="flex justify-between border-t border-primary/10 pt-2 font-semibold">
                      <span>{t.total}</span>
                      <span className="text-primary">{formatCurrency(subtotal, locale)}</span>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
