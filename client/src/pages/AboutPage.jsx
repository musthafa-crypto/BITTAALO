import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Target, Sparkles, ArrowRight } from 'lucide-react';
import { SEO } from '../components/SEO';

export const AboutPage = () => {
  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen py-12">
      <SEO
        title="About Us"
        description="Learn about BITTAALO - India's modern lifestyle accessories brand crafted with industrial precision and street luxury."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <span className="text-brand-600 font-extrabold text-xs uppercase tracking-widest">
            The BITTAALO Story
          </span>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-zinc-950 uppercase tracking-tight">
            Accessories For The Modern Pioneer
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            Born out of a relentless obsession with tactile details, industrial silhouettes, and effortless street prestige, BITTAALO is redefining everyday lifestyle carry in India.
          </p>
        </div>

        {/* Brand Banner Image */}
        <div className="aspect-[16/9] rounded-3xl overflow-hidden shadow-xl bg-zinc-900 border border-zinc-200">
          <img
            src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80"
            alt="BITTAALO Design Studio"
            className="w-full h-full object-cover brightness-75"
          />
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-zinc-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-950 text-brand-400 flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-bold text-sm text-zinc-950 uppercase tracking-wider">Uncompromising Build</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              From hand-finished Italian acetate and 316L hypoallergenic surgical steel to 450GSM loopback cotton, our materials are torture-tested for endurance.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-zinc-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-950 text-brand-400 flex items-center justify-center">
              <Target size={20} />
            </div>
            <h3 className="font-bold text-sm text-zinc-950 uppercase tracking-wider">Precision Ergonomics</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Every curve, bevel cut, and hinge tension is calibrated for day-long comfort in warm Indian weather, road trips, and daily city commutes.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-zinc-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-950 text-brand-400 flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <h3 className="font-bold text-sm text-zinc-950 uppercase tracking-wider">Direct To Consumer</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              No retail markups or middlemen. We deliver genuine luxury accessory craftsmanship directly to your doorstep across all Indian pincodes.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 sm:p-10 rounded-3xl bg-zinc-950 text-white text-center space-y-4">
          <h2 className="font-display font-black text-2xl uppercase tracking-wider">
            Ready To Upgrade Your Everyday Carry?
          </h2>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Discover our curated lineup of 12 distinct lifestyle categories, backed by free delivery on orders above ₹999.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-400 hover:bg-brand-500 text-black text-xs font-black uppercase tracking-widest rounded-xl transition-all"
          >
            <span>Explore Catalog</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
