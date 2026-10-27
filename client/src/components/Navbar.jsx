import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Phone,
  Mail,
  ChevronDown,
  ShieldCheck,
  LogOut,
  Package,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';

const CATEGORIES_LIST = [
  { name: 'Sunglasses', slug: 'sunglasses' },
  { name: 'Caps', slug: 'caps' },
  { name: 'Jewellery', slug: 'jewellery' },
  { name: 'Watches', slug: 'watches' },
  { name: 'Wallets', slug: 'wallets' },
  { name: 'Shorts', slug: 'shorts' },
  { name: 'Belts', slug: 'belts' },
  { name: 'Footwear', slug: 'footwear' },
  { name: 'Shoes', slug: 'shoes' },
  { name: 'Sunglasses Pouch', slug: 'sunglasses-pouch' },
  { name: 'Lighter', slug: 'lighter' },
  { name: 'Water Bottle', slug: 'water-bottle' },
];

export const Navbar = ({ onOpenSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();
  const { items: cartItems, openDrawer } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();

  const navigate = useNavigate();
  const location = useLocation();

  const totalCartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoryDropdownOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Contact & Announcement Bar */}
      <div className="bg-zinc-950 text-zinc-300 text-xs py-2 px-4 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          {/* Direct Contact Links */}
          <div className="flex items-center gap-4 text-[11px] tracking-wider">
            <a
              href="https://wa.me/919037489104"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-brand-400 transition-colors"
            >
              <Phone size={12} className="text-brand-400" />
              <span>+91 9037489104</span>
            </a>
            <span className="text-zinc-700">|</span>
            <a
              href="mailto:bittaalo@gmail.com"
              className="flex items-center gap-1.5 hover:text-brand-400 transition-colors"
            >
              <Mail size={12} className="text-brand-400" />
              <span>bittaalo@gmail.com</span>
            </a>
          </div>

          {/* Announcement Promotion */}
          <div className="text-center font-medium tracking-widest text-[11px] text-zinc-200">
            FREE SHIPPING ON ORDERS OVER ₹999 IN INDIA • USE CODE <span className="text-brand-400 font-bold">WELCOME10</span>
          </div>

          {/* Currency / Location */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] text-zinc-400 font-medium">
            <span>🇮🇳 INDIA (INR ₹)</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`w-full transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-3.5 border-b border-zinc-200'
            : 'bg-white py-4 border-b border-zinc-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Mobile Menu Button & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-zinc-800 hover:text-black focus:outline-none"
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>

            {/* Brand Logo Wordmark */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center font-black text-brand-400 text-lg shadow-sm group-hover:scale-105 transition-transform">
                B
              </div>
              <span className="font-display font-black text-xl sm:text-2xl tracking-[0.25em] text-zinc-950 uppercase group-hover:text-brand-600 transition-colors">
                BITTAALO
              </span>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-zinc-700">
            <Link to="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <Link to="/shop" className="hover:text-black transition-colors">
              Shop All
            </Link>

            {/* Categories Mega Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCategoryDropdownOpen(true)}
              onMouseLeave={() => setCategoryDropdownOpen(false)}
            >
              <button
                className="flex items-center gap-1 hover:text-black transition-colors py-2 uppercase tracking-widest text-xs font-semibold"
                aria-expanded={categoryDropdownOpen}
              >
                <span>Categories</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {categoryDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[540px] bg-white rounded-xl shadow-2xl border border-zinc-200 p-6 grid grid-cols-3 gap-3 animate-fade-in z-50">
                  {CATEGORIES_LIST.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/shop?category=${cat.slug}`}
                      className="p-2.5 rounded-lg hover:bg-zinc-50 border border-transparent hover:border-zinc-200 text-xs font-medium normal-case tracking-normal text-zinc-800 hover:text-brand-600 flex items-center justify-between transition-all"
                    >
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                  <div className="col-span-3 pt-3 border-t border-zinc-100 flex justify-between items-center text-[11px] normal-case text-zinc-400">
                    <span>12 Lifestyle Categories Available</span>
                    <Link to="/shop" className="font-bold text-zinc-900 hover:underline">
                      Explore All Accessories &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link to="/about" className="hover:text-black transition-colors">
              About
            </Link>
            <Link to="/contact" className="hover:text-black transition-colors">
              Contact
            </Link>
          </div>

          {/* Right: Actions (Search, Wishlist, Account, Cart) */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-zinc-700 hover:text-black hover:bg-zinc-100 rounded-full transition-colors"
              aria-label="Search catalog"
            >
              <Search size={20} />
            </button>

            {/* Wishlist Link */}
            <Link
              to="/account?tab=wishlist"
              className="relative p-2 text-zinc-700 hover:text-black hover:bg-zinc-100 rounded-full transition-colors"
              aria-label="Saved items wishlist"
            >
              <Heart size={20} />
              {wishlistItems.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* User Account / Profile Menu */}
            <div className="relative">
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="p-2 text-zinc-800 hover:text-black hover:bg-zinc-100 rounded-full transition-colors flex items-center gap-1.5"
                    aria-label="User profile menu"
                  >
                    <User size={20} />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-zinc-200 py-2 z-50 text-xs">
                      <div className="px-4 py-2 border-b border-zinc-100">
                        <p className="font-bold text-zinc-900 truncate">{user?.name}</p>
                        <p className="text-zinc-500 text-[11px] truncate">{user?.email}</p>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-brand-600 font-bold hover:bg-zinc-50 transition-colors"
                        >
                          <ShieldCheck size={14} />
                          Admin Dashboard
                        </Link>
                      )}

                      <Link
                        to="/account"
                        className="flex items-center gap-2 px-4 py-2 text-zinc-700 hover:bg-zinc-50 transition-colors"
                      >
                        <User size={14} />
                        My Profile & Orders
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tracking-wider uppercase text-zinc-900 hover:text-brand-600"
                >
                  <User size={16} />
                  <span>Login</span>
                </Link>
              )}
            </div>

            {/* Cart Bag Button */}
            <button
              onClick={openDrawer}
              className="relative p-2.5 bg-zinc-950 text-white rounded-full hover:bg-zinc-800 transition-all active:scale-95 shadow-sm"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag size={18} />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-400 text-black text-[11px] font-black rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
              <span className="font-display font-extrabold tracking-widest text-lg text-black">
                BITTAALO
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-zinc-600 hover:text-black"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation links */}
            <div className="py-4 flex flex-col gap-3 text-sm font-semibold uppercase tracking-wider text-zinc-800 border-b border-zinc-100">
              <Link to="/" className="py-2 hover:text-brand-600">
                Home
              </Link>
              <Link to="/shop" className="py-2 hover:text-brand-600">
                Shop All Products
              </Link>
              <Link to="/about" className="py-2 hover:text-brand-600">
                About Us
              </Link>
              <Link to="/contact" className="py-2 hover:text-brand-600">
                Contact & Support
              </Link>
              {isAuthenticated && (
                <Link to="/account" className="py-2 hover:text-brand-600">
                  My Orders & Profile
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin" className="py-2 text-brand-600 font-bold">
                  Admin Dashboard
                </Link>
              )}
            </div>

            {/* Categories in Mobile Menu */}
            <div className="py-4 flex-grow">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">
                Shop Categories
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {CATEGORIES_LIST.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/shop?category=${cat.slug}`}
                    className="py-1.5 text-xs text-zinc-700 hover:text-black font-medium"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Footer with direct contacts */}
            <div className="pt-4 border-t border-zinc-200 text-xs text-zinc-600 flex flex-col gap-2">
              <a href="https://wa.me/919037489104" className="flex items-center gap-2 font-medium text-emerald-600">
                <Phone size={14} /> +91 9037489104 (WhatsApp)
              </a>
              <a href="mailto:bittaalo@gmail.com" className="flex items-center gap-2">
                <Mail size={14} /> bittaalo@gmail.com
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
