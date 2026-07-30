"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, RefreshCw, ShoppingBag, ArrowLeft, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useLocaleStore } from '@/lib/store/useLocaleStore';
import { useCartStore } from '@/lib/store/useCartStore';
import { useCartDrawerStore } from '@/lib/store/useCartDrawerStore';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/i18n/format';
import { CONCERNS, type Concern, type Product } from '@/lib/catalog';
import type { AdvisorResult } from '@/ai/flows/ai-powered-skincare-advisor-flow';
import { requestRecommendations } from '@/app/[locale]/advisor/actions';

const SKIN_TYPES = ['normal', 'dry', 'oily', 'combination', 'sensitive'] as const;
type SkinType = (typeof SKIN_TYPES)[number];

const GOAL_KEYS = ['glow', 'texture', 'hydration', 'ageing', 'calm', 'energy'] as const;
type GoalKey = (typeof GOAL_KEYS)[number];

const TOTAL_STEPS = 3;

/**
 * The advisor questionnaire.
 *
 * Every string on this page used to be hard-coded English, including for
 * Portuguese visitors — the `advisor` block in both dictionaries existed but was
 * never referenced. The concerns list is now the same taxonomy the catalog and
 * the filters use, so an answer here maps to real products instead of free text
 * the model had to guess at.
 */
