"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, login } = useAuthStore();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated) {
      router.push('/account');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const user = await api.auth.login(email, password);
      login(user);
      toast({
        title: "Welcome back",
        description: `Successfully signed in as ${user.name}`,
      });
      router.push('/account');
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted || isAuthenticated) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-white dark:bg-black/20 rounded-[2rem] border border-primary/10 p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="font-headline text-3xl uppercase tracking-widest mb-2">Welcome Back</h1>
            <p className="text-muted-foreground italic text-sm">Enter your credentials to access your Lueur Ritual.</p>
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
                  placeholder="Email Address"
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
                  placeholder="Password"
                  className="w-full h-12 bg-transparent border border-primary/20 rounded-full pl-12 pr-4 focus:outline-none focus:border-primary transition-colors text-sm"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-12 rounded-full bg-primary hover:bg-primary/90 uppercase tracking-widest text-xs font-bold flex gap-2"
            >
              {isSubmitting ? "Authenticating..." : "Sign In"} <ArrowRight className="h-4 w-4" />
            </Button>
            
            <div className="pt-4 text-center border-t border-primary/10">
              <p className="text-xs text-muted-foreground uppercase tracking-widest pt-2">
                Don't have an account? <Link href="#" className="text-primary font-bold hover:underline">Register</Link>
              </p>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
