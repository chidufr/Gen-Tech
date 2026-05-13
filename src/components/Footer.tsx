'use client';

import Link from 'next/link';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Logo from '@/components/Logo';
import { useSettings } from '@/contexts/SettingsContext';

export default function Footer() {
  const { settings, categories } = useSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Logo */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#111] rounded-lg flex items-center justify-center overflow-hidden">
                <Logo width={36} height={36} />
              </div>
              <span className="text-white text-2xl font-bold lowercase">gen-tech</span>
            </Link>
            <p className="text-muted-foreground">Powering Kenya with Smart Electronics</p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-muted-foreground hover:text-white transition">Home</Link></li>
              <li><Link href="/category/smartphones" className="text-muted-foreground hover:text-white transition">Shop</Link></li>
              <li><Link href="/#hot-deals" className="text-muted-foreground hover:text-white transition">Hot Deals</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-white transition">About</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.filter(c => c.is_enabled).slice(0, 5).map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/category/${cat.slug}`} className="text-muted-foreground hover:text-white transition">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              {settings?.phone && (
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${settings.phone}`} className="hover:text-white transition">{settings.phone}</a>
                </li>
              )}
              {settings?.email && (
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${settings.email}`} className="hover:text-white transition">{settings.email}</a>
                </li>
              )}
              {settings?.address && (
                <li className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{settings.address}</span>
                </li>
              )}
              {settings?.business_hours && (
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{settings.business_hours}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground">
          <p>© {currentYear} Gen-Tech Kenya. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
