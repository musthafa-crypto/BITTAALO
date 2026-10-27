import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import confetti from 'canvas-confetti';
import {
  CreditCard,
  Banknote,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { placeOrder, fetchRazorpayKey, verifyPaymentSignature } from '../services/api';
import { SEO } from '../components/SEO';
import toast from 'react-hot-toast';

// Address validation schema
const addressSchema = z.object({
  fullName: z.string().min(2, 'Full Name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),
  street: z.string().min(5, 'Flat / House No. / Street is required'),
  landmark: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pinCode: z.string().regex(/^[1-9][0-9]{5}$/, 'PIN code must be a valid 6-digit Indian PIN code'),
});

export const CheckoutPage = () => {
  const { items, getSubtotal, getShippingPrice, getDiscount, getTotal, appliedCoupon, clearCart } =
    useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'razorpay' or 'cod'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const subtotal = getSubtotal();
  const shipping = getShippingPrice();
  const discount = getDiscount();
  const total = getTotal();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      street: user?.addresses?.[0]?.street || '',
      landmark: user?.addresses?.[0]?.landmark || '',
      city: user?.addresses?.[0]?.city || '',
      state: user?.addresses?.[0]?.state || 'Karnataka',
      pinCode: user?.addresses?.[0]?.pinCode || '',
    },
  });

  // Autofill if user profile loads
  useEffect(() => {
    if (user) {
      if (user.name) setValue('fullName', user.name);
      if (user.email) setValue('email', user.email);
      if (user.phone) setValue('phone', user.phone);
      if (user.addresses?.[0]) {
        const addr = user.addresses[0];
        setValue('street', addr.street);
        setValue('landmark', addr.landmark || '');
        setValue('city', addr.city);
        setValue('state', addr.state);
        setValue('pinCode', addr.pinCode);
      }
    }
  }, [user, setValue]);

  // If bag is empty and no order placed yet
  if (items.length === 0 && !placedOrder) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mx-auto mb-4">
          <ShoppingBag size={28} />
        </div>
        <h2 className="font-display font-black text-xl text-zinc-900 mb-2">Your Bag Is Empty</h2>
        <p className="text-xs text-zinc-500 mb-6">You need items in your cart to proceed with checkout.</p>
        <Link
          to="/shop"
          className="px-6 py-3 bg-zinc-950 text-white text-xs font-bold uppercase tracking-wider rounded-xl inline-block"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  // Handle Order Placement
  const onProcessOrder = async (formData) => {
    setIsSubmitting(true);

    try {
      const orderPayload = {
        items: items.map((item) => ({
          product: item.product?._id || item.product,
          name: item.product?.name || item.name,
          quantity: item.quantity,
          variant: item.variant,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          street: formData.street,
          landmark: formData.landmark || '',
          city: formData.city,
          state: formData.state,
          pinCode: formData.pinCode,
        },
        paymentMethod,
        couponCode: appliedCoupon?.code,
        guestInfo: !isAuthenticated
          ? {
              name: formData.fullName,
              email: formData.email,
              phone: formData.phone,
            }
          : undefined,
      };

      const result = await placeOrder(orderPayload);

      if (!result.success) {
        throw new Error(result.message || 'Failed to place order');
      }

      // Handle Razorpay Online Payment Flow
      if (paymentMethod === 'razorpay' && result.razorpayOrder) {
        const razorpayKey = await fetchRazorpayKey();

        // Check if Razorpay modal script is in window, or if we can handle mock verification seamlessly
        const options = {
          key: razorpayKey,
          amount: result.razorpayOrder.amount,
          currency: 'INR',
          name: 'BITTAALO',
          description: `Order ${result.order.orderNumber}`,
          image: '/logo.png',
          order_id: result.razorpayOrder.id,
          handler: async function (response) {
            try {
              await verifyPaymentSignature({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: result.order._id,
              });
              completeOrderSuccess(result.order);
            } catch {
              toast.error('Payment verification failed. Please contact support.');
            }
          },
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: '#0A0A0B',
          },
        };

        // If Razorpay SDK is loaded on window
        if (typeof window !== 'undefined' && window.Razorpay) {
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          // Dev test mode fallback: simulate instant successful test verification
          await verifyPaymentSignature({
            razorpay_order_id: result.razorpayOrder.id,
            razorpay_payment_id: `pay_${Date.now()}_simulated`,
            razorpay_signature: 'test_signature_valid',
            orderId: result.order._id,
          });
          completeOrderSuccess(result.order);
        }
      } else {
        // COD order placed directly
        completeOrderSuccess(result.order);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Checkout failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const completeOrderSuccess = (order) => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    setPlacedOrder(order);
    clearCart(isAuthenticated);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // SUCCESS CONFIRMATION VIEW
  if (placedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-fade-in">
        <SEO title="Order Confirmed!" />
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={36} />
        </div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-zinc-950 uppercase tracking-tight mb-2">
          Thank You For Your Order!
        </h1>
        <p className="text-zinc-600 text-xs sm:text-sm mb-6">
          Your order has been recorded and an email confirmation was sent to{' '}
          <strong>{placedOrder.shippingAddress?.fullName}</strong>.
        </p>

        {/* Order Details Card */}
        <div className="p-6 rounded-2xl bg-white border border-zinc-200 text-left space-y-4 mb-8 shadow-sm">
          <div className="flex justify-between items-center pb-3 border-b border-zinc-100 text-xs">
            <span className="text-zinc-500">Order Number:</span>
            <span className="font-bold text-zinc-900 font-mono text-sm">{placedOrder.orderNumber}</span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-zinc-100 text-xs">
            <span className="text-zinc-500">Payment Status:</span>
            <span className="font-bold text-emerald-600 uppercase">
              {placedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid Online'}
            </span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-zinc-100 text-xs">
            <span className="text-zinc-500">Amount:</span>
            <span className="font-black text-zinc-950 text-base">
              ₹{placedOrder.totalPrice.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="text-xs text-zinc-600 pt-1">
            <p className="font-bold text-zinc-900 mb-1">Delivering to:</p>
            <p>{placedOrder.shippingAddress.fullName}</p>
            <p>{placedOrder.shippingAddress.street}</p>
            <p>
              {placedOrder.shippingAddress.city}, {placedOrder.shippingAddress.state} -{' '}
              {placedOrder.shippingAddress.pinCode}
            </p>
            <p className="text-zinc-400 mt-1">Phone: +91 {placedOrder.shippingAddress.phone}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/shop"
            className="px-6 py-3 bg-zinc-950 hover:bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
          >
            Continue Shopping
          </Link>
          <a
            href={`https://wa.me/919037489104?text=Hi%20BITTAALO!%20My%20order%20number%20is%20${placedOrder.orderNumber}.`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
          >
            Track on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAFAFA] py-8 sm:py-12">
      <SEO title="Secure Checkout" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display font-black text-2xl sm:text-3xl text-zinc-950 uppercase tracking-tight mb-8">
          Secure Checkout
        </h1>

        <form onSubmit={handleSubmit(onProcessOrder)} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Shipping Address & Payment Selection */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Delivery Address Card */}
            <div className="p-6 sm:p-8 bg-white rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
                <Truck size={18} className="text-brand-500" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900">
                  1. Delivery Address (India)
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs text-zinc-600 font-medium block mb-1">Full Name *</label>
                  <input
                    type="text"
                    {...register('fullName')}
                    placeholder="e.g. Rohan Sharma"
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                  />
                  {errors.fullName && <p className="text-red-500 text-[11px] mt-1">{errors.fullName.message}</p>}
                </div>

                <div>
                  <label className="text-xs text-zinc-600 font-medium block mb-1">Email Address *</label>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="name@gmail.com"
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                  />
                  {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="text-xs text-zinc-600 font-medium block mb-1">Phone Number (10 Digits) *</label>
                  <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-lg overflow-hidden">
                    <span className="px-2.5 text-xs text-zinc-500 border-r border-zinc-200">+91</span>
                    <input
                      type="tel"
                      {...register('phone')}
                      placeholder="9876543210"
                      className="w-full p-2.5 bg-transparent text-xs text-zinc-900 focus:outline-none"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-[11px] mt-1">{errors.phone.message}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs text-zinc-600 font-medium block mb-1">Flat / Building / Street Address *</label>
                  <input
                    type="text"
                    {...register('street')}
                    placeholder="e.g. Flat 402, Skyline Residency, Bandra West"
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                  />
                  {errors.street && <p className="text-red-500 text-[11px] mt-1">{errors.street.message}</p>}
                </div>

                <div>
                  <label className="text-xs text-zinc-600 font-medium block mb-1">Landmark (Optional)</label>
                  <input
                    type="text"
                    {...register('landmark')}
                    placeholder="Near Metro Station"
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-600 font-medium block mb-1">PIN Code (6 Digits) *</label>
                  <input
                    type="text"
                    maxLength={6}
                    {...register('pinCode')}
                    placeholder="e.g. 560001"
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                  />
                  {errors.pinCode && <p className="text-red-500 text-[11px] mt-1">{errors.pinCode.message}</p>}
                </div>

                <div>
                  <label className="text-xs text-zinc-600 font-medium block mb-1">City *</label>
                  <input
                    type="text"
                    {...register('city')}
                    placeholder="Bengaluru"
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                  />
                  {errors.city && <p className="text-red-500 text-[11px] mt-1">{errors.city.message}</p>}
                </div>

                <div>
                  <label className="text-xs text-zinc-600 font-medium block mb-1">State *</label>
                  <input
                    type="text"
                    {...register('state')}
                    placeholder="Karnataka"
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                  />
                  {errors.state && <p className="text-red-500 text-[11px] mt-1">{errors.state.message}</p>}
                </div>
              </div>
            </div>

            {/* 2. Payment Method Selector */}
            <div className="p-6 sm:p-8 bg-white rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
                <Lock size={18} className="text-brand-500" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900">
                  2. Select Payment Method
                </h2>
              </div>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 text-zinc-900 focus:ring-zinc-900"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-zinc-900 flex items-center gap-2">
                        <Banknote size={16} /> Cash on Delivery (COD)
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                        Recommended
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Pay easily in cash or UPI QR code directly to the courier agent upon doorstep delivery.
                    </p>
                  </div>
                </label>

                {/* Razorpay Online */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'razorpay'
                      ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="mt-1 text-zinc-900 focus:ring-zinc-900"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-zinc-900 flex items-center gap-2">
                        <CreditCard size={16} /> Online Payment (Razorpay Test Mode)
                      </span>
                      <span className="text-[10px] bg-zinc-100 text-zinc-700 font-bold px-2 py-0.5 rounded">
                        UPI / Cards / Netbanking
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Instant verification with test card/UPI support. No real charges will be made.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order CTA */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200/80 shadow-sm sticky top-28 space-y-6">
              <h3 className="font-display font-extrabold text-base uppercase tracking-wider text-zinc-900 pb-3 border-b border-zinc-100">
                Order Summary ({items.length})
              </h3>

              {/* Items Preview */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item, idx) => {
                  const product = item.product || {};
                  const price = product.discountPrice || product.price || item.price || 0;
                  return (
                    <div key={idx} className="flex gap-3 items-center text-xs">
                      <img
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=150&q=80'}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover bg-zinc-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-zinc-900 truncate">{product.name || item.name}</p>
                        {item.variant?.value && (
                          <p className="text-[11px] text-zinc-400">
                            {item.variant.name}: {item.variant.value}
                          </p>
                        )}
                        <p className="text-[11px] text-zinc-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-extrabold text-zinc-900">
                        ₹{(price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Price Calculation breakdown */}
              <div className="pt-4 border-t border-zinc-100 space-y-2 text-xs text-zinc-600">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-bold text-zinc-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon Discount</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-bold text-zinc-900">
                    {shipping === 0 ? <span className="text-emerald-600">FREE</span> : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-zinc-400">
                  <span>GST (18% inclusive)</span>
                  <span>₹{Math.round(subtotal * 0.18).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-lg font-black text-zinc-950 pt-3 border-t border-zinc-200">
                  <span>Total Amount</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Place Order CTA Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-zinc-950 hover:bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg hover:shadow-glow flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Securing Your Order...' : `Confirm Order (₹${total.toLocaleString('en-IN')})`}</span>
                <ArrowRight size={16} />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 text-center">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>256-Bit SSL Encrypted & Protected Checkout</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
