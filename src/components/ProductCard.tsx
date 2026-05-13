'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Phone, MessageCircle } from 'lucide-react';
import { formatPrice } from '@/lib/supabase';
import { useSettings } from '@/contexts/SettingsContext';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    original_price?: number | null;
    description?: string;
    images?: string[];
    is_hot_deal?: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { settings } = useSettings();
  const whatsapp = settings?.whatsapp || '0713017179';
  const phone = settings?.phone || '0713017179';

  const whatsappMessage = `Hi! I'm interested in ${product.name} (SKU: ${product.id})`;
  const cleanWhatsApp = whatsapp.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(whatsappMessage)}`;
  const callUrl = `tel:${phone.replace(/[^0-9]/g, '')}`;

  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;

  return (
    <div className="bg-[#111] border border-primary/30 rounded-lg overflow-hidden hover:border-primary transition-all duration-300">
      {/* Image - Clickable area for product details */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-[#0a0a0a]">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <span>No Image</span>
          </div>
        )}
        {product.is_hot_deal && discount > 0 && (
          <div className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Product name - also clickable */}
        <Link href={`/product/${product.slug}`} className="block">
          <h3 className="text-white font-semibold mb-1 line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        
        {/* SKU/Product Code */}
        <p className="text-xs text-muted-foreground mb-2">SKU: {product.id}</p>
        
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-primary font-bold text-lg">{formatPrice(product.price)}</span>
          {product.original_price && (
            <span className="text-muted-foreground line-through text-sm">{formatPrice(product.original_price)}</span>
          )}
        </div>
        {product.description && (
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{product.description}</p>
        )}

        {/* CTA Buttons - Mobile Optimized with larger tap targets (min 44x44px) */}
        <div className="flex gap-2">
          <Link
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-primary hover:bg-primary/80 text-white font-semibold py-3 px-3 rounded-lg flex items-center justify-center gap-2 transition min-h-[48px] touch-manipulation active:scale-95"
          >
            <MessageCircle className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Order</span>
          </Link>
          <Link
            href={callUrl}
            className="flex-1 border border-white/30 hover:border-white text-white font-semibold py-3 px-3 rounded-lg flex items-center justify-center gap-2 transition min-h-[48px] touch-manipulation active:scale-95"
          >
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Call</span>
          </Link>
        </div>
      </div>
    </div>
  );
}