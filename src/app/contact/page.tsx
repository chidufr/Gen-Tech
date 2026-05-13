'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, ChevronRight } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { useSettings } from '@/contexts/SettingsContext';
import Link from 'next/link';
import { formatWhatsAppUrl, formatCallUrl } from '@/lib/supabase';

export default function ContactPage() {
  const { settings, categories } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In production, this would send to an API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', category: '', message: '' });
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get enabled categories for the contact form
  const enabledCategories = categories.filter(c => c.is_enabled);
  
  // Build WhatsApp URL with dynamic phone number from settings
  const whatsappNumber = settings?.whatsapp || '0713017179';
  const whatsappMessage = `Hello! I have a question about Gen-Tech products.`;
  const whatsappUrl = formatWhatsAppUrl(whatsappNumber, whatsappMessage);
  
  // Build call URL with dynamic phone number from settings
  const callNumber = settings?.phone || '0713017179';
  const callUrl = formatCallUrl(callNumber);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Toaster position="top-center" />

      {/* Hero */}
      <section className="py-20 bg-[#111]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-muted-foreground text-lg">We'd love to hear from you</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-8">Get in Touch</h2>

              <div className="space-y-6 mb-12">
                {/* Phone */}
                {settings?.phone && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Phone</h3>
                      <a href={callUrl} className="text-muted-foreground hover:text-white transition">
                        {settings.phone}
                      </a>
                    </div>
                  </div>
                )}

                {/* WhatsApp */}
                {settings?.whatsapp && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">WhatsApp</h3>
                      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-white transition">
                        Chat with us on WhatsApp
                      </a>
                    </div>
                  </div>
                )}

                {/* Email */}
                {settings?.email && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Email</h3>
                      <a href={`mailto:${settings.email}`} className="text-muted-foreground hover:text-white transition">
                        {settings.email}
                      </a>
                    </div>
                  </div>
                )}

                {/* Location */}
                {(settings?.address || settings?.city) && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Location</h3>
                      <p className="text-muted-foreground">
                        {[settings.city, settings.street, settings.building, settings.room_number, settings.address]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Business Hours */}
                {settings?.business_hours && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Business Hours</h3>
                      <p className="text-muted-foreground">{settings.business_hours}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Contact - Mobile Optimized with larger tap targets */}
              <div className="bg-[#111] border border-primary/30 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-4">Quick Contact</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-4 rounded-lg flex items-center justify-center gap-2 transition min-h-[52px] touch-manipulation"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </a>
                  <a
                    href={callUrl}
                    className="flex-1 bg-primary hover:bg-primary/80 text-white font-semibold py-4 px-4 rounded-lg flex items-center justify-center gap-2 transition min-h-[52px] touch-manipulation"
                  >
                    <Phone className="w-5 h-5" />
                    Call Now
                  </a>
                </div>
              </div>

              {/* Browse Categories */}
              <div className="mt-8 bg-[#111] border border-primary/30 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-4">Browse Our Categories</h3>
                <div className="grid grid-cols-2 gap-3">
                  {enabledCategories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/category/${category.slug}`}
                      className="flex items-center gap-3 bg-[#0a0a0a] hover:bg-[#1a1a1a] border border-border hover:border-primary/50 rounded-lg p-4 transition min-h-[52px] touch-manipulation group"
                    >
                      <div className="flex-1">
                        <span className="text-white font-medium group-hover:text-primary transition">
                          {category.name}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-8">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="bg-[#111] border border-primary/30 rounded-lg p-8">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-white font-medium mb-2">Name</label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-border text-white px-4 py-3 rounded-lg focus:outline-none focus:border-primary transition min-h-[52px]"
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-white font-medium mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-border text-white px-4 py-3 rounded-lg focus:outline-none focus:border-primary transition min-h-[52px]"
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-white font-medium mb-2">Phone (Optional)</label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-border text-white px-4 py-3 rounded-lg focus:outline-none focus:border-primary transition min-h-[52px]"
                      placeholder="0712345678"
                    />
                  </div>

                  {/* Dynamic Category Selection */}
                  {enabledCategories.length > 0 && (
                    <div>
                      <label htmlFor="category" className="block text-white font-medium mb-2">
                        What are you interested in? (Optional)
                      </label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-[#0a0a0a] border border-border text-white px-4 py-3 rounded-lg focus:outline-none focus:border-primary transition min-h-[52px] appearance-none"
                      >
                        <option value="">Select a category</option>
                        {enabledCategories.map((category) => (
                          <option key={category.slug} value={category.slug}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label htmlFor="message" className="block text-white font-medium mb-2">Message</label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      className="w-full bg-[#0a0a0a] border border-border text-white px-4 py-3 rounded-lg focus:outline-none focus:border-primary transition resize-none"
                      placeholder="How can we help you?"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/80 disabled:bg-primary/50 text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition min-h-[52px] touch-manipulation"
                  >
                    {loading ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Map */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Find Us</h2>
            <div className="bg-[#111] border border-primary/30 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255179.82627392!2d36.68222705!3d-1.29206595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d49a7%3A0xf7cf5cdcf211e107!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2sus!4v1699000000000!5m2!1sen!2sus"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}