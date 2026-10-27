import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { SEO } from '../components/SEO';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const LoginPage = () => {
  const { login } = useAuthStore();
  const { syncCartWithServer } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await login(data.email, data.password);
      toast.success(`Welcome back, ${res.user.name}!`);
      await syncCartWithServer();

      if (res.user.role === 'admin' && from === '/') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillAdmin = () => {
    setValue('email', 'admin@bittaalo.com');
    setValue('password', 'Admin@12345');
    toast('Admin credentials filled!', { icon: '🔑' });
  };

  const fillCustomer = () => {
    setValue('email', 'customer@bittaalo.com');
    setValue('password', 'Customer@12345');
    toast('Customer credentials filled!', { icon: '👤' });
  };

  return (
    <div className="w-full bg-[#FAFAFA] min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SEO title="Sign In" description="Log into your BITTAALO account." />

      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-zinc-200/80 shadow-sm space-y-6">
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl bg-zinc-950 text-brand-400 font-black text-xl flex items-center justify-center mx-auto mb-3">
            B
          </div>
          <h2 className="font-display font-black text-2xl text-zinc-950 uppercase tracking-tight">
            Sign In to BITTAALO
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Access your orders, saved wishlist, and faster checkout.
          </p>
        </div>

        {/* Quick Fill Buttons for Testing & Evaluation */}
        <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block text-center">
            One-Click Testing Accounts
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillAdmin}
              className="py-1.5 px-3 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-lg text-[11px] font-bold text-zinc-800 flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldCheck size={14} className="text-brand-500" />
              <span>Fill Admin</span>
            </button>
            <button
              type="button"
              onClick={fillCustomer}
              className="py-1.5 px-3 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-lg text-[11px] font-bold text-zinc-800 flex items-center justify-center gap-1.5 transition-colors"
            >
              <UserCheck size={14} className="text-zinc-600" />
              <span>Fill Customer</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-700 block mb-1">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="email"
                {...register('email')}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
              />
            </div>
            {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-zinc-700">Password</label>
              <Link to="/forgot-password" className="text-[11px] text-zinc-500 hover:text-zinc-900">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
              />
            </div>
            {errors.password && <p className="text-red-500 text-[11px] mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-zinc-950 hover:bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg hover:shadow-glow flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <p className="text-center text-xs text-zinc-500">
          New to BITTAALO?{' '}
          <Link to="/register" className="font-bold text-zinc-900 hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};
