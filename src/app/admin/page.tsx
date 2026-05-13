'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, MessageSquare, Eye, TrendingUp, ArrowUpRight, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

interface Stats {
  totalProducts: number;
  hotDeals: number;
  totalEnquiries: number;
  whatsappClicks: number;
  callClicks: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    hotDeals: 0,
    totalEnquiries: 0,
    whatsappClicks: 0,
    callClicks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Mock stats for development
        setStats({
          totalProducts: 15,
          hotDeals: 3,
          totalEnquiries: 47,
          whatsappClicks: 32,
          callClicks: 15,
        });

        // const [productsRes, enquiriesRes] = await Promise.all([
        //   supabase.from('products').select('id, is_hot_deal'),
        //   supabase.from('enquiries').select('enquiry_type'),
        // ]);

        // const products = productsRes.data || [];
        // const enquiries = enquiriesRes.data || [];

        // setStats({
        //   totalProducts: products.length,
        //   hotDeals: products.filter((p: { is_hot_deal: boolean }) => p.is_hot_deal).length,
        //   totalEnquiries: enquiries.length,
        //   whatsappClicks: enquiries.filter((e: { enquiry_type: string }) => e.enquiry_type === 'whatsapp').length,
        //   callClicks: enquiries.filter((e: { enquiry_type: string }) => e.enquiry_type === 'call').length,
        // });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-[#111] rounded w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-[#111] rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to Gen-Tech Admin Panel</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-primary hover:bg-primary/80 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#111] border border-primary/30 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-3xl font-bold text-white">{stats.totalProducts}</h3>
          <p className="text-muted-foreground">Total Products</p>
        </div>

        <div className="bg-[#111] border border-primary/30 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-500" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-3xl font-bold text-white">{stats.hotDeals}</h3>
          <p className="text-muted-foreground">Hot Deals</p>
        </div>

        <div className="bg-[#111] border border-primary/30 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-green-500" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-3xl font-bold text-white">{stats.whatsappClicks}</h3>
          <p className="text-muted-foreground">WhatsApp Orders</p>
        </div>

        <div className="bg-[#111] border border-primary/30 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-500" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-3xl font-bold text-white">{stats.callClicks}</h3>
          <p className="text-muted-foreground">Call Now Clicks</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/admin/products"
          className="bg-[#111] border border-primary/30 rounded-lg p-6 hover:border-primary transition group"
        >
          <Package className="w-8 h-8 text-primary mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition">Manage Products</h3>
          <p className="text-muted-foreground text-sm">Add, edit, or remove products from your store</p>
        </Link>

        <Link
          href="/admin/categories"
          className="bg-[#111] border border-primary/30 rounded-lg p-6 hover:border-primary transition group"
        >
          <TrendingUp className="w-8 h-8 text-primary mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition">Manage Categories</h3>
          <p className="text-muted-foreground text-sm">Organize your product categories</p>
        </Link>

        <Link
          href="/admin/enquiries"
          className="bg-[#111] border border-primary/30 rounded-lg p-6 hover:border-primary transition group"
        >
          <MessageSquare className="w-8 h-8 text-primary mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition">View Enquiries</h3>
          <p className="text-muted-foreground text-sm">Track customer WhatsApp and call inquiries</p>
        </Link>
      </div>

      {/* Settings Card */}
      <div className="bg-gradient-to-r from-primary/20 to-transparent border border-primary/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-2">Important: Configure WhatsApp Number</h3>
        <p className="text-muted-foreground mb-4">
          Make sure to set your WhatsApp number in Settings so customers can contact you properly.
        </p>
        <Link
          href="/admin/settings"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/80 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Go to Settings
        </Link>
      </div>
    </div>
  );
}
