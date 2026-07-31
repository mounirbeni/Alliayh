"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuthStore, type AuthErrorCode } from '@/lib/store/useAuthStore';
import { useToast } from '@/hooks/use-toast';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useLocaleStore } from '@/lib/store/useLocaleStore';

/**
 * Sign in.
 *
 * Credentials are now checked by Firebase. The previous handler called an
 * `api.auth.login()` that returned a hard-coded user for any non-empty email
 * and password — every visitor who typed anything was "signed in".
 */
export function LoginView() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isReady = useAuthStore((state) => state.isReady);
  const signIn = useAuthStore((state) => state.signIn);
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const { toast } = useToast();
  const { dictionary: t, locale } = useLocaleStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errorMessage = (code: AuthErrorCode): string => {
    const messages: Record<AuthErrorCode, string> = {
      'invalid-credentials': t.authErrors.invalidCredentials,
      'email-in-use': t.authErrors.emailInUse,
      'weak-password': t.authErrors.weakPassword,
      'too-many-requests': t.authErrors.tooManyRequests,
      'not-configured': t.authErrors.notConfigured,
      unknown: t.authErrors.unknown,
    };
    return messages[code];
  };

  useEffect(() => {
    if (isReady && isAuthenticated) router.replace(`/${locale}/account`);
  }, [isReady, isAuthenticated, router, locale]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await signIn(email, password);
    setIsSubmitting(false);

    if (result.ok) {
      toast({ title: t.login.welcomeBack, description: `${t.login.signedInAs} ${email}` });
      router.replace(`/${locale}/account`);
      return;
    }

    toast({
      title: t.login.authFailed,
      description: errorMessage(result.code),
      variant: 'destructive',
    });
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({ title: t.authErrors.invalidCredentials, variant: 'destructive' });
      return;
    }
    await resetPassword(email);
    // Always the same message, whether or not the account exists — otherwise
    // this form becomes an account-enumeration oracle.
    toast({ title: t.authErrors.passwordResetSent });
  };

  if (!isReady || isAuthenticated) return null;

  return (
    <>
      
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-white dark:bg-black/20 rounded-[2rem] border border-primary/10 p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="font-headline text-3xl uppercase tracking-widest mb-2">{t.login.title}</h1>
            <p className="text-muted-foreground italic text-sm">{t.login.subtitle}</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.login.emailPlaceholder}
                  className="w-full h-12 bg-transparent border border-primary/20 rounded-full pl-12 pr-4 focus:outline-none focus:border-primary transition-colors text-sm"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.login.passwordPlaceholder}
                  className="w-full h-12 bg-transparent border border-primary/20 rounded-full pl-12 pr-4 focus:outline-none focus:border-primary transition-colors text-sm"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-12 rounded-full bg-primary hover:bg-primary/90 uppercase tracking-widest text-xs font-bold flex gap-2"
            >
              {isSubmitting ? t.login.authenticating : t.login.signIn} <ArrowRight className="h-4 w-4" />
            </Button>
            
            <div className="pt-4 text-center border-t border-primary/10">
              <p className="text-xs text-muted-foreground uppercase tracking-widest pt-2">
                {t.login.noAccount} <Link href={`/${locale}/register`} className="text-primary font-bold hover:underline">{t.login.register}</Link>
              </p>
            </div>

            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground hover:text-primary transition-colors"
            >
              {t.authErrors.forgotPassword}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
