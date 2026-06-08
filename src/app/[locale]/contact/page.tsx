"use client";

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mail, Clock, MapPin, Send } from 'lucide-react';
import { useLocaleStore } from '@/lib/store/useLocaleStore';

export default function ContactPage() {
  const { toast } = useToast();
  const { dictionary: t } = useLocaleStore();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network request
    setTimeout(() => {
      toast({
        title: t.contact.messageSent,
        description: t.contact.messageSentDesc,
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-12 lg:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
             <h1 className="font-headline text-5xl tracking-tight mb-4">{t.contact.title}</h1>
             <p className="text-muted-foreground font-body italic">{t.contact.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-12">
              <div className="space-y-6">
                <h3 className="font-headline text-2xl">{t.contact.getInTouch}</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed max-w-md">
                  {t.contact.description}
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h5 className="font-headline text-lg">{t.contact.emailTitle}</h5>
                    <p className="text-sm text-muted-foreground font-body">{t.contact.emailValue}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h5 className="font-headline text-lg">{t.contact.hoursTitle}</h5>
                    <p className="text-sm text-muted-foreground font-body">{t.contact.hoursValue}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h5 className="font-headline text-lg">{t.contact.locationTitle}</h5>
                    <p className="text-sm text-muted-foreground font-body">{t.contact.locationValue}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-black/20 p-8 md:p-12 rounded-[3rem] border border-primary/10 shadow-xl lg:mt-0 mt-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs uppercase tracking-widest font-bold text-muted-foreground pl-2">{t.contact.formName}</label>
                  <input 
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="flex h-12 min-h-[44px] w-full rounded-2xl border border-input bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:border-primary transition-colors touch-manipulation"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs uppercase tracking-widest font-bold text-muted-foreground pl-2">{t.contact.formEmail}</label>
                  <input 
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="flex h-12 min-h-[44px] w-full rounded-2xl border border-input bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:border-primary transition-colors touch-manipulation"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-xs uppercase tracking-widest font-bold text-muted-foreground pl-2">{t.contact.formSubject}</label>
                  <select 
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="flex h-12 w-full rounded-2xl border border-input bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:border-primary transition-colors touch-manipulation"
                  >
                    <option value="" disabled>{t.contact.selectInquiry}</option>
                    <option value="order">{t.contact.orderSupport}</option>
                    <option value="regimen">{t.contact.regimenAdvice}</option>
                    <option value="press">{t.contact.pressMedia}</option>
                    <option value="other">{t.contact.other}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs uppercase tracking-widest font-bold text-muted-foreground pl-2">{t.contact.formMessage}</label>
                  <textarea 
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="flex w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm focus-visible:outline-none focus-visible:border-primary transition-colors resize-none touch-manipulation"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 text-[10px] uppercase tracking-widest font-bold font-body transition-all touch-manipulation"
                >
                  {isSubmitting ? t.contact.sending : <><Send className="w-4 h-4 mr-2" /> {t.contact.sendMessage}</>}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
