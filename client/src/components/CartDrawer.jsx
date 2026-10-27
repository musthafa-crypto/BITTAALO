import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag, Check, Truck } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export const CartDrawer = () => {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    getSubtotal,
    getShippingPrice,
    getDiscount,
    getTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCartStore();

  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  if (!isDrawerOpen) return null;

  const subtotal = getSubtotal();
  const shipping = getShippingPrice();
  const discount = getDiscount();
  const total = getTotal();

  const freeShippingThreshold = 999;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    try {
      await applyCoupon(couponCode.trim());
      toast.success(`Coupon applied!`, { icon: '🎟️' });
      setCouponCode('');
    } catch (err) {
      toast.error(err.message || 'Invalid coupon code');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleCheckoutClick = () => {
    closeDrawer();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-zinc-900" />
              <h2 className="font-display font-extrabold text-lg uppercase tracking-wider text-zinc-950">
                Your Bag ({items.length})
              </h2>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-100 transition-colors"
              aria-label="Close bag drawer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3 bg-zinc-50 border-b border-zinc-200 text-xs">
            {amountNeededForFreeShipping > 0 ? (
              <div className="flex flex-col gap-1.5">
                <p className="text-zinc-700 font-medium flex items-center gap-1.5">
                  <Truck size={14} className="text-brand-500" />
                  Add <strong className="text-zinc-900">₹{amountNeededForFreeShipping}</strong> more for <strong>FREE Delivery</strong>
                </p>
                <div className="w-full bg-zinc-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-brand-400 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-emerald-700 font-bold flex items-center gap-1.5">
                <Check size={14} className="text-emerald-600" />
                Congratulations! You unlocked FREE Shipping in India.
              </p>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-zinc-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-4">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="font-bold text-base text-zinc-900 mb-1">Your bag is empty</h3>
                <p className="text-xs text-zinc-500 max-w-xs mb-6">
                  Explore our modern accessories catalog and add your favorites to get started.
                </p>
                <button
                  onClick={() => {
                    closeDrawer();
                    navigate('/shop');
                  }}
                  className="px-6 py-2.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item, idx) => {
                const product = item.product || {};
                const activePrice = product.discountPrice || product.price || item.price || 0;
                const itemKey = item._id || `${product._id || product.id}-${item.variant?.value || idx}`;

                return (
                  <div key={itemKey} className="py-4 flex gap-4 items-center">
                    {/* Thumbnail */}
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=300&q=80'}
                      alt={product.name || 'Product'}
                      className="w-16 h-16 rounded-lg object-cover bg-zinc-100 flex-shrink-0 border border-zinc-200"
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-zinc-900 truncate">
                        {product.name || item.name}
                      </h4>
                      {item.variant?.value && (
                        <p className="text-[11px] text-zinc-500 font-medium">
                          {item.variant.name}: {item.variant.value}
                        </p>
                      )}
                      <p className="text-xs font-extrabold text-zinc-900 mt-1">
                        ₹{activePrice.toLocaleString('en-IN')}
                      </p>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-zinc-300 rounded-md">
                          <button
                            onClick={() =>
                              updateQuantity(itemKey, Math.max(1, item.quantity - 1), isAuthenticated)
                            }
                            className="p-1 text-zinc-500 hover:text-black"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2 text-xs font-bold text-zinc-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(itemKey, item.quantity + 1, isAuthenticated)
                            }
                            className="p-1 text-zinc-500 hover:text-black"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(itemKey, isAuthenticated)}
                          className="p-1 text-zinc-400 hover:text-red-600 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-6 border-t border-zinc-200 bg-white flex flex-col gap-4">
              {/* Coupon Code Section */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Tag size={14} />
                    <span>Coupon "{appliedCoupon.code}" applied (-₹{discount})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-emerald-700 hover:text-red-600 font-bold ml-2"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Coupon code (e.g. WELCOME10)"
                    className="flex-1 bg-zinc-100 border border-zinc-300 rounded-lg px-3 py-2 text-xs uppercase font-medium focus:outline-none focus:border-zinc-900"
                  />
                  <button
                    type="submit"
                    disabled={isApplyingCoupon}
                    className="px-4 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Price Breakdown */}
              <div className="flex flex-col gap-1.5 text-xs text-zinc-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-zinc-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className="font-semibold text-zinc-900">
                    {shipping === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-zinc-400">
                  <span>GST (18% inclusive)</span>
                  <span>Included</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-zinc-950 pt-2 border-t border-zinc-200">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleCheckoutClick}
                className="w-full py-3.5 bg-zinc-950 hover:bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg hover:shadow-glow flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
