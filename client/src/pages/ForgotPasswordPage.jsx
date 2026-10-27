import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import api from '../utils/axios';
import { SEO } from '../components/SEO';
import toast from 'react-hot-toast';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setIsSent(true);
      toast.success(res.data?.message || 'Password reset link sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#FAFAFA] min-h-[80vh] flex items-center justify-center py-12 px-4">
      <SEO title="Forgot Password" />

      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-zinc-200/80 shadow-sm space-y-6">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-black">
          <ArrowLeft size={14} /> Back to Sign In
        </Link>

        {isSent ? (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 size={24} />
            </div>
            <h2 className="font-display font-black text-xl text-zinc-950 uppercase tracking-tight">
              Reset Link Sent
            </h2>
            <p className="text-xs text-zinc-600">
              We have dispatched a password recovery link to <strong>{email}</strong>. It will remain active for 30 minutes.
            </p>
          </div>
        ) : (
          <>
            <div>
              <h2 className="font-display font-black text-2xl text-zinc-950 uppercase tracking-tight">
                Reset Password
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Enter your registered email address and we will send you instructions to set a new password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-zinc-950 hover:bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Sending...' : 'Send Reset Link'}</span>
                <ArrowRight size={14} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
