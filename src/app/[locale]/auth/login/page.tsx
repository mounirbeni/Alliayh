"use client";

import { useState, useTransition, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuthStore } from "@/store/auth-store";
import { localizedPath } from "@/lib/locale-path";
import { isValidLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

const loginSchema = z.object({
  email: z.string().min(1, "Required").email("Enter a valid email"),
  password: z.string().min(1, "Required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = use(params);
  if (!isValidLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: LoginValues) {
    setServerError(null);
    startTransition(async () => {
      const result = await login(values.email, values.password);
      if (result.success) {
        router.push(localizedPath("/", locale));
      } else {
        setServerError(result.error ?? "Login failed.");
      }
    });
  }

  const pt = locale === "pt-PT";

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <h1 className="font-headline text-4xl">{pt ? "Bem-vindo de volta" : "Welcome back"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {pt ? "Entre na sua conta Lueur" : "Sign in to your Lueur account"}
          </p>
        </div>

        {/* Demo credentials */}
        <div className="mb-6 rounded-2xl border border-secondary/60 bg-secondary/20 p-4 text-xs text-muted-foreground">
          <p className="mb-1 font-semibold text-primary">{pt ? "Contas de demonstração:" : "Demo accounts:"}</p>
          <p><span className="font-medium">{pt ? "Admin:" : "Admin:"}</span> admin@lueur.skin / admin123</p>
          <p><span className="font-medium">{pt ? "Cliente:" : "Customer:"}</span> sofia@gmail.com / user123</p>
        </div>

        <div className="rounded-3xl border border-primary/10 bg-white/80 p-8 shadow-sm backdrop-blur">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{pt ? "Email" : "Email"}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your@email.com"
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{pt ? "Palavra-passe" : "Password"}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="rounded-xl pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword((v) => !v)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {serverError && (
                <p className="rounded-xl bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
                  {serverError}
                </p>
              )}

              <Button type="submit" disabled={isPending} className="w-full rounded-full" size="lg">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {pt ? "A entrar…" : "Signing in…"}
                  </>
                ) : (
                  pt ? "Entrar" : "Sign in"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {pt ? "Não tem conta?" : "Don't have an account?"}{" "}
            <Link href={localizedPath("/auth/register", locale)} className="font-medium text-primary hover:underline">
              {pt ? "Criar conta" : "Create account"}
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {pt ? "Ao entrar, aceita os nossos" : "By signing in, you agree to our"}{" "}
          <Link href={localizedPath("/terms", locale)} className="underline hover:text-primary">
            {pt ? "Termos" : "Terms"}
          </Link>{" "}
          {pt ? "e" : "and"}{" "}
          <Link href={localizedPath("/privacy", locale)} className="underline hover:text-primary">
            {pt ? "Privacidade" : "Privacy Policy"}
          </Link>
        </p>
      </div>
    </div>
  );
}
