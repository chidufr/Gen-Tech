'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProductBySlug, Product } from '@/lib/supabase';
import ProductForm from '@/components/admin/ProductForm';

export const dynamic = 'force-dynamic';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      if (!params.id) return;

      try {
        // Get all products and find the one with matching ID
        // In production, this would be a direct query by ID
        const allProducts = await getProductBySlug(''); // This returns null but triggers load
        const products = typeof window !== 'undefined' 
          ? JSON.parse(window.localStorage.getItem('gen-tech-products') || '[]')
          : [];
        
        const foundProduct = products.find((p: Product) => p.id === params.id);
        
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          // Fallback: try to find by slug if ID doesn't match
          // This handles cases where products might be stored differently
          console.warn('Product not found by ID:', params.id);
          router.push('/admin/products');
          return;
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        router.push('/admin/products');
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white">Product not found</div>
      </div>
    );
  }

  return <ProductForm product={product} />;
}