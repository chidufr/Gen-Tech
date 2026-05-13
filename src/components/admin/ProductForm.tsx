'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Category, getProducts, saveProducts, Product } from '@/lib/supabase';
import { useSettings } from '@/contexts/SettingsContext';

interface ProductFormData {
  name: string;
  slug: string;
  category_id: string;
  price: string;
  original_price: string;
  description: string;
  specs: { key: string; value: string }[];
  images: string[];
  whatsapp_message: string;
  is_featured: boolean;
  is_hot_deal: boolean;
  is_active: boolean;
  location: string;
}

interface ProductFormProps {
  product?: Product;
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const { categories } = useSettings();
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || '',
    slug: product?.slug || '',
    category_id: product?.category_id || '',
    price: product?.price?.toString() || '',
    original_price: product?.original_price?.toString() || '',
    description: product?.description || '',
    specs: Object.entries(product?.specs || {}).map(([key, value]) => ({ key, value: String(value) })),
    images: product?.images || [],
    whatsapp_message: product?.whatsapp_message || '',
    is_featured: product?.is_featured || false,
    is_hot_deal: product?.is_hot_deal || false,
    is_active: product?.is_active ?? true,
    location: product?.location || 'Nairobi, Kenya',
  });
  const [loading, setLoading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');
  const [imageError, setImageError] = useState('');

  const productCategories = categories.length ? categories : [
    { id: '1', name: 'Smartphones', slug: 'smartphones', description: null, icon: null, sort_order: 1, is_enabled: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '2', name: 'Laptops', slug: 'laptops', description: null, icon: null, sort_order: 2, is_enabled: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '3', name: 'Audio', slug: 'audio', description: null, icon: null, sort_order: 3, is_enabled: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '4', name: 'Accessories', slug: 'accessories', description: null, icon: null, sort_order: 4, is_enabled: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '5', name: 'Home Appliances', slug: 'home-appliances', description: null, icon: null, sort_order: 5, is_enabled: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ];

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function handleNameChange(name: string) {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  }

  function isValidImageUrl(url: string) {
    if (!url.trim()) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  function addImage() {
    const trimmedUrl = newImageUrl.trim();
    if (!trimmedUrl || formData.images.length >= 5) {
      return;
    }

    if (!isValidImageUrl(trimmedUrl)) {
      setImageError('Please enter a valid image URL');
      return;
    }

    setFormData({
      ...formData,
      images: [...formData.images, trimmedUrl],
    });
    setNewImageUrl('');
    setImageError('');
  }

  function handleImageKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addImage();
    }
  }

  function handleImageFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    if (!file) {
      setSelectedImageFile(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file');
      setSelectedImageFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image size must be less than 5MB');
      setSelectedImageFile(null);
      return;
    }

    setSelectedImageFile(file);
    setImageError('');
  }

  function readFileAsDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Unable to read file'));
        }
      };
      reader.onerror = () => reject(new Error('Unable to read file'));
      reader.readAsDataURL(file);
    });
  }

  async function addUploadedImage() {
    if (!selectedImageFile || formData.images.length >= 5) {
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(selectedImageFile);
      setFormData({
        ...formData,
        images: [...formData.images, dataUrl],
      });
      setSelectedImageFile(null);
      setImageError('');
    } catch (error) {
      setImageError('Unable to read the selected image');
    }
  }

  function removeImage(index: number) {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  }

  function addSpec() {
    if (newSpecKey && newSpecValue) {
      setFormData({
        ...formData,
        specs: [...formData.specs, { key: newSpecKey, value: newSpecValue }],
      });
      setNewSpecKey('');
      setNewSpecValue('');
    }
  }

  function removeSpec(index: number) {
    setFormData({
      ...formData,
      specs: formData.specs.filter((_, i) => i !== index),
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const specsObj: Record<string, string> = {};
      formData.specs.forEach(({ key, value }) => {
        specsObj[key] = value;
      });

      const existingProducts = await getProducts();
      const productId = product?.id || Date.now().toString();
      const newProduct: Product = {
        id: productId,
        name: formData.name,
        slug: formData.slug,
        category_id: formData.category_id,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        description: formData.description,
        specs: specsObj,
        images: formData.images,
        whatsapp_message: formData.whatsapp_message || null,
        is_featured: formData.is_featured,
        is_hot_deal: formData.is_hot_deal,
        is_active: formData.is_active,
        location: formData.location,
        click_count: product?.click_count ?? 0,
        hot_deal_expires_at: product?.hot_deal_expires_at ?? null,
        created_at: product?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const updatedProducts = product
        ? existingProducts.map((p) => (p.id === product.id ? newProduct : p))
        : [...existingProducts, newProduct];

      saveProducts(updatedProducts);
      toast.success('Product saved successfully!');
      router.push('/admin/products');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save product';
      console.error('Error saving product:', error);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/products" className="text-muted-foreground hover:text-white flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
      </div>

      <div className="bg-[#111] border border-border rounded-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-6">
          {product ? 'Edit Product' : 'Add New Product'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-medium mb-2">Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-border text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full bg-[#0a0a0a] border border-border text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-medium mb-2">Category</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full bg-[#0a0a0a] border border-border text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="">Select Category</option>
                {productCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-white font-medium mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-[#0a0a0a] border border-border text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-medium mb-2">Price (KES) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-[#0a0a0a] border border-border text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2">Original Price (KES)</label>
              <input
                type="number"
                value={formData.original_price}
                onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                className="w-full bg-[#0a0a0a] border border-border text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full bg-[#0a0a0a] border border-border text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">WhatsApp Message</label>
            <input
              type="text"
              value={formData.whatsapp_message}
              onChange={(e) => setFormData({ ...formData, whatsapp_message: e.target.value })}
              placeholder="Custom WhatsApp message (optional)"
              className="w-full bg-[#0a0a0a] border border-border text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Images ({formData.images.length}/5)</label>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => {
                    setNewImageUrl(e.target.value);
                    if (imageError) setImageError('');
                  }}
                  onKeyDown={handleImageKeyDown}
                  placeholder="Enter image URL"
                  className="w-full bg-[#0a0a0a] border border-border text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={addImage}
                  disabled={!newImageUrl.trim() || formData.images.length >= 5}
                  className="bg-primary hover:bg-primary/80 disabled:bg-primary/50 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add URL
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <label className="block text-white font-medium">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="w-full bg-[#0a0a0a] border border-border text-white px-4 py-2 rounded-lg file:text-primary file:border-0 file:bg-transparent file:cursor-pointer focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={addUploadedImage}
                  disabled={!selectedImageFile || formData.images.length >= 5}
                  className="bg-primary hover:bg-primary/80 disabled:bg-primary/50 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Upload Image
                </button>
                {selectedImageFile && (
                  <p className="text-sm text-muted-foreground">Selected: {selectedImageFile.name}</p>
                )}
              </div>
            </div>
            {imageError && (
              <p className="text-sm text-red-400 mb-2">{imageError}</p>
            )}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-5 gap-2">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img src={img} alt="" className="w-full aspect-square object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Specifications</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newSpecKey}
                onChange={(e) => setNewSpecKey(e.target.value)}
                placeholder="Key (e.g., Storage)"
                className="flex-1 bg-[#0a0a0a] border border-border text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                value={newSpecValue}
                onChange={(e) => setNewSpecValue(e.target.value)}
                placeholder="Value (e.g., 256GB)"
                className="flex-1 bg-[#0a0a0a] border border-border text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={addSpec}
                disabled={!newSpecKey || !newSpecValue}
                className="bg-primary hover:bg-primary/80 disabled:bg-primary/50 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            {formData.specs.length > 0 && (
              <div className="bg-[#0a0a0a] border border-border rounded-lg divide-y divide-border">
                {formData.specs.map((spec, idx) => (
                  <div key={idx} className="flex items-center justify-between px-4 py-2">
                    <div className="flex-1">
                      <span className="text-muted-foreground">{spec.key}:</span>
                      <span className="text-white ml-2">{spec.value}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSpec(idx)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-5 h-5 rounded bg-[#0a0a0a] border-border text-primary focus:ring-primary"
              />
              <span className="text-white">Featured Product</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_hot_deal}
                onChange={(e) => setFormData({ ...formData, is_hot_deal: e.target.checked })}
                className="w-5 h-5 rounded bg-[#0a0a0a] border-border text-primary focus:ring-primary"
              />
              <span className="text-white">Hot Deal</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-5 h-5 rounded bg-[#0a0a0a] border-border text-primary focus:ring-primary"
              />
              <span className="text-white">Active</span>
            </label>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-border">
            <Link
              href="/admin/products"
              className="border border-border text-white px-6 py-2 rounded-lg hover:bg-[#222] transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/80 disabled:bg-primary/50 text-white px-6 py-2 rounded-lg flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
