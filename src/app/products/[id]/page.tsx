
"use client";

import { use, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PRODUCTS } from '@/app/lib/products';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, ShoppingBag, Heart, Shield, Sparkles, Droplets, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = PRODUCTS.find(p => p.id === id);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-headline mb-4">Product Not Found</h1>
        <Link href="/products">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const placeholder = PlaceHolderImages.find(img => img.id === product.image);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-12 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Product Images */}
            <div className="space-y-6">
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-white shadow-lg">
                <Image
                  src={placeholder?.imageUrl || "https://picsum.photos/1200/1500"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                <Badge className="absolute top-6 left-6 bg-white/90 text-foreground border-none font-headline px-4 py-1 uppercase tracking-widest">{product.category}</Badge>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-border cursor-pointer hover:border-primary transition-colors">
                    <Image src={`https://picsum.photos/seed/thumb${i}${id}/300/300`} alt="Thumbnail" fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-headline text-sm uppercase tracking-[0.2em]">
                  <Sparkles className="h-4 w-4" />
                  Premium Skincare
                </div>
                <h1 className="font-headline text-5xl md:text-6xl tracking-tight leading-tight">{product.name}</h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} className={`h-4 w-4 ${i <= Math.floor(product.rating) ? 'fill-primary text-primary' : 'text-muted'}`} />
                    ))}
                    <span className="ml-2 font-headline uppercase tracking-widest text-xs">{product.rating} / 5.0</span>
                  </div>
                  <span className="text-muted-foreground text-xs uppercase tracking-widest">({product.reviewsCount} Reviews)</span>
                </div>
                <div className="text-3xl font-headline text-primary-foreground">${product.price}.00</div>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed italic">
                {product.description}
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-full p-1 bg-white">
                    <button 
                      className="w-10 h-10 flex items-center justify-center text-xl font-bold rounded-full hover:bg-muted"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >-</button>
                    <span className="w-12 text-center font-headline text-lg">{quantity}</span>
                    <button 
                      className="w-10 h-10 flex items-center justify-center text-xl font-bold rounded-full hover:bg-muted"
                      onClick={() => setQuantity(quantity + 1)}
                    >+</button>
                  </div>
                  <Button size="lg" className="flex-1 h-14 rounded-full bg-primary hover:bg-primary/90 text-sm uppercase tracking-widest font-headline flex gap-3">
                    <ShoppingBag className="h-5 w-5" /> Add to Bag
                  </Button>
                  <Button variant="outline" size="icon" className="h-14 w-14 rounded-full border-primary/20 hover:bg-secondary/20">
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-border flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-xs font-headline uppercase tracking-widest">Cruelty-Free</span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-border flex items-center gap-3">
                  <Droplets className="h-5 w-5 text-primary" />
                  <span className="text-xs font-headline uppercase tracking-widest">Eco-Conscious</span>
                </div>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="ingredients" className="border-border">
                  <AccordionTrigger className="font-headline uppercase tracking-widest text-sm py-4 hover:no-underline hover:text-primary">Key Ingredients</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground italic leading-relaxed pt-2 pb-6">
                    <ul className="grid grid-cols-2 gap-x-8 gap-y-2">
                      {product.ingredients.map((ing, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <div className="h-1 w-1 bg-primary rounded-full" />
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="usage" className="border-border">
                  <AccordionTrigger className="font-headline uppercase tracking-widest text-sm py-4 hover:no-underline hover:text-primary">How to Use</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground italic leading-relaxed pt-2 pb-6">
                    {product.usage}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="benefits" className="border-border">
                  <AccordionTrigger className="font-headline uppercase tracking-widest text-sm py-4 hover:no-underline hover:text-primary">The Ritual Benefits</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground italic leading-relaxed pt-2 pb-6">
                    <ul className="space-y-3">
                      {product.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-secondary-foreground mt-0.5 shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Detailed Content Tabs */}
          <div className="mt-32">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none h-14 p-0 space-x-12">
                <TabsTrigger value="details" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-0 font-headline uppercase tracking-widest text-sm h-full">Product Philosophy</TabsTrigger>
                <TabsTrigger value="reviews" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-0 font-headline uppercase tracking-widest text-sm h-full">Customer Glow ({product.reviewsCount})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="py-12 animate-in fade-in duration-700">
                <div className="max-w-4xl space-y-8">
                  <h3 className="font-headline text-3xl italic">The Science of Illumination</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    At Lueur Aura, we believe that true beauty is revealed through health, not covered by cosmetics. This formula was engineered in our Parisian labs to optimize cellular turnover while providing immediate moisture lock. By mimicking the skin's natural lipid structure, we ensure deeper penetration of bio-active ingredients for results you can feel within 48 hours.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                    <div className="space-y-4">
                      <div className="h-1 w-20 bg-primary" />
                      <h4 className="font-headline text-xl uppercase tracking-widest">Skin Harmony</h4>
                      <p className="text-muted-foreground italic">pH balanced at 5.5 to respect the acid mantle, ensuring your skin remains resilient against external stressors.</p>
                    </div>
                    <div className="space-y-4">
                      <div className="h-1 w-20 bg-primary" />
                      <h4 className="font-headline text-xl uppercase tracking-widest">Dermatologist Tested</h4>
                      <p className="text-muted-foreground italic">Hypoallergenic and non-comedogenic. Safe for sensitive types and tested across all global skin tones.</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="py-12 animate-in fade-in duration-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                  <div className="space-y-6">
                    <h3 className="font-headline text-2xl uppercase tracking-widest">Overall Rating</h3>
                    <div className="text-6xl font-headline">{product.rating}</div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} className={`h-5 w-5 ${i <= 4 ? 'fill-primary text-primary' : 'text-muted'}`} />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground font-headline uppercase tracking-widest">Based on {product.reviewsCount} verified purchases</p>
                    <Button className="w-full rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 font-headline tracking-widest uppercase text-xs">Write a Review</Button>
                  </div>
                  
                  <div className="md:col-span-2 space-y-12">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="space-y-4 pb-8 border-b border-border last:border-0">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-headline font-bold">JD</div>
                            <div>
                              <div className="font-headline uppercase tracking-widest text-xs">Jane Doe</div>
                              <div className="flex items-center gap-1 mt-1">
                                {[1, 2, 3, 4, 5].map(j => <Star key={j} className="h-3 w-3 fill-primary text-primary" />)}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground uppercase tracking-widest font-headline italic">Verified Buyer</span>
                        </div>
                        <h4 className="font-headline text-lg italic">The glow is real!</h4>
                        <p className="text-muted-foreground italic leading-relaxed">
                          "I've been using this for two weeks and my skin has never looked more radiant. It's so lightweight yet my skin feels plump all day. Definitely a permanent step in my ritual now."
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function CheckCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
