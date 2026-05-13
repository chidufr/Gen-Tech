'use client';

import { useEffect, useState } from 'react';
import { Save, X, Upload, ToggleLeft, ToggleRight } from 'lucide-react';
import { Category } from '@/lib/supabase';
import { useSettings } from '@/contexts/SettingsContext';

export const dynamic = 'force-dynamic';

export default function CategoriesAdminPage() {
  const { categories, updateCategories } = useSettings();
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', icon: '' });
  const [editIconFile, setEditIconFile] = useState<File | null>(null);
  const [iconError, setIconError] = useState('');

  useEffect(() => {
    setLoading(false);
  }, []);

  const categoryList: Category[] = categories || [];

  function handleIconFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    if (!file) {
      setEditIconFile(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setIconError('Please select a valid image file');
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      setIconError('Icon size must be less than 1MB');
      return;
    }

    setEditIconFile(file);
    setIconError('');
  }

  function readFileAsDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Unable to read file'));
        }
      };
      reader.onerror = () => reject(new Error('Unable to read file'));
      reader.readAsDataURL(file);
    });
  }

  async function saveCategory(id: string) {
    try {
      let updatedForm = { ...editForm };

      if (editIconFile) {
        updatedForm.icon = await readFileAsDataUrl(editIconFile);
      }

      const updatedCategories = categoryList.map((cat) =>
        cat.id === id ? { ...cat, ...updatedForm, updated_at: new Date().toISOString() } : cat
      );

      updateCategories(updatedCategories);
      setEditingId(null);
      setEditIconFile(null);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  }

  function startEditing(category: Category) {
    setEditingId(category.id);
    setEditForm({
      name: category.name,
      description: category.description || '',
      icon: category.icon || '',
    });
  }

  function toggleCategory(category: Category) {
    const updatedCategories = categoryList.map((c) =>
      c.id === category.id ? { ...c, is_enabled: !c.is_enabled, updated_at: new Date().toISOString() } : c
    );
    updateCategories(updatedCategories);
  }

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Categories</h1>
          <p className="text-muted-foreground mt-1">
            {categoryList.length} categories — Manage category visibility and details
          </p>
        </div>
        {/* Add Category button removed - categories are now locked */}
      </div>

      <div className="bg-[#111] border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#0a0a0a]">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Order</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Icon</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categoryList.map((category) => (
              <tr key={category.id} className="hover:bg-[#0a0a0a] transition">
                <td className="px-4 py-3 text-muted-foreground">{category.sort_order}</td>
                <td className="px-4 py-3">
                  {editingId === category.id ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="bg-[#0a0a0a] border border-border text-white px-2 py-1 rounded focus:outline-none focus:border-primary"
                    />
                  ) : (
                    <span className="text-white font-medium">{category.name}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingId === category.id ? (
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleIconFileChange(e)}
                        className="w-full bg-[#0a0a0a] border border-border text-white px-2 py-1 rounded file:text-primary file:border-0 file:bg-transparent file:cursor-pointer focus:outline-none focus:border-primary text-xs"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 bg-[#0a0a0a] rounded flex items-center justify-center overflow-hidden">
                      {category.icon ? (
                        <img src={category.icon} alt={category.name} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-muted-foreground">No icon</span>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleCategory(category)}
                    className={`flex items-center gap-1 min-h-[44px] min-w-[44px] px-2 ${
                      category.is_enabled ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {category.is_enabled ? (
                      <ToggleRight className="w-5 h-5" />
                    ) : (
                      <ToggleLeft className="w-5 h-5" />
                    )}
                    <span className="text-sm">{category.is_enabled ? 'Enabled' : 'Disabled'}</span>
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {editingId === category.id ? (
                      <>
                        <button
                          onClick={() => saveCategory(category.id)}
                          className="text-primary hover:text-white transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                        >
                          <Save className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-muted-foreground hover:text-white transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(category)}
                          className="text-muted-foreground hover:text-white transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                        >
                          <Upload className="w-5 h-5" />
                        </button>
                        {/* Delete button removed - categories are now locked */}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}