export function AdvisorView({ products }: { products: Product[] }) {
  const { dictionary: t, locale } = useLocaleStore();
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartDrawerStore((state) => state.open);
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [skinType, setSkinType] = useState<SkinType>('normal');
  const [selectedConcerns, setSelectedConcerns] = useState<Concern[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<GoalKey[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AdvisorResult | null>(null);
  const [error, setError] = useState(false);

  const toggle = <T,>(list: T[], value: T): T[] =>
    list.includes(value) ? list.filter((entry) => entry !== value) : [...list, value];

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(false);
    try {
      const response = await requestRecommendations({
        skinType,
        concerns: selectedConcerns,
        goals: selectedGoals.map((goal) => t.advisor.goalOptions[goal]),
        locale,
      });
      setResult(response);
      setStep(4);
    } catch (cause) {
      console.error('Advisor request failed:', cause);
      setError(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddToBag = (productId: string) => {
    const product = products.find((entry) => entry.id === productId);
    if (!product) return;
    const outcome = addItem(product, 1);
    if (outcome.added === 0) return;
    openCart();
    toast({ title: t.product.addedToBag, description: `${product.name} ${t.product.addedDesc}` });
  };

  const restart = () => {
    setStep(1);
    setResult(null);
    setError(false);
    setSelectedConcerns([]);
    setSelectedGoals([]);
    setSkinType('normal');
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        {step < 4 && (
          <div className="text-center space-y-6 mb-16">
            <Badge className="bg-primary/5 text-primary border-primary/20 font-body uppercase tracking-[0.4em] px-8 py-2 text-[10px] rounded-full mb-4">
              {t.advisor.badge}
            </Badge>
            <h1 className="font-headline text-6xl md:text-8xl tracking-tighter leading-none">
              {t.advisor.title} <br />
              <span className="italic font-light">{t.advisor.titleAccent}</span>
            </h1>
            <p className="text-muted-foreground font-body text-xs uppercase tracking-[0.2em] font-medium max-w-lg mx-auto leading-relaxed">
              {t.advisor.intro}
            </p>

            <div
              className="flex justify-center gap-4 pt-10"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={TOTAL_STEPS}
              aria-valuenow={step}
              aria-label={`${t.advisor.stepLabel} ${step} ${t.advisor.stepOf} ${TOTAL_STEPS}`}
            >
              {[1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={cn(
                    'h-1 rounded-full transition-all duration-500',
                    step >= i ? 'w-16 bg-primary' : 'w-8 bg-primary/10',
                  )}
                />
              ))}
            </div>
          </div>
        )}

        <div
          className={cn(
            'glass p-8 md:p-20 rounded-[4rem] shadow-2xl shadow-primary/5 min-h-[500px] flex flex-col transition-all duration-700',
            step === 4 && 'p-8 md:p-12',
          )}
        >
          {/* STEP 1 — skin type */}
          {step === 1 && (
            <div className="space-y-12">
              <fieldset className="space-y-8 text-center">
                <legend className="font-headline text-3xl tracking-tight w-full">
                  {t.advisor.skinType}
                </legend>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 pt-6">
                  {SKIN_TYPES.map((type) => (
                    <label key={type} className="relative group cursor-pointer">
                      <input
                        type="radio"
                        name="skin-type"
                        value={type}
                        checked={skinType === type}
                        onChange={() => setSkinType(type)}
                        className="sr-only peer"
                      />
                      <span
                        className={cn(
                          'w-full block text-center py-6 px-4 rounded-[2rem] border transition-all font-body uppercase tracking-[0.3em] text-[10px] font-bold peer-focus-visible:ring-2 peer-focus-visible:ring-ring',
                          skinType === type
                            ? 'bg-primary border-primary text-white shadow-xl scale-105'
                            : 'bg-white/50 border-primary/10 hover:border-primary/40 text-foreground/70',
                        )}
                      >
                        {t.advisor.skinTypeOptions[type]}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <Button
                className="w-full h-20 rounded-full font-body uppercase tracking-[0.4em] text-[10px] font-bold bg-primary hover:bg-primary/90 mt-12 shadow-2xl flex gap-3"
                onClick={() => setStep(2)}
              >
                {t.advisor.next} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          )}

          {/* STEP 2 — concerns */}
          {step === 2 && (
            <div className="space-y-12">
              <fieldset className="space-y-8 text-center">
                <legend className="font-headline text-3xl tracking-tight w-full">
                  {t.advisor.concern}
                </legend>
                <p className="font-body text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">
                  {t.advisor.concernHint}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6">
                  {CONCERNS.map((concern) => (
                    <label
                      key={concern}
                      className={cn(
                        'flex items-center gap-4 p-6 rounded-[2rem] border cursor-pointer transition-all font-body uppercase tracking-[0.2em] text-[10px] font-bold',
                        selectedConcerns.includes(concern)
                          ? 'bg-primary/10 border-primary text-primary shadow-lg'
                          : 'bg-white/50 border-primary/5 hover:border-primary/20 text-foreground/70',
                      )}
                    >
                      <Checkbox
                        checked={selectedConcerns.includes(concern)}
                        onCheckedChange={() =>
                          setSelectedConcerns((current) => toggle(current, concern))
                        }
                        className="border-primary data-[state=checked]:bg-primary"
                      />
                      <span>{t.advisor.concernOptions[concern]}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              {selectedConcerns.length === 0 && (
                <p className="text-center text-xs text-muted-foreground italic">
                  {t.advisor.selectAtLeastOne}
                </p>
              )}
              <div className="flex gap-6 pt-6">
                <Button
                  variant="ghost"
                  className="flex-1 h-20 rounded-full font-body uppercase tracking-[0.4em] text-[10px] font-bold flex gap-3"
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {t.advisor.previous}
                </Button>
                <Button
                  className="flex-[2] h-20 rounded-full font-body uppercase tracking-[0.4em] text-[10px] font-bold bg-primary hover:bg-primary/90 shadow-2xl flex gap-3"
                  onClick={() => setStep(3)}
                  disabled={selectedConcerns.length === 0}
                >
                  {t.advisor.next} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3 — goals */}
          {step === 3 && (
            <div className="space-y-12">
              <fieldset className="space-y-8 text-center">
                <legend className="font-headline text-3xl tracking-tight w-full">
                  {t.advisor.goals}
                </legend>
                <p className="font-body text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">
                  {t.advisor.goalHint}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6">
                  {GOAL_KEYS.map((goal) => (
                    <label
                      key={goal}
                      className={cn(
                        'flex items-center gap-4 p-6 rounded-[2rem] border cursor-pointer transition-all font-body uppercase tracking-[0.2em] text-[10px] font-bold',
                        selectedGoals.includes(goal)
                          ? 'bg-primary/10 border-primary text-primary shadow-lg'
                          : 'bg-white/50 border-primary/5 hover:border-primary/20 text-foreground/70',
                      )}
                    >
                      <Checkbox
                        checked={selectedGoals.includes(goal)}
                        onCheckedChange={() => setSelectedGoals((current) => toggle(current, goal))}
                        className="border-primary data-[state=checked]:bg-primary"
                      />
                      <span>{t.advisor.goalOptions[goal]}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-4 p-6 rounded-[2rem] border border-destructive/30 bg-destructive/5 text-left"
                >
                  <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="space-y-1">
                    <p className="font-headline text-sm uppercase tracking-widest">{t.advisor.error}</p>
                    <p className="text-xs text-muted-foreground">{t.advisor.errorDesc}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-6 pt-6">
                <Button
                  variant="ghost"
                  className="flex-1 h-20 rounded-full font-body uppercase tracking-[0.4em] text-[10px] font-bold flex gap-3"
                  onClick={() => setStep(2)}
                  disabled={isAnalyzing}
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {t.advisor.previous}
                </Button>
                <Button
                  className="flex-[2] h-20 rounded-full font-body uppercase tracking-[0.4em] text-[10px] font-bold bg-primary hover:bg-primary/90 shadow-2xl flex gap-3"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      {t.advisor.analyzing}
                    </>
                  ) : (
                    <>
                      {error ? t.advisor.retry : t.advisor.analyze}
                      <Sparkles className="h-4 w-4" aria-hidden="true" />
                    </>
                  )}
                </Button>
              </div>
              <p aria-live="polite" className="sr-only">
                {isAnalyzing ? t.advisor.analyzingDesc : ''}
              </p>
            </div>
          )}

          {/* STEP 4 — results */}
          {step === 4 && result && (
            <div className="space-y-10">
              <div className="text-center space-y-4">
                <Badge className="bg-primary/5 text-primary border-primary/20 font-body uppercase tracking-[0.4em] px-8 py-2 text-[10px] rounded-full">
                  {t.advisor.resultsBadge}
                </Badge>
                <h1 className="font-headline text-4xl md:text-5xl tracking-tighter">
                  {t.advisor.yourRitual}
                </h1>
                <p className="text-muted-foreground italic max-w-xl mx-auto leading-relaxed">
                  {result.intro}
                </p>
              </div>

              <ul className="space-y-8 list-none">
                {result.recommendations.map((recommendation, index) => (
                  <li
                    key={recommendation.productId}
                    className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-6 bg-white dark:bg-black/20 border border-primary/10 rounded-[2.5rem] p-6"
                  >
                    <Link
                      href={recommendation.href}
                      className="relative aspect-[4/5] rounded-[2rem] overflow-hidden block"
                    >
                      <Image
                        src={recommendation.image}
                        alt={recommendation.imageAlt}
                        fill
                        sizes="180px"
                        className="object-cover"
                      />
                      <span className="absolute top-3 left-3 h-7 w-7 rounded-full bg-primary text-white font-headline text-xs flex items-center justify-center">
                        {index + 1}
                      </span>
                    </Link>

                    <div className="flex flex-col gap-4 min-w-0">
                      <div className="space-y-1">
                        <h2 className="font-headline text-2xl tracking-tight">
                          <Link href={recommendation.href} className="hover:text-primary transition-colors">
                            {recommendation.name}
                          </Link>
                        </h2>
                        <p className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground">
                          {formatCurrency(recommendation.price, locale)}
                        </p>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary mb-1">
                            {t.advisor.whyThis}
                          </p>
                          <p className="text-muted-foreground leading-relaxed">{recommendation.reason}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary mb-1">
                            {t.advisor.howToUse}
                          </p>
                          <p className="text-muted-foreground leading-relaxed italic">
                            {recommendation.usageAdvice}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-auto pt-2">
                        <Button
                          onClick={() => handleAddToBag(recommendation.productId)}
                          disabled={!recommendation.inStock}
                          className="rounded-full bg-primary hover:bg-primary/90 uppercase tracking-[0.2em] text-[10px] font-bold h-11 px-6 gap-2"
                        >
                          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                          {recommendation.inStock ? t.product.addToBag : t.product.outOfStock}
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          className="rounded-full border-primary/20 uppercase tracking-[0.2em] text-[10px] font-bold h-11 px-6"
                        >
                          <Link href={recommendation.href}>{t.advisor.viewProduct}</Link>
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col items-center gap-4 pt-4 border-t border-primary/10">
                <p className="text-[10px] text-muted-foreground italic text-center max-w-md">
                  {t.advisor.disclaimer}
                </p>
                <Button
                  variant="ghost"
                  onClick={restart}
                  className="rounded-full uppercase tracking-[0.3em] text-[10px] font-bold gap-3"
                >
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  {t.advisor.restart}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
