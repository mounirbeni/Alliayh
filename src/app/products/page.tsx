"use client";

import { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/products/ProductCard';
import { Product } from '@/app/lib/products';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Search, Filter, SlidersHorizontal, Loader2, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from '@/components/ui/badge';
import { cn } from "@/lib/utils";

const COMMON_INGREDIENTS = [
  "Vitamin C",
  "Hyaluronic Acid",
  "Peptides",
  "Squalane",
  "Niacinamide"
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortOption, setSortOption] = useState('featured');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.products.getAll();
        setProducts(data);
      } catch (e) {
        console.error("Failed to fetch products:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (categoryFilter !== 'All') {
      result = result.filter(p => p.category === categoryFilter);
    }

    if (minPrice !== '') {
      result = result.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice !== '') {
      result = result.filter(p => p.price <= Number(maxPrice));
    }

    if (selectedIngredients.length > 0) {
      result = result.filter(p => 
        selectedIngredients.every(si => 
          p.ingredients.some(ing => ing.toLowerCase().includes(si.toLowerCase()))
        )
      );
    }

    if (sortOption === 'price-low') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortOption === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, searchQuery, categoryFilter, sortOption, minPrice, maxPrice, selectedIngredients]);

  const categories = ['All', 'Cleansers', 'Serums', 'Moisturizers', 'Masks', 'Toners'];

  const toggleIngredient = (ingredient: string) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredient) 
        ? prev.filter(i => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (minPrice !== '' || maxPrice !== '') count++;
    count += selectedIngredients.length;
    return count;
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setCategoryFilter('All');
    setMinPrice('');
    setMaxPrice('');
    setSelectedIngredients([]);
    setSortOption('featured');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-background">
        <div className="py-12 bg-primary/5 border-b border-primary/10">
          <div className="container mx-auto px-4 text-center space-y-4">
            <h1 className="font-headline text-5xl md:text-6xl tracking-tight">The Collection</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto italic">
              Explore our meticulously crafted formulations designed for every skin journey.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-8">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-12 h-14 bg-white dark:bg-black/20 rounded-full border-primary/20 shadow-sm text-sm focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex overflow-x-auto w-full lg:w-auto items-center gap-4 snap-x pb-2 lg:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="flex items-center gap-2">
                <Tabs defaultValue="All" value={categoryFilter} className="w-auto" onValueChange={setCategoryFilter}>
                  <TabsList className="bg-white dark:bg-black/20 border border-primary/10 rounded-full h-14 px-2 shadow-sm">
                    {categories.map(cat => (
                      <TabsTrigger key={cat} value={cat} className="rounded-full px-4 sm:px-6 h-10 data-[state=active]:bg-primary data-[state=active]:text-white font-headline uppercase tracking-widest text-[10px] sm:text-xs">
                        {cat}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>

          {/* Advanced Filters Bar */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-12 p-6 bg-white dark:bg-black/20 border border-primary/10 rounded-[2rem] shadow-sm overflow-hidden w-full">
             
             <div className="flex overflow-x-auto w-full snap-x pb-2 lg:pb-0 lg:flex-wrap items-center gap-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
               {/* Advanced Filter Popover */}
               <Popover>
                 <PopoverTrigger asChild>
                   <Button variant="outline" className="h-12 rounded-full border-primary/20 hover:border-primary px-6 flex gap-2 uppercase tracking-widest text-xs font-bold">
                     <Filter className="h-4 w-4" /> Filters
                     {getActiveFiltersCount() > 0 && (
                       <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center border-none">
                         {getActiveFiltersCount()}
                       </Badge>
                     )}
                   </Button>
                 </PopoverTrigger>
                 <PopoverContent className="w-80 p-6 rounded-[2rem] border-primary/10 shadow-xl" align="start">
                   <div className="space-y-6">
                     <h4 className="font-headline uppercase tracking-widest text-sm border-b border-primary/10 pb-2">Filter Options</h4>
                     
                     {/* Price Range */}
                     <div className="space-y-4">
                       <h5 className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Price Range</h5>
                       <div className="flex items-center gap-4">
                         <div className="relative flex-1">
                           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                           <Input 
                             type="number" 
                             placeholder="Min" 
                             className="pl-6 h-10 rounded-xl"
                             value={minPrice}
                             onChange={(e) => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
                           />
                         </div>
                         <span className="text-muted-foreground">-</span>
                         <div className="relative flex-1">
                           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                           <Input 
                             type="number" 
                             placeholder="Max" 
                             className="pl-6 h-10 rounded-xl"
                             value={maxPrice}
                             onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                           />
                         </div>
                       </div>
                     </div>

                     {/* Key Ingredients */}
                     <div className="space-y-4">
                       <h5 className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Key Ingredients</h5>
                       <div className="space-y-3">
                         {COMMON_INGREDIENTS.map((ingredient) => (
                           <div key={ingredient} className="flex items-center space-x-3 cursor-pointer group" onClick={() => toggleIngredient(ingredient)}>
                             <div className={cn(
                               "w-4 h-4 rounded-sm border flex items-center justify-center transition-colors",
                               selectedIngredients.includes(ingredient) ? "bg-primary border-primary" : "border-primary/30 group-hover:border-primary"
                             )}>
                               {selectedIngredients.includes(ingredient) && <X className="h-3 w-3 text-white" />}
                             </div>
                             <label className="text-sm cursor-pointer">{ingredient}</label>
                           </div>
                         ))}
                       </div>
                     </div>
                     
                     {getActiveFiltersCount() > 0 && (
                       <Button variant="ghost" onClick={clearAllFilters} className="w-full text-xs uppercase tracking-widest mt-2 hover:bg-destructive/10 hover:text-destructive">
                         Reset Filters
                       </Button>
                     )}
                   </div>
                 </PopoverContent>
               </Popover>

               {/* Active Filter Badges */}
               {selectedIngredients.map(ing => (
                 <Badge key={ing} variant="secondary" className="h-10 px-4 rounded-full flex gap-2 items-center text-xs uppercase tracking-widest font-normal bg-primary/5 hover:bg-primary/10 border-none cursor-pointer" onClick={() => toggleIngredient(ing)}>
                   {ing} <X className="h-3 w-3 text-muted-foreground" />
                 </Badge>
               ))}
               {(minPrice !== '' || maxPrice !== '') && (
                 <Badge variant="secondary" className="h-10 px-4 rounded-full flex gap-2 items-center text-xs uppercase tracking-widest font-normal bg-primary/5 hover:bg-primary/10 border-none cursor-pointer" onClick={() => {setMinPrice(''); setMaxPrice('');}}>
                   ${minPrice || '0'} - ${maxPrice || 'Any'} <X className="h-3 w-3 text-muted-foreground" />
                 </Badge>
               )}
             </div>

             <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest font-headline text-muted-foreground hidden sm:inline-block">Sort By</span>
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-[200px] h-12 rounded-full bg-white dark:bg-black/20 border-primary/20 shadow-sm uppercase tracking-widest text-[10px] font-bold">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="featured" className="text-xs uppercase tracking-widest p-3">Featured</SelectItem>
                    <SelectItem value="price-low" className="text-xs uppercase tracking-widest p-3">Price: Low to High</SelectItem>
                    <SelectItem value="price-high" className="text-xs uppercase tracking-widest p-3">Price: High to Low</SelectItem>
                    <SelectItem value="rating" className="text-xs uppercase tracking-widest p-3">Top Rated</SelectItem>
                  </SelectContent>
                </Select>
             </div>
          </div>

          {/* Results Info */}
          <div className="mb-8 flex justify-between items-center px-2">
            <p className="text-sm text-muted-foreground italic">
              Showing {filteredProducts.length} results
            </p>
            {categoryFilter !== 'All' && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs uppercase tracking-widest text-primary font-bold"
                onClick={() => setCategoryFilter('All')}
              >
                Clear Category
              </Button>
            )}
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="py-32 flex justify-center">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-32 text-center space-y-4">
              <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto opacity-50">
                <SlidersHorizontal className="h-8 w-8" />
              </div>
              <h3 className="font-headline text-2xl">No products found</h3>
              <p className="text-muted-foreground italic max-w-md mx-auto">We couldn't find any rituals matching your precise specifications. Try adjusting your filters or price range.</p>
              <Button variant="outline" className="rounded-full mt-4 uppercase tracking-widest text-xs h-12 px-8" onClick={clearAllFilters}>
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
