'use client';

import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useSettings } from '@/contexts/SettingsContext';

interface WhatsAppButtonProps {
  message?: string;
  className?: string;
}

export default function WhatsAppButton({ message = 'Hello! I am interested in your products.', className = '' }: WhatsAppButtonProps) {
  const { settings } = useSettings();
  const phone = settings?.whatsapp || '0713017179';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

  return (
    <Link
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        fixed bottom-6 right-6 z-50
        bg-green-500 hover:bg-green-600
        text-white p-4 rounded-full
        shadow-lg hover:shadow-xl
        transition-all duration-300
        hover:scale-110
        ${className}
      `}
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </Link>
  );
}
