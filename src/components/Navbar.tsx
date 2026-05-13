'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ShoppingBag, User, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '@/components/Logo';
import { useSettings } from '@/contexts/SettingsContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const { categories } = useSettings();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black h-[70px] flex items-center">
      <div className="container mx-auto px-4 flex items-center justify-between h-full">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#111] rounded-lg flex items-center justify-center overflow-hidden">
            <Logo width={36} height={36} />
          </div>
          <span className="text-white text-2xl font-bold lowercase tracking-tight">gen-tech</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-white hover:text-primary transition">
            Home
          </Link>
          <div className="relative" onMouseEnter={() => setShopOpen(true)} onMouseLeave={() => setShopOpen(false)}>
            <button className="text-white hover:text-primary transition flex items-center gap-1">
              Shop <ChevronDown className="w-4 h-4" />
            </button>
            {shopOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-xl py-2">
                {categories.filter(c => c.is_enabled).map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    className="block px-4 py-2 text-muted-foreground hover:text-white hover:bg-secondary transition"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link href="/#hot-deals" className="text-white hover:text-primary transition">
            Hot Deals
          </Link>
          <Link href="/about" className="text-white hover:text-primary transition">
            About
          </Link>
          <Link href="/contact" className="text-white hover:text-primary transition">
            Contact
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-white hover:text-primary transition">
            <User className="w-5 h-5" />
          </Link>
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'absolute top-[70px] left-0 right-0 bg-black border-t border-border transition-all duration-300',
          isOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'
        )}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
          <Link href="/" className="text-white hover:text-primary transition py-2" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <div>
            <button
              className="text-white hover:text-primary transition py-2 flex items-center gap-1 w-full"
              onClick={() => setShopOpen(!shopOpen)}
            >
              Shop <ChevronDown className={cn('w-4 h-4 transition', shopOpen && 'rotate-180')} />
            </button>
            {shopOpen && (
              <div className="pl-4 mt-2 flex flex-col gap-2">
                {categories.filter(c => c.is_enabled).map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    className="text-muted-foreground hover:text-white transition py-1"
                    onClick={() => setIsOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link href="/#hot-deals" className="text-white hover:text-primary transition py-2" onClick={() => setIsOpen(false)}>
            Hot Deals
          </Link>
          <Link href="/about" className="text-white hover:text-primary transition py-2" onClick={() => setIsOpen(false)}>
            About
          </Link>
          <Link href="/contact" className="text-white hover:text-primary transition py-2" onClick={() => setIsOpen(false)}>
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
