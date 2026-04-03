"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Instagram, Twitter, Facebook, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function Footer() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    toast({
      title: "Subscribed to Circle",
      description: "You've successfully joined our inner circle. Check your inbox soon.",
    });
    setEmail('');
  };
  return (
    <footer className="bg-primary/5 py-32 border-t border-primary/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="space-y-8">
            <div className="flex flex-col">
              <span className="font-headline text-3xl text-primary">Lueur Skin</span>
              <span className="font-body text-[10px] uppercase tracking-[0.4em] text-foreground/60 font-bold">By Alliyah</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs font-body font-medium uppercase tracking-wider">
              Curating the alchemy of botanical elegance and clinical perfection for your unique aura.
            </p>
            <div className="flex gap-6 text-primary">
              <Instagram className="h-5 w-5 cursor-pointer hover:opacity-60 transition-opacity" />
              <Twitter className="h-5 w-5 cursor-pointer hover:opacity-60 transition-opacity" />
              <Facebook className="h-5 w-5 cursor-pointer hover:opacity-60 transition-opacity" />
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="font-body font-bold uppercase tracking-[0.3em] text-[10px] text-primary">The Collection</h4>
            <ul className="space-y-4 text-[10px] text-muted-foreground font-body font-bold uppercase tracking-[0.2em]">
              <li><Link href="/products?category=Cleansers" className="hover:text-primary transition-colors">Cleansing Rituals</Link></li>
              <li><Link href="/products?category=Serums" className="hover:text-primary transition-colors">Concentrates</Link></li>
              <li><Link href="/products?category=Moisturizers" className="hover:text-primary transition-colors">Hydration Layers</Link></li>
              <li><Link href="/products?category=Masks" className="hover:text-primary transition-colors">Overnight Recovery</Link></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="font-body font-bold uppercase tracking-[0.3em] text-[10px] text-primary">Experience</h4>
            <ul className="space-y-4 text-[10px] text-muted-foreground font-body font-bold uppercase tracking-[0.2em]">
              <li><Link href="/advisor" className="hover:text-primary transition-colors">Digital Consultation</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">Brand Narrative</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Concierge</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">Ritual Guide</Link></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="font-body font-bold uppercase tracking-[0.3em] text-[10px] text-primary">Circle of Light</h4>
            <p className="text-xs text-muted-foreground font-body leading-relaxed">Join our circle for seasonal drops and bespoke skincare wisdom.</p>
            <form onSubmit={handleSubscribe} className="relative mt-2">
              <input 
                type="email" 
                placeholder="Email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full bg-white dark:bg-black border border-primary/10 px-6 py-4 text-[10px] rounded-full focus:ring-1 focus:ring-primary outline-none font-body uppercase tracking-widest font-bold touch-manipulation"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 min-h-[44px] min-w-[44px] bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors touch-manipulation">
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-32 pt-10 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center gap-8 text-[8px] text-muted-foreground uppercase tracking-[0.4em] font-body font-bold">
          <p>&copy; 2026 Lueur Skin by Alliyah. Crafted for luminaries.</p>
          <div className="flex gap-12">
            <Link href="/legal/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/legal/accessibility" className="hover:text-primary transition-colors">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}