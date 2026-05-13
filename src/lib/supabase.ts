// Mock data functions to replace Supabase dependencies
// All database operations are now simulated with mock data

export interface Product {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  price: number;
  original_price: number | null;
  description: string;
  specs: Record<string, string>;
  images: string[];
  whatsapp_message: string | null;
  is_featured: boolean;
  is_hot_deal: boolean;
  hot_deal_expires_at: string | null;
  is_active: boolean;
  location: string;
  click_count: number;
  created_at: string;
  updated_at: string;
  categories?: Category;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  is_enabled: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Settings {
  id: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  business_hours: string;
  city?: string;
  street?: string;
  building?: string;
  room_number?: string;
  hero_background_image: string | null;
  created_at: string;
  updated_at: string;
}

export interface Enquiry {
  id: string;
  enquiry_type: 'whatsapp' | 'call';
  product_id: string | null;
  product_name: string | null;
  product_price: number | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Smartphones', slug: 'smartphones', description: 'Latest mobile devices and accessories', icon: 'smartphone', is_enabled: true, sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '2', name: 'Laptops', slug: 'laptops', description: 'High-performance laptops for work and gaming', icon: 'laptop', is_enabled: true, sort_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '3', name: 'Audio', slug: 'audio', description: 'Headphones, speakers, and sound systems', icon: 'headphones', is_enabled: true, sort_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '4', name: 'Accessories', slug: 'accessories', description: 'Chargers, cases, and other electronics essentials', icon: 'mouse', is_enabled: true, sort_order: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '5', name: 'Home Appliances', slug: 'home-appliances', description: 'Kitchen and home electronics for everyday use', icon: 'home', is_enabled: true, sort_order: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '6', name: 'TVs', slug: 'tvs', description: 'Smart TVs and entertainment systems', icon: 'tv', is_enabled: true, sort_order: 6, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const defaultProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    slug: 'iphone-15-pro',
    category_id: '1',
    price: 150000,
    original_price: null,
    description: 'Latest iPhone with advanced features',
    specs: { storage: '256GB', color: 'Black' },
    images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400'],
    whatsapp_message: null,
    is_featured: true,
    is_hot_deal: false,
    hot_deal_expires_at: null,
    is_active: true,
    location: 'Nairobi',
    click_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'MacBook Pro M3',
    slug: 'macbook-pro-m3',
    category_id: '2',
    price: 250000,
    original_price: null,
    description: 'Powerful laptop for professionals',
    specs: { cpu: 'M3', ram: '16GB' },
    images: ['https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400'],
    whatsapp_message: null,
    is_featured: false,
    is_hot_deal: true,
    hot_deal_expires_at: null,
    is_active: true,
    location: 'Nairobi',
    click_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const defaultSettings: Settings = {
  id: '1',
  phone: '0000000000',
  whatsapp: '0000000000',
  email: 'info@gen-tech.co.ke',
  address: 'Nairobi, Kenya',
  business_hours: 'Mon-Sat 8AM-8PM',
  city: 'Nairobi',
  street: 'Tech Street',
  building: 'Tech Plaza',
  room_number: '101',
  hero_background_image: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const PRODUCTS_STORAGE_KEY = 'gen-tech-products';
const CATEGORIES_STORAGE_KEY = 'gen-tech-categories';
const SETTINGS_STORAGE_KEY = 'gen-tech-settings';
const ENQUIRIES_STORAGE_KEY = 'gen-tech-enquiries';

function getStoredItems<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) return fallback;
    return JSON.parse(stored) as T;
  } catch {
    return fallback;
  }
}

function saveStoredItems<T>(key: string, items: T) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(items));
}

export async function getSettings(): Promise<Settings | null> {
  if (typeof window !== 'undefined') {
    return getStoredItems<Settings>(SETTINGS_STORAGE_KEY, defaultSettings);
  }
  return defaultSettings;
}

export async function getCategories(): Promise<Category[]> {
  if (typeof window !== 'undefined') {
    return getStoredItems<Category[]>(CATEGORIES_STORAGE_KEY, defaultCategories);
  }
  return defaultCategories;
}

