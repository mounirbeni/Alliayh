"use client";

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { skincareAdvisor, SkincareAdvisorOutput } from '@/ai/flows/ai-powered-skincare-advisor-flow';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Sparkles, RefreshCw, CheckCircle2, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const SKIN_TYPES = [
  { id: 'oily', label: 'Oily' },
  { id: 'dry', label: 'Dry' },
  { id: 'combination', label: 'Combination' },
  { id: 'sensitive', label: 'Sensitive' },
  { id: 'normal', label: 'Normal' },
] as const;

const CONCERNS = [
  'Acne', 'Fine Lines', 'Dark Spots', 'Redness', 'Dehydration', 'Dullness', 'Large Pores'
];

const GOALS = [
  'Brighten Skin', 'Even Texture', 'Deep Hydration', 'Anti-Aging', 'Calm Sensitivity', 'Oil Control'
];

export default function AdvisorPage() {
  const [step, setStep] = useState(1);
  const [skinType, setSkinType] = useState<typeof SKIN_TYPES[number]['id']>('normal');
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<SkincareAdvisorOutput | null>(null);

  const toggleConcern = (concern: string) => {
    setSelectedConcerns(prev => 
      prev.includes(concern) ? prev.filter(c => c !== concern) : [...prev, concern]
    );
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev => 
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await skincareAdvisor({
        skinType,
        skinConcerns: selectedConcerns,
        goals: selectedGoals
      });
      setRecommendations(result);
      setStep(4);
    } catch (error) {
      console.error("AI Advisor error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/10">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          {step < 4 && (
            <div className="text-center space-y-6 mb-16 animate-in fade-in duration-1000">
              <Badge className="bg-primary/5 text-primary border-primary/20 font-body uppercase tracking-[0.4em] px-8 py-2 text-[10px] rounded-full mb-4">
                Persona Calibration
              </Badge>
              <h1 className="font-headline text-6xl md:text-8xl tracking-tighter leading-none">Your Persona <br /><span className="italic font-light">Reveal</span></h1>
              <p className="text-muted-foreground font-body text-xs uppercase tracking-[0.2em] font-medium max-w-lg mx-auto leading-relaxed">
                Provide the variables of your skin journey, and our AI intelligence will calculate your optimal ritual.
              </p>
              
              <div className="flex justify-center gap-4 pt-10">
                {[1, 2, 3].map(i => (
                  <div key={i} className={cn(
                    "h-1 rounded-full transition-all duration-500",
                    step >= i ? 'w-16 bg-primary' : 'w-8 bg-primary/10'
                  )} />
                ))}
              </div>
            </div>
          )}

          <div className={cn(
            "glass p-8 md:p-20 rounded-[4rem] shadow-2xl shadow-primary/5 min-h-[500px] flex flex-col transition-all duration-700",
            step === 4 && "p-8 md:p-12"
          )}>
            {step === 1 && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="space-y-8 text-center">
                  <h2 className="font-headline text-3xl tracking-tight">Select Skin Typology</h2>
                  <RadioGroup value={skinType} onValueChange={(val: any) => setSkinType(val)} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 pt-6">
                    {SKIN_TYPES.map(type => (
                      <div key={type.id} className="relative group">
                        <RadioGroupItem value={type.id} id={type.id} className="sr-only" />
                        <Label
                          htmlFor={type.id}
                          className={cn(
                            "w-full block text-center py-6 px-4 rounded-[2rem] border transition-all cursor-pointer font-body uppercase tracking-[0.3em] text-[10px] font-bold",
                            skinType === type.id 
                              ? 'bg-primary border-primary text-white shadow-xl scale-105' 
                              : 'bg-white/50 border-primary/10 hover:border-primary/40 text-foreground/70'
                          )}
                        >
                          {type.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <Button className="w-full h-20 rounded-full font-body uppercase tracking-[0.4em] text-[10px] font-bold bg-primary hover:bg-primary/90 mt-12 shadow-2xl flex gap-3" onClick={() => setStep(2)}>
                  Proceed to Variables <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="space-y-8 text-center">
                  <h2 className="font-headline text-3xl tracking-tight">Identify Concerns</h2>
                  <p className="font-body text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">Select all relevant parameters.</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6">
                    {CONCERNS.map(concern => (
                      <div
                        key={concern}
                        onClick={() => toggleConcern(concern)}
                        className={cn(
                          "flex items-center gap-4 p-6 rounded-[2rem] border cursor-pointer transition-all font-body uppercase tracking-[0.2em] text-[10px] font-bold",
                          selectedConcerns.includes(concern) 
                            ? 'bg-primary/10 border-primary text-primary shadow-lg' 
                            : 'bg-white/50 border-primary/5 hover:border-primary/20 text-foreground/70'
                        )}
                      >
                        <Checkbox checked={selectedConcerns.includes(concern)} className="border-primary data-[state=checked]:bg-primary" />
                        <span>{concern}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-6 pt-6">
                  <Button variant="ghost" className="flex-1 h-20 rounded-full font-body uppercase tracking-[0.4em] text-[10px] font-bold flex gap-3" onClick={() => setStep(1)}>
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                  <Button className="flex-[2] h-20 rounded-full font-body uppercase tracking-[0.4em] text-[10px] font-bold bg-primary hover:bg-primary/90 shadow-2xl flex gap-3" onClick={() => setStep(3)}>
                    Set Ritual Goals <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="space-y-8 text-center">
                  <h2 className="font-headline text-3xl tracking-tight">Calibrate Ritual Goals</h2>
                  <p className="font-body text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">Desired aesthetic outcomes.</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6">
                    {GOALS.map(goal => (
                      <div
                        key={goal}
                        onClick={() => toggleGoal(goal)}
                        className={cn(
                          "flex items-center gap-4 p-6 rounded-[2rem] border cursor-pointer transition-all font-body uppercase tracking-[0.2em] text-[10px] font-bold",
                          selectedGoals.includes(goal) 
                            ? 'bg-primary/10 border-primary text-primary shadow-lg' 
                            : 'bg-white/50 border-primary/5 hover:border-primary/20 text-foreground/70'
                        )}
                      >
                        <Checkbox checked={selectedGoals.includes(goal)} className="border-primary data-[state=checked]:bg-primary" />
                        <span>{goal}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-6 pt-6">
                  <Button variant="ghost" className="flex-1 h-20 rounded-full font-body uppercase tracking-[0.4em] text-[10px] font-bold flex gap-3" onClick={() => setStep(2)}>
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                  <Button 
                    className="flex-[2] h-20 rounded-full font-body uppercase tracking-[0.4em] text-[10px] font-bold bg-primary text-white hover:bg-primary/90 shadow-2xl flex gap-4" 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    {isAnalyzing ? 'Calibrating...' : 'Reveal Ritual'}
                  </Button>
                </div>
              </div>
            )}

            {step === 4 && recommendations && (
              <div className="animate-in fade-in duration-1000 space-y-16 py-12">
                <div className="text-center space-y-8">
                  <div className="h-24 w-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="h-10 w-10 text-primary" />
                  </div>
                  <h1 className="font-headline text-5xl md:text-7xl tracking-tighter leading-none">The Reveal</h1>
                  <p className="font-body text-xs uppercase tracking-[0.3em] font-bold text-primary max-w-lg mx-auto leading-relaxed">
                    Custom calibrated for {skinType} typology with focus on {selectedConcerns.join(', ')}.
                  </p>
                </div>

                <div className="space-y-12">
                  {recommendations.recommendations.map((rec, i) => (
                    <Card key={i} className="border-none shadow-none bg-white/40 p-1 rounded-[3rem] overflow-hidden group">
                      <div className="flex flex-col md:flex-row gap-10 p-10">
                        <div className="w-full md:w-48 aspect-square relative rounded-[2rem] overflow-hidden bg-white shadow-xl flex-shrink-0">
                          <Image
                            src={`https://picsum.photos/seed/${rec.productName}/400/400`}
                            alt={rec.productName}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>
                        <div className="flex-1 space-y-6">
                          <div className="flex justify-between items-start">
                            <h3 className="font-headline text-3xl group-hover:text-primary transition-colors">{rec.productName}</h3>
                            <Badge className="bg-primary/5 text-primary border-none font-body text-[8px] uppercase tracking-[0.4em] font-bold rounded-full px-4 py-2">Step {i + 1}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed italic font-medium font-body opacity-80">{rec.description}</p>
                          <div className="flex items-start gap-4">
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                              <CheckCircle2 className="h-3 w-3 text-primary" />
                            </div>
                            <p className="text-xs font-body font-bold uppercase tracking-[0.15em] text-foreground/80">{rec.benefits}</p>
                          </div>
                          <div className="bg-white/80 p-8 rounded-[2rem] border border-primary/5">
                            <h4 className="text-[8px] uppercase tracking-[0.4em] font-bold text-primary mb-3">Calibration Instructions</h4>
                            <p className="text-xs italic leading-relaxed text-muted-foreground">{rec.usageInstructions}</p>
                          </div>
                          <Button className="w-full md:w-auto rounded-full mt-4 flex gap-3 h-14 bg-primary text-white hover:opacity-90 font-body uppercase tracking-[0.3em] text-[10px] px-10 font-bold shadow-xl">
                            <ShoppingBag className="h-4 w-4" /> Add to Aura
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="pt-20 border-t border-primary/10 text-center space-y-10">
                  <div className="max-w-2xl mx-auto space-y-8">
                    <h3 className="font-headline text-4xl tracking-tight leading-tight">Complete Calibration Summary</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-body font-medium italic">
                      This 3-step ritual is specifically engineered to stabilize your moisture barrier while aggressively targeting {selectedConcerns.length > 0 ? selectedConcerns.join(' and ') : 'your primary concerns'}.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                      <Button className="rounded-full h-20 px-16 font-body uppercase tracking-[0.4em] text-[10px] font-bold bg-primary text-white hover:opacity-90 shadow-2xl">
                        Acquire Complete Ritual
                      </Button>
                      <Button variant="ghost" className="font-body uppercase tracking-[0.4em] text-[10px] font-bold h-20 px-10" onClick={() => {
                        setStep(1);
                        setRecommendations(null);
                      }}>
                        Recalibrate variables
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}