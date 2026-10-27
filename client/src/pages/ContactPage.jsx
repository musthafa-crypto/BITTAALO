import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Phone, Mail, MapPin, Send, MessageCircle, Clock, CheckCircle2 } from 'lucide-react';
import { sendContactMessage } from '../services/api';
import { SEO } from '../components/SEO';
import toast from 'react-hot-toast';

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
});

export const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await sendContactMessage(data);
      if (res.success) {
        setIsSuccess(true);
        reset();
        toast.success('Your message has been sent to bittaalo@gmail.com!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message. Please try WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen py-12">
      <SEO
        title="Contact Us"
        description="Get in touch with the BITTAALO team for order inquiries, collaborations, or support. WhatsApp: +91 9037489104, Email: bittaalo@gmail.com."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-brand-600 font-extrabold text-xs uppercase tracking-widest">
            We Are Here For You
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-zinc-950 uppercase tracking-tight">
            Contact & Customer Support
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-lg mx-auto">
            Have questions regarding sizing, custom orders, tracking, or bulk inquiries? Reach out via WhatsApp or submit the form below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Contact Details & WhatsApp Button */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Contact Card */}
            <div className="p-8 bg-zinc-950 text-white rounded-3xl space-y-6 shadow-xl">
              <h3 className="font-display font-black text-xl uppercase tracking-wider text-white">
                Direct Channels
              </h3>

              <div className="space-y-5 text-xs text-zinc-300">
                <a
                  href="https://wa.me/919037489104"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3.5 hover:text-white transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-brand-400 group-hover:scale-105 transition-transform">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">Phone & WhatsApp Support</h4>
                    <p className="text-zinc-400 mt-0.5">+91 9037489104</p>
                    <span className="inline-block mt-1 text-[10px] text-emerald-400 font-semibold">
                      Instant response available
                    </span>
                  </div>
                </a>

                <a
                  href="mailto:bittaalo@gmail.com"
                  className="flex items-start gap-3.5 hover:text-white transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-brand-400 group-hover:scale-105 transition-transform">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">Official Email</h4>
                    <p className="text-zinc-400 mt-0.5">bittaalo@gmail.com</p>
                    <span className="inline-block mt-1 text-[10px] text-zinc-500">
                      Replies within 2 to 4 business hours
                    </span>
                  </div>
                </a>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-brand-400">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">Headquarters & Fulfillment</h4>
                    <p className="text-zinc-400 mt-0.5">Bengaluru & Mumbai, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-brand-400">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">Operating Hours</h4>
                    <p className="text-zinc-400 mt-0.5">Monday – Saturday: 9:00 AM – 8:00 PM IST</p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Action */}
              <div className="pt-4 border-t border-zinc-800">
                <a
                  href="https://wa.me/919037489104?text=Hi%20BITTAALO!%20I%20have%20an%20inquiry."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <MessageCircle size={18} className="fill-black" />
                  <span>Start WhatsApp Chat Now</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Working Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-zinc-200/80 shadow-sm">
            {isSuccess ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-display font-black text-2xl text-zinc-950 uppercase tracking-tight">
                  Message Dispatched!
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 max-w-md mx-auto">
                  Thank you for contacting BITTAALO. Your inquiry was saved to our system and routed to{' '}
                  <strong>bittaalo@gmail.com</strong>. A representative will contact you shortly.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="px-6 py-2.5 bg-zinc-950 text-white text-xs font-bold uppercase rounded-lg"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <h3 className="font-display font-black text-xl text-zinc-950 uppercase tracking-tight mb-1">
                    Send An Inquiry
                  </h3>
                  <p className="text-xs text-zinc-500 mb-6">
                    Fill out the fields below and our team will get in touch.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-zinc-700 block mb-1">Your Name *</label>
                    <input
                      type="text"
                      {...register('name')}
                      placeholder="e.g. Vikram Seth"
                      className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                    />
                    {errors.name && <p className="text-red-500 text-[11px] mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-700 block mb-1">Your Email *</label>
                    <input
                      type="email"
                      {...register('email')}
                      placeholder="vikram@example.com"
                      className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                    />
                    {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-zinc-700 block mb-1">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      {...register('phone')}
                      placeholder="+91 9876543210"
                      className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-700 block mb-1">Subject *</label>
                    <input
                      type="text"
                      {...register('subject')}
                      placeholder="Order Inquiry / Sizing / Custom"
                      className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                    />
                    {errors.subject && <p className="text-red-500 text-[11px] mt-1">{errors.subject.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">Message *</label>
                  <textarea
                    rows={4}
                    {...register('message')}
                    placeholder="Tell us what you need help with..."
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                  />
                  {errors.message && <p className="text-red-500 text-[11px] mt-1">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-zinc-950 hover:bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg hover:shadow-glow flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  <Send size={14} />
                  <span>{isSubmitting ? 'Sending Message...' : 'Send Inquiry to BITTAALO'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
