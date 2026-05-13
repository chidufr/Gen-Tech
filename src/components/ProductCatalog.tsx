'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock_quantity: number;
  image_url: string | null;
}

const CATEGORIES = ['All', 'Smartphones', 'Laptops', 'Home Appliances'];

const formatPrice = (value: number | string) => {
  const price = typeof value === 'string' ? Number(value) : value;
  if (Number.isNaN(price)) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(price);
};

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from<Product>('products')
        .select('id,name,price,category,stock_quantity,image_url');

      if (fetchError) {
        setError(fetchError.message || 'Failed to load products.');
        setProducts([]);
      } else {
        setProducts(data ?? []);
      }

      setIsLoading(false);
    };

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') return products;
    return products.filter(
      (product) => product.category?.toLowerCase() === selectedCategory.toLowerCase(),
    );
  }, [products, selectedCategory]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-3xl border border-white/10 bg-[#111] p-6 shadow-xl shadow-black/10">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white">Filter by category</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Choose a category to refine the product list.
            </p>
          </div>

          <div className="space-y-3">
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition-all duration-200 ${
                    isActive
                      ? 'border-primary bg-primary/10 text-white shadow-[0_0_0_1px_rgba(148,163,184,0.35)]'
                      : 'border-white/10 bg-[#0c0c0c] text-muted-foreground hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <span className="block text-sm font-medium">{category}</span>
                  {category !== 'All' && (
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {products.filter((product) => product.category === category).length} products
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        <div>
          <div className="mb-8 flex flex-col gap-3 rounded-3xl border border-white/10 bg-[#111] p-6 shadow-xl shadow-black/10 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-primary">Available inventory</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Products</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              {isLoading
                ? 'Loading products…'
                : `${filteredProducts.length} product${filteredProducts.length === 1 ? '' : 's'} found`}
            </p>
          </div>

          {error ? (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-red-100">
              <p className="font-medium">Error loading products</p>
              <p className="mt-2 text-sm">{error}</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {isLoading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="animate-pulse rounded-3xl border border-white/10 bg-[#111] p-6 h-72"
                    />
                  ))
                : filteredProducts.map((product) => (
                    <article
                      key={product.id}
                      className="overflow-hidden rounded-3xl border border-white/10 bg-[#111] shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
                    >
                      <div className="h-48 w-full overflow-hidden bg-slate-950">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-full w-full object-cover transition duration-500 hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                            No image available
                          </div>
                        )}
                      </div>
                      <div className="space-y-4 p-5">
                        <div>
                          <p className="text-xs uppercase tracking-[0.22em] text-primary">{product.category}</p>
                          <h3 className="mt-2 text-xl font-semibold text-white">{product.name}</h3>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="text-lg font-semibold text-white">{formatPrice(product.price)}</p>
                          <span className="rounded-full bg-white/5 px-3 py-1 text-sm text-muted-foreground">
                            {product.stock_quantity} in stock
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
