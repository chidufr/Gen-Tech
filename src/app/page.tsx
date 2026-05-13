'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Phone, MessageCircle, Truck, BadgeDollarSign, Shield, Zap } from 'lucide-react';
import { getProducts, type Product } from '@/lib/supabase';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import { useSettings } from '@/contexts/SettingsContext';

export default function HomePage() {
  const { categories, settings } = useSettings();
  const [hotDeals, setHotDeals] = useState<Product[]>([]);
  const [isLoadingDeals, setIsLoadingDeals] = useState(true);

  useEffect(() => {
    async function fetchHotDeals() {
      setIsLoadingDeals(true);
      const products = await getProducts({ isHotDeal: true, limit: 8 });
      setHotDeals(products);
      setIsLoadingDeals(false);
    }

    fetchHotDeals();
  }, []);

  const whatsapp = settings?.whatsapp || '0713017179';
  const phone = settings?.phone || '0713017179';

  const whatsappUrl = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello! I am interested in your products.')}`;
  const callUrl = `tel:${phone.replace(/[^0-9]/g, '')}`;

  return (
    <div className="flex flex-col">
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={settings?.hero_background_image || 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1920'}
            alt="Electronics"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">Gen-Tech</h1>
            <p className="text-2xl md:text-3xl text-primary italic font-semibold mb-6">
              Powering Kenya with Smart Electronics
            </p>

            <div className="overflow-hidden mb-8 py-4 bg-[#111]/50 rounded-lg border border-primary/30">
              <div className="animate-marquee whitespace-nowrap">
                <span className="text-white text-lg mx-8">Phones</span>
                <span className="text-primary mx-2">•</span>
                <span className="text-white text-lg mx-8">Laptops</span>
                <span className="text-primary mx-2">•</span>
                <span className="text-white text-lg mx-8">Appliances</span>
                <span className="text-primary mx-2">•</span>
                <span className="text-white text-lg mx-8">Accessories</span>
                <span className="text-primary mx-2">•</span>
                <span className="text-white text-lg mx-8">Delivered Across Kenya</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary hover:bg-primary/80 text-white font-semibold py-4 px-8 rounded-lg flex items-center gap-2 transition"
              >
                <MessageCircle className="w-5 h-5" />
                ORDER ON WHATSAPP
              </Link>
              <Link
                href={callUrl}
                className="border-2 border-white hover:bg-white hover:text-black text-white font-semibold py-4 px-8 rounded-lg flex items-center gap-2 transition"
              >
                <Phone className="w-5 h-5" />
                CALL NOW
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      <section id="hot-deals" className="py-20 bg-[#111]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">Hot Deals in Nairobi</h2>
          <p className="text-muted-foreground text-center mb-12">Limited time offers on premium electronics</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto pb-4">
            {isLoadingDeals ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-80 bg-[#111] rounded-lg animate-pulse" />
              ))
            ) : (
              hotDeals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#3d0000]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-white flex items-center justify-center">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-1">Nation-Wide Delivery</h3>
              <p className="text-white/70 text-sm">Delivered across Kenya</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-white flex items-center justify-center">
                <BadgeDollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-1">Affordable Prices</h3>
              <p className="text-white/70 text-sm">Best value in market</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-white flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-1">Genuine Electronics</h3>
              <p className="text-white/70 text-sm">100% authentic products</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-white flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-1">Fast Urban Shipping</h3>
              <p className="text-white/70 text-sm">Quick delivery in cities</p>
            </div>
          </div>
          <p className="text-white text-center mt-8 text-lg">Order today, get fast delivery anywhere in Kenya.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Ready to Order? Chat with Gen-Tech on WhatsApp or Call Us Now.</h2>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary hover:bg-primary/80 text-white font-semibold py-4 px-8 rounded-lg flex items-center gap-2 transition"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Order
            </Link>
            <Link
              href={callUrl}
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold py-4 px-8 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
