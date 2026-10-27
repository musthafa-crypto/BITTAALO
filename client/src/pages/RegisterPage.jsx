import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { SEO } from '../components/SEO';
import toast from 'react-hot-toast';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const RegisterPage = () => {
  const { register: registerAuth } = useAuthStore();
  const { syncCartWithServer } = useCartStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await registerAuth(data);
      toast.success(`Account created! Welcome, ${res.user.name}`);
      await syncCartWithServer();
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#FAFAFA] min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SEO title="Create Account" description="Join BITTAALO for premium lifestyle accessories in India." />

      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-zinc-200/80 shadow-sm space-y-6">
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl bg-zinc-950 text-brand-400 font-black text-xl flex items-center justify-center mx-auto mb-3">
            B
          </div>
          <h2 className="font-display font-black text-2xl text-zinc-950 uppercase tracking-tight">
            Join BITTAALO
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Exclusive drops, saved bags, and order tracking.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-700 block mb-1">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                {...register('name')}
                placeholder="Rohan Sharma"
                className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
              />
            </div>
            {errors.name && <p className="text-red-500 text-[11px] mt-1">{errors.name.message}</p>}
          </div>

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
            <label className="text-xs font-semibold text-zinc-700 block mb-1">Phone Number (Optional)</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="tel"
                {...register('phone')}
                placeholder="9876543210"
                className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 block mb-1">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="password"
                {...register('password')}
                placeholder="At least 6 characters"
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
            <span>{isSubmitting ? 'Creating Account...' : 'Register'}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <p className="text-center text-xs text-zinc-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-zinc-900 hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
};
