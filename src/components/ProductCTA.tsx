'use client';

import Link from 'next/link';
import { Phone, MessageCircle } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

interface ProductCTAProps {
  productName: string;
  productPrice: number;
}

export default function ProductCTA({ productName, productPrice }: ProductCTAProps) {
  const { settings } = useSettings();
  
  const whatsapp = settings?.whatsapp || '0713017179';
  const phone = settings?.phone || '0713017179';

  const whatsappMessage = `Hi! I'm interested in ${productName} (SKU: ${productName})`;
  const cleanWhatsApp = whatsapp.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(whatsappMessage)}`;
  const callUrl = `tel:${phone.replace(/[^0-9]/g, '')}`;

  return (
    <div className="flex flex-col sm:flex-row gap-4 sticky bottom-20 bg-[#0a0a0a] py-4 border-t border-border">
      <Link
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 bg-primary hover:bg-primary/80 text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition"
      >
        <MessageCircle className="w-5 h-5" />
        ORDER ON WHATSAPP
      </Link>
      <Link
        href={callUrl}
        className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition"
      >
        <Phone className="w-5 h-5" />
        CALL NOW
      </Link>
    </div>
  );
}
