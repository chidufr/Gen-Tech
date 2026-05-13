import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://gen-tech.co.ke';

  // Mock data for sitemap generation
  const mockProducts = [
    { slug: 'iphone-15-pro', updated_at: new Date().toISOString() },
    { slug: 'macbook-pro-m3', updated_at: new Date().toISOString() },
  ];

  const mockCategories = [
    { slug: 'smartphones', updated_at: new Date().toISOString() },
    { slug: 'laptops', updated_at: new Date().toISOString() },
    { slug: 'audio', updated_at: new Date().toISOString() },
    { slug: 'accessories', updated_at: new Date().toISOString() },
    { slug: 'home-appliances', updated_at: new Date().toISOString() },
  ];

  // Get all products
  // const { data: products } = await supabase.from('products').select('slug, updated_at').eq('is_active', true);
  // const { data: categories } = await supabase.from('categories').select('slug, updated_at').eq('is_enabled', true);

  const productUrls = mockProducts.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date(product.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const categoryUrls = mockCategories.map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: new Date(category.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...categoryUrls,
    ...productUrls,
  ];
}
