'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar } from 'lucide-react';
import type { Product, Category } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

interface AnalyticsData {
  productClicks: { name: string; clicks: number }[];
  categoryViews: { name: string; views: number }[];
  weeklyData: { week: string; whatsapp: number; calls: number }[];
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      // Mock data for analytics
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'iPhone 15 Pro',
          slug: 'iphone-15-pro',
          category_id: '1',
          price: 1299,
          original_price: 1399,
          description: 'Latest iPhone with Pro camera system',
          specs: { 'Storage': '256GB', 'Color': 'Natural Titanium' },
          images: ['https://example.com/iphone.jpg'],
          whatsapp_message: 'Hi, I\'m interested in the iPhone 15 Pro',
          is_featured: true,
          is_hot_deal: false,
          hot_deal_expires_at: null,
          is_active: true,
          location: 'Nairobi, Kenya',
          click_count: 150,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'MacBook Pro M3',
          slug: 'macbook-pro-m3',
          category_id: '2',
          price: 2499,
          original_price: null,
          description: 'Powerful laptop for professionals',
          specs: { 'Chip': 'M3 Pro', 'Memory': '18GB' },
          images: ['https://example.com/macbook.jpg'],
          whatsapp_message: 'Hi, I\'m interested in the MacBook Pro M3',
          is_featured: true,
          is_hot_deal: true,
          hot_deal_expires_at: null,
          is_active: true,
          location: 'Nairobi, Kenya',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          click_count: 89,
        }
      ];

      const mockCategories: Category[] = [
        { id: '1', name: 'Smartphones', slug: 'smartphones', description: null, icon: null, sort_order: 1, is_enabled: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '2', name: 'Laptops', slug: 'laptops', description: null, icon: null, sort_order: 2, is_enabled: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '3', name: 'Audio', slug: 'audio', description: null, icon: null, sort_order: 3, is_enabled: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '4', name: 'Accessories', slug: 'accessories', description: null, icon: null, sort_order: 4, is_enabled: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '5', name: 'Home Appliances', slug: 'home-appliances', description: null, icon: null, sort_order: 5, is_enabled: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      ];

      // const [productsRes, categoriesRes] = await Promise.all([
      //   supabase.from('products').select('*').order('click_count', { ascending: false }).limit(10),
      //   supabase.from('categories').select('*'),
      // ]);

      setProducts(mockProducts);
      setCategories(mockCategories);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-[#111] rounded w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-[#111] rounded-lg"></div>
          <div className="h-64 bg-[#111] rounded-lg"></div>
        </div>
      </div>
    );
  }

  const topProducts = products.filter((p) => p.click_count > 0).slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-muted-foreground mt-1">Track product views and customer engagement</p>
      </div>

      {/* Most Viewed Products */}
      <div className="bg-[#111] border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Top Products by Clicks</h2>
        {topProducts.length > 0 ? (
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center gap-4">
                <span className="text-muted-foreground w-8 text-center">#{index + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium">{product.name}</span>
                    <span className="text-primary font-semibold">{product.click_count} clicks</span>
                  </div>
                  <div className="h-2 bg-[#0a0a0a] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{
                        width: `${Math.min(100, (product.click_count / (topProducts[0]?.click_count || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">No click data available yet</p>
        )}
      </div>

      {/* Categories Overview */}
      <div className="bg-[#111] border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Products by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const productCount = products.filter((p) => p.category_id === category.id).length;
            return (
              <div key={category.id} className="bg-[#0a0a0a] border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{category.name}</span>
                  <span className={`px-2 py-1 rounded text-xs ${category.is_enabled ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    {category.is_enabled ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">{productCount} products</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-primary/20 to-transparent border border-primary/30 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Insights</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Total products: {products.length}</li>
          <li>• Active categories: {categories.filter((c) => c.is_enabled).length}</li>
          <li>• Most viewed product: {topProducts[0]?.name || 'N/A'}</li>
          <li>• Total clicks across all products: {products.reduce((sum, p) => sum + (p.click_count || 0), 0)}</li>
        </ul>
      </div>
    </div>
  );
}
