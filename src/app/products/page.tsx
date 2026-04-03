
"use client";

import { useState, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/products/ProductCard';
import { PRODUCTS } from '@/app/lib/products';
import { Input } from '@/components/ui/input';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortOption, setSortOption] = useState('featured');

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (categoryFilter !== 'All') {
      result = result.filter(p => p.category === categoryFilter);
    }

    if (sortOption === 'price-low') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortOption === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [searchQuery, categoryFilter, sortOption]);

  const categories = ['All', 'Cleansers', 'Serums', 'Moisturizers', 'Masks', 'Toners'];

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
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-12">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-10 h-12 bg-white rounded-full border-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 w-full lg:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest font-headline text-muted-foreground">Category</span>
                <Tabs defaultValue="All" className="w-auto" onValueChange={setCategoryFilter}>
                  <TabsList className="bg-muted/50 rounded-full h-11 px-1">
                    {categories.slice(0, 4).map(cat => (
                      <TabsTrigger key={cat} value={cat} className="rounded-full px-6 data-[state=active]:bg-white">{cat}</TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest font-headline text-muted-foreground">Sort By</span>
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-[180px] h-12 rounded-full bg-white border-primary/20">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="mb-8 flex justify-between items-center">
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
                Clear Filters
              </Button>
            )}
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
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
              <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
              <Button variant="outline" onClick={() => {setSearchQuery(''); setCategoryFilter('All');}}>
                Reset Everything
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
