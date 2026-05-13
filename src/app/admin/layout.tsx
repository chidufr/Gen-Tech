'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  MessageSquare,
  BarChart3,
  Settings,
  Menu,
  X,
  Lock,
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import Logo from '@/components/Logo';

export const dynamic = 'force-dynamic';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/categories', icon: FolderTree, label: 'Categories' },
  { href: '/admin/enquiries', icon: MessageSquare, label: 'Enquiries' },
  { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Check if already authenticated in session storage
  useEffect(() => {
    setMounted(true);
    const auth = typeof window !== 'undefined' && sessionStorage.getItem('adminAuth') === 'true';
    setIsAuthenticated(auth);
  }, []);

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password === '12345678') {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      setPassword('');
    } else {
      setError('Invalid password. Please try again.');
      setPassword('');
    }
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  // Show password modal if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="bg-[#111] border border-border rounded-lg p-8 max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white text-center mb-2">Admin Access</h1>
          <p className="text-muted-foreground text-center mb-6">
            Enter the password to access the admin panel
          </p>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-white font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handlePasswordSubmit(e as any);
                  }
                }}
                placeholder="Enter admin password"
                className="w-full bg-[#0a0a0a] border border-border text-white px-4 py-3 rounded-lg focus:outline-none focus:border-primary transition"
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/80 text-white font-semibold py-3 rounded-lg transition"
            >
              Access Admin Panel
            </button>
          </form>

          <p className="text-muted-foreground text-center text-xs mt-4">
            Only authorized users should have access to this area
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Toaster position="top-center" />
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black border-b border-border flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#111] rounded flex items-center justify-center overflow-hidden">
            <Logo width={24} height={24} />
          </div>
          <span className="text-white font-bold">Gen-Tech Admin</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white">
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 bottom-0 w-64 bg-black border-r border-border z-40 transition-transform duration-300',
          'lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#111] rounded-lg flex items-center justify-center overflow-hidden">
              <Logo width={36} height={36} />
            </div>
            <span className="text-white text-xl font-bold lowercase">gen-tech</span>
          </Link>
          <p className="text-muted-foreground text-sm mt-2">Admin Panel</p>
        </div>

        <nav className="p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition',
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-muted-foreground hover:bg-[#111] hover:text-white'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Removed logout button since authentication is disabled */}
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <div className="p-6">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
