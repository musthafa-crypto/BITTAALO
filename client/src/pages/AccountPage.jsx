import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  User as UserIcon,
  Package,
  Heart,
  MapPin,
  LogOut,
  Clock,
  CheckCircle,
  Truck,
  ExternalLink,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useWishlistStore } from '../store/wishlistStore';
import { fetchMyOrders } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { SEO } from '../components/SEO';
import toast from 'react-hot-toast';

export const AccountPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'orders';

  const { user, isAuthenticated, logout, updateProfile } = useAuthStore();
  const { items: wishlistProducts } = useWishlistStore();
  const navigate = useNavigate();

  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: fetchMyOrders,
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h2 className="font-display font-black text-xl text-zinc-900 mb-2">Account Login Required</h2>
        <p className="text-xs text-zinc-500 mb-6">Please log in to review your order history and manage your account.</p>
        <Link
          to="/login"
          className="px-6 py-2.5 bg-zinc-950 text-white rounded-lg text-xs font-bold uppercase"
        >
          Go to Sign In
        </Link>
      </div>
    );
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ name: profileName, phone: profilePhone });
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen py-10">
      <SEO title="My Account" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 flex-shrink-0 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm self-start space-y-6">
            <div className="flex items-center gap-3 pb-6 border-b border-zinc-100">
              <div className="w-12 h-12 rounded-full bg-zinc-950 text-brand-400 font-black text-lg flex items-center justify-center">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-zinc-900 truncate">{user?.name}</h3>
                <p className="text-[11px] text-zinc-400 truncate">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-1 text-xs font-semibold">
              <button
                onClick={() => setSearchParams({ tab: 'orders' })}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                  currentTab === 'orders' ? 'bg-zinc-900 text-white font-bold' : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                <Package size={16} />
                <span>Order History ({orders.length})</span>
              </button>

              <button
                onClick={() => setSearchParams({ tab: 'wishlist' })}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                  currentTab === 'wishlist' ? 'bg-zinc-900 text-white font-bold' : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                <Heart size={16} />
                <span>Wishlist ({wishlistProducts.length})</span>
              </button>

              <button
                onClick={() => setSearchParams({ tab: 'profile' })}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                  currentTab === 'profile' ? 'bg-zinc-900 text-white font-bold' : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                <UserIcon size={16} />
                <span>Profile & Details</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors pt-4 border-t border-zinc-100 mt-4"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Main Tab Content */}
          <div className="flex-1 bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-sm">
            {/* Orders Tab */}
            {currentTab === 'orders' && (
              <div>
                <h2 className="font-display font-black text-xl text-zinc-950 uppercase tracking-tight mb-6">
                  Order History & Live Status
                </h2>

                {ordersLoading ? (
                  <p className="text-xs text-zinc-500 py-6">Loading your orders...</p>
                ) : orders.length === 0 ? (
                  <div className="py-12 text-center">
                    <Package size={32} className="text-zinc-300 mx-auto mb-2" />
                    <p className="text-xs text-zinc-500 mb-4">You have not placed any orders yet.</p>
                    <Link
                      to="/shop"
                      className="px-5 py-2.5 bg-zinc-900 text-white text-xs font-bold uppercase rounded-lg inline-block"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div
                        key={ord._id}
                        className="p-5 rounded-xl border border-zinc-200 hover:border-zinc-300 transition-colors space-y-4"
                      >
                        <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-zinc-100 text-xs">
                          <div>
                            <span className="text-zinc-400">Order ID: </span>
                            <span className="font-bold text-zinc-900 font-mono">{ord.orderNumber}</span>
                          </div>
                          <span className="text-zinc-400">
                            Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                          </span>
                        </div>

                        {/* Status Badge & Amount */}
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full font-bold text-[11px] ${
                                ord.orderStatus === 'Delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.orderStatus === 'Shipped'
                                  ? 'bg-blue-100 text-blue-800'
                                  : ord.orderStatus === 'Cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              Status: {ord.orderStatus}
                            </span>
                            <span className="text-zinc-400">• {ord.paymentMethod.toUpperCase()}</span>
                          </div>

                          <span className="font-extrabold text-sm text-zinc-900">
                            Total: ₹{ord.totalPrice.toLocaleString('en-IN')}
                          </span>
                        </div>

                        {/* Order Items Preview */}
                        <div className="flex gap-2 overflow-x-auto py-1">
                          {ord.items?.map((it, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-zinc-50 p-2 rounded-lg text-xs">
                              <img
                                src={it.image || 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=100&q=80'}
                                alt={it.name}
                                className="w-10 h-10 rounded object-cover"
                              />
                              <div className="max-w-[150px] truncate">
                                <p className="font-bold truncate text-[11px]">{it.name}</p>
                                <p className="text-[10px] text-zinc-500">Qty: {it.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Timeline Status */}
                        {ord.timeline?.length > 0 && (
                          <div className="pt-2 text-[11px] text-zinc-500 flex items-center gap-1.5">
                            <Clock size={12} />
                            <span>
                              Latest update: {ord.timeline[ord.timeline.length - 1].comment} (
                              {new Date(ord.timeline[ord.timeline.length - 1].date).toLocaleDateString()})
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {currentTab === 'wishlist' && (
              <div>
                <h2 className="font-display font-black text-xl text-zinc-950 uppercase tracking-tight mb-6">
                  Saved Accessories ({wishlistProducts.length})
                </h2>

                {wishlistProducts.length === 0 ? (
                  <div className="py-12 text-center">
                    <Heart size={32} className="text-zinc-300 mx-auto mb-2" />
                    <p className="text-xs text-zinc-500 mb-4">No accessories in your wishlist yet.</p>
                    <Link
                      to="/shop"
                      className="px-5 py-2.5 bg-zinc-900 text-white text-xs font-bold uppercase rounded-lg inline-block"
                    >
                      Browse Store
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {wishlistProducts.map((p) => (
                      <ProductCard key={p._id} product={p} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {currentTab === 'profile' && (
              <form onSubmit={handleUpdateProfile} className="max-w-md space-y-4">
                <h2 className="font-display font-black text-xl text-zinc-950 uppercase tracking-tight mb-6">
                  Personal Profile
                </h2>

                <div>
                  <label className="text-xs text-zinc-600 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full p-2.5 border border-zinc-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-600 block mb-1">Email (Cannot be changed)</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full p-2.5 border border-zinc-200 rounded-lg text-xs bg-zinc-100 text-zinc-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-600 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full p-2.5 border border-zinc-200 rounded-lg text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-zinc-950 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
                >
                  Save Profile Changes
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
