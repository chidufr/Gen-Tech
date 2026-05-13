import { Metadata } from 'next';
import { MapPin, Phone, Mail, Clock, Truck, Shield, BadgeDollarSign, Zap } from 'lucide-react';
import Link from 'next/link';
import { getSettings } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'About Us | Gen-Tech Kenya',
  description: 'Learn about Gen-Tech Kenya - your trusted electronics retailer. Discover our story, mission, and commitment to delivering quality electronics across Kenya.',
};

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <section className="relative py-20 bg-[#111]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About Gen-Tech</h1>
            <p className="text-primary italic text-xl font-semibold mb-6">Powering Kenya with Smart Electronics</p>
            <p className="text-muted-foreground text-lg">
              Your trusted partner for premium electronics across Kenya.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                Gen-Tech Kenya was founded with a simple mission: to make quality electronics accessible to everyone across Kenya. Starting from Nairobi, we have grown to serve customers in all 47 counties.
              </p>
              <p className="text-muted-foreground mb-4">
                We believe that technology should empower, not complicate. That's why we carefully select each product in our inventory, ensuring you get genuine electronics at fair prices.
              </p>
              <p className="text-muted-foreground">
                From the latest smartphones to home appliances, we are committed to bringing the best of tech to Kenyan homes and businesses.
              </p>
            </div>
            <div className="bg-[#111] border border-primary/30 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-white mb-6">Why Choose Us?</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-white font-medium">100% Genuine Products</span>
                    <p className="text-muted-foreground text-sm">All products are authentic with official warranties</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <BadgeDollarSign className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-white font-medium">Best Prices Guaranteed</span>
                    <p className="text-muted-foreground text-sm">Competitive pricing with regular deals and offers</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Truck className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-white font-medium">Nationwide Delivery</span>
                    <p className="text-muted-foreground text-sm">Fast shipping to all corners of Kenya</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-white font-medium">Fast Urban Shipping</span>
                    <p className="text-muted-foreground text-sm">Same-day delivery available in major cities</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Coverage */}
      <section className="py-20 bg-[#111]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Delivery Coverage</h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#0a0a0a] border border-primary/30 rounded-lg p-8 mb-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <h3 className="text-primary font-bold text-4xl mb-2">47</h3>
                  <p className="text-white font-semibold">Counties</p>
                  <p className="text-muted-foreground text-sm">Full Coverage</p>
                </div>
                <div className="text-center">
                  <h3 className="text-primary font-bold text-4xl mb-2">24-72h</h3>
                  <p className="text-white font-semibold">Delivery Time</p>
                  <p className="text-muted-foreground text-sm">Major Cities</p>
                </div>
                <div className="text-center">
                  <h3 className="text-primary font-bold text-4xl mb-2">3-7d</h3>
                  <p className="text-white font-semibold">Rural Areas</p>
                  <p className="text-muted-foreground text-sm">Extended Delivery</p>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6 text-center">
              <div className="bg-[#0a0a0a] border border-primary/30 rounded-lg p-6">
                <h4 className="text-white font-semibold mb-2">Major Cities</h4>
                <p className="text-muted-foreground text-sm">Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, Kehancha, Nairobi, Ruiru, Kikuyu</p>
              </div>
              <div className="bg-[#0a0a0a] border border-primary/30 rounded-lg p-6">
                <h4 className="text-white font-semibold mb-2">Delivery Partners</h4>
                <p className="text-muted-foreground text-sm">We partner with trusted logistics providers to ensure your products arrive safely</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Get in Touch</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Have questions? We're here to help! Contact us through any of the channels below.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="bg-primary hover:bg-primary/80 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Contact Us
            </Link>
            <Link
              href="/"
              className="border border-primary text-primary hover:bg-primary hover:text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
