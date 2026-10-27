import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { SearchModal } from '../components/SearchModal';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp';
import { useAuthStore } from '../store/authStore';

// Lazy Loaded Pages
const HomePage = lazy(() => import('../pages/HomePage').then((m) => ({ default: m.HomePage })));
const ShopPage = lazy(() => import('../pages/ShopPage').then((m) => ({ default: m.ShopPage })));
const ProductDetailPage = lazy(() =>
  import('../pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage }))
);
const CheckoutPage = lazy(() =>
  import('../pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage }))
);
const AccountPage = lazy(() =>
  import('../pages/AccountPage').then((m) => ({ default: m.AccountPage }))
);
const LoginPage = lazy(() => import('../pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() =>
  import('../pages/RegisterPage').then((m) => ({ default: m.RegisterPage }))
);
const ForgotPasswordPage = lazy(() =>
  import('../pages/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage }))
);
const AboutPage = lazy(() => import('../pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() =>
  import('../pages/ContactPage').then((m) => ({ default: m.ContactPage }))
);
const FAQPage = lazy(() =>
  import('../pages/StaticPages').then((m) => ({ default: m.FAQPage }))
);
const ShippingReturnsPage = lazy(() =>
  import('../pages/StaticPages').then((m) => ({ default: m.ShippingReturnsPage }))
);
const PrivacyPolicyPage = lazy(() =>
  import('../pages/StaticPages').then((m) => ({ default: m.PrivacyPolicyPage }))
);
const TermsPage = lazy(() =>
  import('../pages/StaticPages').then((m) => ({ default: m.TermsPage }))
);
const NotFoundPage = lazy(() =>
  import('../pages/StaticPages').then((m) => ({ default: m.NotFoundPage }))
);

// Admin Pages
const AdminLayout = lazy(() =>
  import('../admin/AdminLayout').then((m) => ({ default: m.AdminLayout }))
);
const AdminOverview = lazy(() =>
  import('../admin/AdminOverview').then((m) => ({ default: m.AdminOverview }))
);
const AdminProducts = lazy(() =>
  import('../admin/AdminProducts').then((m) => ({ default: m.AdminProducts }))
);
const AdminCategories = lazy(() =>
  import('../admin/AdminCategories').then((m) => ({ default: m.AdminCategories }))
);
const AdminOrders = lazy(() =>
  import('../admin/AdminOrders').then((m) => ({ default: m.AdminOrders }))
);
const AdminCustomers = lazy(() =>
  import('../admin/AdminCustomers').then((m) => ({ default: m.AdminCustomers }))
);
const AdminCoupons = lazy(() =>
  import('../admin/AdminCoupons').then((m) => ({ default: m.AdminCoupons }))
);
const AdminReviews = lazy(() =>
  import('../admin/AdminReviews').then((m) => ({ default: m.AdminReviews }))
);
const AdminMessages = lazy(() =>
  import('../admin/AdminMessages').then((m) => ({ default: m.AdminMessages }))
);
const AdminBanners = lazy(() =>
  import('../admin/AdminBanners').then((m) => ({ default: m.AdminBanners }))
);

// Fallback Spinner
const PageLoader = () => (
  <div className="w-full h-[60vh] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-zinc-200 border-t-zinc-950 rounded-full animate-spin" />
      <span className="font-display font-black text-xs uppercase tracking-widest text-zinc-400">
        BITTAALO
      </span>
    </div>
  </div>
);

// Protected Customer Route
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

// Protected Admin Route
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) return <PageLoader />;
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Main Public Layout Shell
const PublicLayout = ({ onOpenSearch }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onOpenSearch={onOpenSearch} />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <CartDrawer />
      <FloatingWhatsApp />
    </div>
  );
};

export const AppRoutes = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Storefront Routes with Header and Footer */}
          <Route element={<PublicLayout onOpenSearch={() => setIsSearchOpen(true)} />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/shipping-returns" element={<ShippingReturnsPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Admin Dashboard Protected Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="banners" element={<AdminBanners />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};
