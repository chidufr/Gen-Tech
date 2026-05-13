'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { Category, getProducts, saveProducts, Product } from '@/lib/supabase';
import { useSettings } from '@/contexts/SettingsContext';
import { formatPrice } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default function ProductsAdminPage() {
  const { categories } = useSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const products = await getProducts();
      setProducts(products);
      setLoading(false);
    }

    fetchData();
  }, []);

  async function toggleProductStatus(product: Product) {
    const updatedProducts = products.map((p) =>
      p.id === product.id ? { ...p, is_active: !p.is_active } : p
    );
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
    toast.success('Product status updated');
  }

  async function deleteProduct(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const updatedProducts = products.filter((p) => p.id !== id);
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
    toast.success('Product deleted successfully');
  }

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !categoryFilter || p.category_id === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-[#111] rounded w-48"></div>
        <div className="h-12 bg-[#111] rounded"></div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-[#111] rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-center" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Products</h1>
          <p className="text-muted-foreground mt-1">{products.length} products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-primary hover:bg-primary/80 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#111] border border-border text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-[#111] border border-border text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-[#111] border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0a0a0a]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Product</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Price</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Flags</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-[#0a0a0a] transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt="" className="w-12 h-12 rounded object-cover" />
                      ) : (
                        <div className="w-12 h-12 bg-[#222] rounded"></div>
                      )}
                      <div>
                        <p className="text-white font-medium">{product.name}</p>
                        <p className="text-muted-foreground text-sm">{product.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-muted-foreground">
                      {categories.find((cat) => cat.id === product.category_id)?.name || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-primary font-medium">{formatPrice(product.price)}</p>
                      {product.original_price && (
                        <p className="text-muted-foreground text-sm line-through">{formatPrice(product.original_price)}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleProductStatus(product)}
                      className={`flex items-center gap-1 ${product.is_active ? 'text-green-500' : 'text-red-500'}`}
                    >
                      {product.is_active ? (
                        <ToggleRight className="w-5 h-5" />
                      ) : (
                        <ToggleLeft className="w-5 h-5" />
                      )}
                      <span className="text-sm">{product.is_active ? 'Active' : 'Inactive'}</span>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {product.is_hot_deal && (
                        <span className="bg-orange-500/20 text-orange-500 text-xs px-2 py-1 rounded">HOT</span>
                      )}
                      {product.is_featured && (
                        <span className="bg-blue-500/20 text-blue-500 text-xs px-2 py-1 rounded">FEATURED</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/product/${product.slug}`}
                        target="_blank"
                        className="text-muted-foreground hover:text-white transition"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/products/edit/${product.id}`}
                        className="text-muted-foreground hover:text-white transition"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-muted-foreground hover:text-red-500 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}
