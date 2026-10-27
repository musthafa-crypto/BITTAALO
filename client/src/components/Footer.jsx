import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Send, ShieldCheck, Truck, RefreshCw, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    toast.success('Thank you for subscribing to BITTAALO Drop Alerts!', {
      icon: '🔥',
    });
    setEmail('');
  };

  return (
    <footer className="bg-zinc-950 text-zinc-400 pt-16 pb-12 border-t border-zinc-900">
      {/* Value Proposition Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mb-12 border-b border-zinc-900 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-brand-400 flex-shrink-0">
            <Truck size={20} />
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Free Shipping</h4>
            <p className="text-[11px] text-zinc-500 mt-0.5">Complimentary delivery across India above ₹999</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-brand-400 flex-shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Authentic Gear</h4>
            <p className="text-[11px] text-zinc-500 mt-0.5">100% premium grade materials & durability tested</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-brand-400 flex-shrink-0">
            <RefreshCw size={20} />
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">7-Day Returns</h4>
            <p className="text-[11px] text-zinc-500 mt-0.5">Hassle-free exchanges and doorstep pickup</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-brand-400 flex-shrink-0">
            <Lock size={20} />
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Secure Checkout</h4>
            <p className="text-[11px] text-zinc-500 mt-0.5">Razorpay encrypted UPI, Cards & Cash on Delivery</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Information & Contacts */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center font-black text-brand-400 text-lg border border-zinc-800">
              B
            </div>
            <span className="font-display font-black text-2xl tracking-[0.25em] text-white">
              BITTAALO
            </span>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mb-6">
            BITTAALO is an Indian lifestyle accessories brand born at the intersection of minimalist luxury and tactical streetwear. Designed for everyday elevation.
          </p>

          <div className="flex flex-col gap-2.5 text-xs">
            <a
              href="https://wa.me/919037489104"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 hover:text-white transition-colors"
            >
              <Phone size={14} className="text-brand-400" />
              <span>+91 9037489104 (WhatsApp Support)</span>
            </a>
            <a
              href="mailto:bittaalo@gmail.com"
              className="flex items-center gap-2.5 hover:text-white transition-colors"
            >
              <Mail size={14} className="text-brand-400" />
              <span>bittaalo@gmail.com</span>
            </a>
            <div className="flex items-center gap-2.5 text-zinc-500">
              <MapPin size={14} className="text-brand-400" />
              <span>Bengaluru & Mumbai, India</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">
            Explore
          </h4>
          <ul className="flex flex-col gap-2 text-xs">
            <li><Link to="/shop" className="hover:text-white transition-colors">All Products</Link></li>
            <li><Link to="/shop?category=sunglasses" className="hover:text-white transition-colors">Sunglasses</Link></li>
            <li><Link to="/shop?category=watches" className="hover:text-white transition-colors">Watches</Link></li>
            <li><Link to="/shop?category=jewellery" className="hover:text-white transition-colors">Jewellery</Link></li>
            <li><Link to="/shop?category=caps" className="hover:text-white transition-colors">Caps & Hats</Link></li>
            <li><Link to="/shop?category=wallets" className="hover:text-white transition-colors">RFID Wallets</Link></li>
            <li><Link to="/shop?category=footwear" className="hover:text-white transition-colors">Recovery Slides</Link></li>
          </ul>
        </div>

        {/* Support & Policies */}
        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">
            Customer Care
          </h4>
          <ul className="flex flex-col gap-2 text-xs">
            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact & Help</Link></li>
            <li><Link to="/faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
            <li><Link to="/shipping-returns" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">
            The VIP Drop List
          </h4>
          <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
            Get early access to secret drops, discount codes, and seasonal lookbooks.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 pl-3 pr-10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-400"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-brand-400 text-black rounded-md hover:bg-brand-500 transition-colors"
              >
                <Send size={14} />
              </button>
            </div>
            <span className="text-[10px] text-zinc-600">No spam. Only limited releases. Unsubscribe anytime.</span>
          </form>
        </div>
      </div>

      {/* Bottom Strip: Payment Icons & Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <p>© {new Date().getFullYear()} BITTAALO Lifestyle Accessories. All rights reserved.</p>

        {/* Payment Accepted Badges */}
        <div className="flex items-center gap-3 text-[11px] font-semibold text-zinc-400">
          <span className="px-2 py-1 bg-zinc-900 rounded border border-zinc-800">UPI</span>
          <span className="px-2 py-1 bg-zinc-900 rounded border border-zinc-800">Razorpay</span>
          <span className="px-2 py-1 bg-zinc-900 rounded border border-zinc-800">RuPay</span>
          <span className="px-2 py-1 bg-zinc-900 rounded border border-zinc-800">Cards</span>
          <span className="px-2 py-1 bg-zinc-900 rounded border border-zinc-800">Cash on Delivery</span>
        </div>
      </div>
    </footer>
  );
};
