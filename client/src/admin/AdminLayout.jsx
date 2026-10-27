import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Tag,
  Star,
  Mail,
  Image as ImageIcon,
  LogOut,
  ArrowLeft,
  Menu,
  X,
  Store,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { SEO } from '../components/SEO';

const NAV_ITEMS = [
  { name: 'Overview', path: '/admin', icon: LayoutDashboard },
  { name: 'Products', path: '/admin/products', icon: Package },
  { name: 'Categories', path: '/admin/categories', icon: Layers },
  { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  { name: 'Customers', path: '/admin/customers', icon: Users },
  { name: 'Coupons', path: '/admin/coupons', icon: Tag },
  { name: 'Reviews', path: '/admin/reviews', icon: Star },
  { name: 'Messages', path: '/admin/messages', icon: Mail },
  { name: 'Banners', path: '/admin/banners', icon: ImageIcon },
];

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F4F4F6] flex flex-col lg:flex-row">
      <SEO title="Admin Control Center" />

      {/* Mobile Header */}
      <div className="lg:hidden bg-zinc-950 text-white p-4 flex items-center justify-between sticky top-0 z-40 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <button onClick={() => setSidebarOpen(true)} className="p-1 text-zinc-400 hover:text-white">
            <Menu size={22} />
          </button>
          <span className="font-display font-black text-lg tracking-widest text-brand-400">
            BITTAALO // ADMIN
          </span>
        </div>
        <Link to="/" className="text-xs font-bold text-zinc-400 hover:text-white flex items-center gap-1">
          <Store size={14} /> Storefront
        </Link>
      </div>

      {/* Sidebar Desktop & Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 text-zinc-300 flex flex-col justify-between p-6 transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Admin Header & Brand */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-400 text-black font-black text-lg flex items-center justify-center">
                B
              </div>
              <div>
                <h2 className="font-display font-black text-sm tracking-widest text-white uppercase">
                  BITTAALO
                </h2>
                <span className="text-[10px] text-brand-400 font-bold uppercase tracking-wider block">
                  Admin Console
                </span>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-zinc-500 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-brand-400 text-black font-black shadow-glow'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-zinc-800 space-y-3">
          <div className="px-2">
            <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
            <p className="text-[11px] text-zinc-500 truncate">{user?.email}</p>
          </div>

          <Link
            to="/"
            className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors"
          >
            <Store size={14} />
            <span>View Public Store</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-red-400 hover:text-red-300 rounded-lg hover:bg-zinc-900 transition-colors"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Admin Page Content */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};
