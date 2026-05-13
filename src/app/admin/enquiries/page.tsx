'use client';

import { useState, useEffect } from 'react';
import { Copy, Download, Trash2, MessageCircle, Phone, Filter } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { getEnquiries, saveEnquiries, Enquiry } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'whatsapp' | 'call'>('all');

  useEffect(() => {
    fetchEnquiries();
  }, []);

  async function fetchEnquiries() {
    try {
      const data = await getEnquiries();
      setEnquiries(data || []);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredEnquiries = enquiries.filter((e) => {
    if (filter === 'all') return true;
    return e.enquiry_type === filter;
  });

  const whatsappCount = enquiries.filter((e) => e.enquiry_type === 'whatsapp').length;
  const callCount = enquiries.filter((e) => e.enquiry_type === 'call').length;

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-[#111] rounded w-48"></div>
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
      <div>
        <h1 className="text-3xl font-bold text-white">Enquiries</h1>
        <p className="text-muted-foreground mt-1">Track customer WhatsApp and Call inquiries</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111] border border-border rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{whatsappCount}</p>
              <p className="text-muted-foreground">WhatsApp Orders</p>
            </div>
          </div>
        </div>

        <div className="bg-[#111] border border-border rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Phone className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{callCount}</p>
              <p className="text-muted-foreground">Call Now Clicks</p>
            </div>
          </div>
        </div>

        <div className="bg-[#111] border border-border rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <Filter className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{enquiries.length}</p>
              <p className="text-muted-foreground">Total Enquiries</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'all' ? 'bg-primary text-white' : 'bg-[#111] text-muted-foreground hover:text-white'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('whatsapp')}
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'whatsapp' ? 'bg-green-500 text-white' : 'bg-[#111] text-muted-foreground hover:text-white'
          }`}
        >
          WhatsApp
        </button>
        <button
          onClick={() => setFilter('call')}
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'call' ? 'bg-blue-500 text-white' : 'bg-[#111] text-muted-foreground hover:text-white'
          }`}
        >
          Call Now
        </button>
      </div>

      {/* Enquiries List */}
      <div className="bg-[#111] border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#0a0a0a]">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Product</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Price</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredEnquiries.map((enquiry) => (
              <tr key={enquiry.id} className="hover:bg-[#0a0a0a] transition">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {enquiry.enquiry_type === 'whatsapp' ? (
                      <>
                        <MessageCircle className="w-5 h-5 text-green-500" />
                        <span className="text-green-500 font-medium">WhatsApp</span>
                      </>
                    ) : (
                      <>
                        <Phone className="w-5 h-5 text-blue-500" />
                        <span className="text-blue-500 font-medium">Call</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-white">{enquiry.product_name || '-'}</span>
                </td>
                <td className="px-4 py-3">
                  {enquiry.product_price ? (
                    <span className="text-primary">KES {enquiry.product_price.toLocaleString('en-KE')}</span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-muted-foreground">
                    {new Date(enquiry.created_at).toLocaleDateString('en-KE', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredEnquiries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No enquiries found</p>
          </div>
        )}
      </div>
    </div>
  );
}
