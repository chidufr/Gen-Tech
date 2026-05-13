'use client';

import { useState, useEffect } from 'react';
import { Save, Upload, X, Phone, MessageCircle, Mail, Clock, MapPin } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { Settings } from '@/lib/supabase';
import { toast, Toaster } from 'react-hot-toast';
import ChangePasswordForm from '@/components/admin/ChangePasswordForm';

export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  const { updateSettings } = useSettings();
  const [settings, setSettings] = useState<Partial<Settings>>({
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    business_hours: '',
    city: '',
    street: '',
    building: '',
    room_number: '',
    hero_background_image: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'url' | 'upload'>('url');

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      // Mock settings for development
      const mockSettings: Settings = {
        id: '1',
        phone: '+254 712 345 678',
        whatsapp: '+254 712 345 678',
        email: 'info@gentech.co.ke',
        address: '123 Tech Street, Nairobi, Kenya',
        business_hours: 'Mon-Fri: 9AM-6PM, Sat: 9AM-4PM',
        city: 'Nairobi',
        street: 'Tech Street',
        building: 'Tech Plaza',
        room_number: '101',
        hero_background_image: 'https://example.com/hero.jpg',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // const { data } = await supabase.from('settings').select('*').single();
      // if (data) {
      //   setSettings(data as Settings);
      // }

      setSettings(mockSettings);
      if (mockSettings.hero_background_image) {
        setHeroImagePreview(mockSettings.hero_background_image);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setHeroImagePreview(result);
        setSettings({ ...settings, hero_background_image: result });
        setPreviewMode('upload');
      };
      reader.readAsDataURL(file);
    }
  }

  function clearImageUpload() {
    setHeroImagePreview(null);
    setSettings({ ...settings, hero_background_image: '' });
    setPreviewMode('url');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      // const { data: existing } = await supabase.from('settings').select('id').single();

      // if (existing) {
      //   await supabase
      //     .from('settings')
      //     .update(settings)
      //     .eq('id', existing.id);
      // } else {
      //   await supabase.from('settings').insert(settings);
      // }

      console.log('Mock save settings:', settings);

      // Mock delay for development
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update the global context with new settings
      const updatedSettings: Settings = {
        id: '1',
        phone: settings.phone || '',
        whatsapp: settings.whatsapp || '',
        email: settings.email || '',
        address: settings.address || '',
        business_hours: settings.business_hours || '',
        city: settings.city,
        street: settings.street,
        building: settings.building,
        room_number: settings.room_number,
        hero_background_image: settings.hero_background_image || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Trigger the context update - this will notify all listeners
      updateSettings(updatedSettings);

      toast.success('Settings saved successfully! Changes are now live on the website.');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-[#111] rounded w-48"></div>
        <div className="h-64 bg-[#111] rounded"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <Toaster position="top-center" />

      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your business contact information</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        {/* Contact Settings */}
        <div className="bg-[#111] border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary" />
            Contact Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-medium mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="tel"
                  value={settings.phone || ''}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  placeholder="0713017179"
                  className="w-full bg-[#0a0a0a] border border-border text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
              <p className="text-muted-foreground text-sm mt-1">Used for "Call Now" buttons</p>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">WhatsApp Number</label>
              <div className="relative">
                <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                <input
                  type="tel"
                  value={settings.whatsapp || ''}
                  onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                  placeholder="0713017179"
                  className="w-full bg-[#0a0a0a] border border-border text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
              <p className="text-muted-foreground text-sm mt-1">Used for "Order on WhatsApp" buttons</p>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={settings.email || ''}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  placeholder="info@gen-tech.co.ke"
                  className="w-full bg-[#0a0a0a] border border-border text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={settings.address || ''}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  placeholder="Nairobi, Kenya"
                  className="w-full bg-[#0a0a0a] border border-border text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">City</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={settings.city || ''}
                  onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                  placeholder="e.g., Nairobi"
                  className="w-full bg-[#0a0a0a] border border-border text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Street</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={settings.street || ''}
                  onChange={(e) => setSettings({ ...settings, street: e.target.value })}
                  placeholder="e.g., Tech Street"
                  className="w-full bg-[#0a0a0a] border border-border text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Building</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={settings.building || ''}
                  onChange={(e) => setSettings({ ...settings, building: e.target.value })}
                  placeholder="e.g., Tech Plaza"
                  className="w-full bg-[#0a0a0a] border border-border text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Room Number</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={settings.room_number || ''}
                  onChange={(e) => setSettings({ ...settings, room_number: e.target.value })}
                  placeholder="e.g., 101"
                  className="w-full bg-[#0a0a0a] border border-border text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-white font-medium mb-2">Business Hours</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={settings.business_hours || ''}
                  onChange={(e) => setSettings({ ...settings, business_hours: e.target.value })}
                  placeholder="Mon-Sat 8AM-8PM"
                  className="w-full bg-[#0a0a0a] border border-border text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hero Background */}
        <div className="bg-[#111] border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Hero Background</h2>

          {/* Preview Section */}
          {heroImagePreview && (
            <div className="mb-6">
              <label className="block text-white font-medium mb-2">Preview</label>
              <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
                <img
                  src={heroImagePreview}
                  alt="Hero background preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={clearImageUpload}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Tab Selection */}
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => setPreviewMode('url')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                previewMode === 'url'
                  ? 'bg-primary text-white'
                  : 'bg-[#0a0a0a] text-muted-foreground hover:text-white'
              }`}
            >
              Use URL
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode('upload')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                previewMode === 'upload'
                  ? 'bg-primary text-white'
                  : 'bg-[#0a0a0a] text-muted-foreground hover:text-white'
              }`}
            >
              Upload Image
            </button>
          </div>

          {/* URL Input */}
          {previewMode === 'url' && (
            <div>
              <label className="block text-white font-medium mb-2">Background Image URL</label>
              <input
                type="url"
                value={settings.hero_background_image || ''}
                onChange={(e) => {
                  setSettings({ ...settings, hero_background_image: e.target.value });
                  setHeroImagePreview(e.target.value);
                }}
                placeholder="https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1920"
                className="w-full bg-[#0a0a0a] border border-border text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary"
              />
              <p className="text-muted-foreground text-sm mt-1">Paste the URL of the background image for the home page hero section</p>
            </div>
          )}

          {/* File Upload */}
          {previewMode === 'upload' && (
            <div>
              <label className="block text-white font-medium mb-2">Upload Background Image</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="hero-image-upload"
                />
                <label
                  htmlFor="hero-image-upload"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-lg bg-[#0a0a0a] hover:bg-[#111] cursor-pointer transition"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-primary mb-2" />
                    <p className="text-white font-medium">Click to upload image</p>
                    <p className="text-muted-foreground text-sm">PNG, JPG, GIF up to 5MB</p>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary hover:bg-primary/80 disabled:bg-primary/50 text-white font-semibold py-3 px-8 rounded-lg flex items-center gap-2 transition"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>

      {/* Change Password Section */}
      <div className="mt-8">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
