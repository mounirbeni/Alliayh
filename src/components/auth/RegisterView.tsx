"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/useAuthStore';
import type { AuthErrorCode } from '@/lib/auth/actions';
import { useToast } from '@/hooks/use-toast';
import { Lock, Mail, User, ArrowRight } from 'lucide-react';
import { useLocaleStore } from '@/lib/store/useLocaleStore';

/**
 * Create an account.
 *
 * The password is hashed with scrypt on the server and never stored in any
 * reversible form. The account exists only once the server has written the user
 * row and issued a session cookie.
 */
export function RegisterView() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isReady = useAuthStore((state) => state.isReady);
  const registerAccount = useAuthStore((state) => state.register);
  const { toast } = useToast();
  const { dictionary: t, locale } = useLocaleStore();

  const [name, setName] = useState('');
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await registerAccount(name, email, password);
    setIsSubmitting(false);

    if (result.ok) {
      toast({ title: t.register.accountCreated, description: t.register.accountCreatedDesc });
      router.replace(`/${locale}/account`);
      return;
    }

    toast({
      title: t.register.registrationFailed,
      description: errorMessage(result.code),
      variant: 'destructive',
    });
  };

  if (!isReady || isAuthenticated) return null;

  return (
    <>
      
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-white dark:bg-black/20 rounded-[2rem] border border-primary/10 p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="font-headline text-3xl uppercase tracking-widest mb-2">{t.register.title}</h1>
            <p className="text-muted-foreground italic text-sm">{t.register.subtitle}</p>
          </div>
          
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.register.namePlaceholder}
                  className="w-full h-12 bg-transparent border border-primary/20 rounded-full pl-12 pr-4 focus:outline-none focus:border-primary transition-colors text-sm"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.register.emailPlaceholder}
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
                  placeholder={t.register.passwordPlaceholder}
                  className="w-full h-12 bg-transparent border border-primary/20 rounded-full pl-12 pr-4 focus:outline-none focus:border-primary transition-colors text-sm"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-12 rounded-full bg-primary hover:bg-primary/90 uppercase tracking-widest text-xs font-bold flex gap-2"
            >
              {isSubmitting ? t.register.creating : t.register.createAccount} <ArrowRight className="h-4 w-4" />
            </Button>
            
            <div className="pt-4 text-center border-t border-primary/10">
              <p className="text-xs text-muted-foreground uppercase tracking-widest pt-2">
                {t.register.hasAccount} <Link href={`/${locale}/login`} className="text-primary font-bold hover:underline">{t.register.signIn}</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