export async function getProducts(options?: {
  categorySlug?: string;
  isHotDeal?: boolean;
  isFeatured?: boolean;
  limit?: number;
}): Promise<Product[]> {
  // Mock implementation - returns filtered default products or persisted products
  console.log('getProducts called with options:', options);

  const storedProducts = typeof window !== 'undefined'
    ? getStoredItems<Product[]>(PRODUCTS_STORAGE_KEY, defaultProducts)
    : defaultProducts;

  let products = [...storedProducts];

  if (options?.categorySlug) {
    const category = defaultCategories.find(cat => cat.slug === options.categorySlug);
    if (category) {
      products = products.filter(p => p.category_id === category.id);
    }
  }

  if (options?.isHotDeal) {
    products = products.filter(p => p.is_hot_deal);
  }

  if (options?.isFeatured) {
    products = products.filter(p => p.is_featured);
  }

  if (options?.limit) {
    products = products.slice(0, options.limit);
  }

  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  // Mock implementation - finds product by slug
  console.log('getProductBySlug called with slug:', slug);
  const products = typeof window !== 'undefined'
    ? getStoredItems<Product[]>(PRODUCTS_STORAGE_KEY, defaultProducts)
    : defaultProducts;

  const product = products.find(p => p.slug === slug);
  return product || null;
}

export function saveProducts(products: Product[]) {
  saveStoredItems<Product[]>(PRODUCTS_STORAGE_KEY, products);
}

export function saveCategories(categories: Category[]) {
  saveStoredItems<Category[]>(CATEGORIES_STORAGE_KEY, categories);
}

export function saveSettings(settings: Settings) {
  saveStoredItems<Settings>(SETTINGS_STORAGE_KEY, settings);
}

export async function getEnquiries(): Promise<Enquiry[]> {
  if (typeof window !== 'undefined') {
    return getStoredItems<Enquiry[]>(ENQUIRIES_STORAGE_KEY, []);
  }
  return [];
}

export function saveEnquiries(enquiries: Enquiry[]) {
  saveStoredItems<Enquiry[]>(ENQUIRIES_STORAGE_KEY, enquiries);
}

// Mock Supabase client for compatibility
export const supabase = {
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        single: () => Promise.resolve({ data: null, error: null }),
        order: (column: string, options?: any) => ({
          limit: (count: number) => Promise.resolve({ data: [], error: null }),
        }),
      }),
      order: (column: string, options?: any) => ({
        limit: (count: number) => Promise.resolve({ data: [], error: null }),
        eq: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
      }),
      single: () => Promise.resolve({ data: null, error: null }),
    }),
    insert: (data: any) => ({
      select: () => ({
        single: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
    }),
    delete: () => ({
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
    }),
  }),
};

export const supabaseAdmin = supabase;

// Simple lock to prevent race conditions in logEnquiry
let enquiriesLock = false;

export async function logEnquiry(
  type: 'whatsapp' | 'call',
  productId?: string,
  productName?: string,
  productPrice?: number
): Promise<void> {
  // Simple lock to prevent race conditions
  while (enquiriesLock) {
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  
  try {
    enquiriesLock = true;
    
    const currentEnquiries = await getEnquiries();
    const newEnquiry: Enquiry = {
      id: crypto.randomUUID(), // Use crypto.randomUUID() instead of Date.now()
      enquiry_type: type,
      product_id: productId ?? null,
      product_name: productName ?? null,
      product_price: productPrice ?? null,
      metadata: { source: 'website', created_at: new Date().toISOString() },
      created_at: new Date().toISOString(),
    };
    
    saveEnquiries([newEnquiry, ...currentEnquiries]);
  } finally {
    enquiriesLock = false;
  }
}

export function formatWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

export function formatCallUrl(phone: string): string {
  return `tel:${phone.replace(/[^0-9]/g, '')}`;
}

export function formatPrice(price: number): string {
  return `KES ${price.toLocaleString('en-KE')}`;
}
