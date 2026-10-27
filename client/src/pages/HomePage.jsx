import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Shield, Zap, Flame, Award, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  fetchBanners,
  fetchCategories,
  fetchFeaturedProducts,
  fetchNewArrivals,
  fetchBestSellers,
} from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { SEO } from '../components/SEO';
import { ProductGridSkeleton, CategoryGridSkeleton } from '../components/LoadingSkeleton';

export const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Queries
  const { data: banners = [] } = useQuery({ queryKey: ['banners'], queryFn: fetchBanners });
  const { data: categories = [], isLoading: catLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });
  const { data: featured = [], isLoading: featLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: fetchFeaturedProducts,
  });
  const { data: newArrivals = [], isLoading: newLoading } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: fetchNewArrivals,
  });
  const { data: bestSellers = [], isLoading: bestLoading } = useQuery({
    queryKey: ['best-sellers'],
    queryFn: fetchBestSellers,
  });

  // Fallback banners if none loaded
  const displayBanners =
    banners.length > 0
      ? banners
      : [
          {
            title: 'NEW WAVE ACCESSORIES',
            subtitle: 'Engineered for the streets of India. Minimalist luxury meets industrial aesthetics.',
            image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1600&q=85',
            link: '/shop',
            buttonText: 'Explore Collection',
            badge: 'DROP 01 // LIVE',
          },
          {
            title: 'TIMELESS CHRONOS & SHADES',
            subtitle: 'Polarized optics, titanium aviators, and precision stealth timepieces.',
            image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1600&q=85',
            link: '/shop?category=watches',
            buttonText: 'View Timepieces',
            badge: 'BEST SELLERS',
          },
          {
            title: 'TACTICAL HEAVYWEIGHT ESSENTIALS',
            subtitle: '450GSM loopback cotton, cobra-buckle belts and molded cloud recovery footwear.',
            image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=1600&q=85',
            link: '/shop?category=shorts',
            buttonText: 'Shop Essentials',
            badge: 'NEW ARRIVALS',
          },
        ];

  // Auto rotate banners
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displayBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [displayBanners.length]);

  return (
    <div className="flex flex-col w-full">
      <SEO
        title="Luxury Streetwear & Lifestyle Accessories India"
        description="Discover BITTAALO - India's premium lifestyle accessories brand. Sunglasses, Cuban links, tactical dad caps, RFID cardholders, automatic timepieces, and slides."
      />

      {/* 1. HERO SLIDER */}
      <section className="relative w-full h-[75vh] min-h-[500px] max-h-[750px] bg-zinc-950 overflow-hidden">
        {displayBanners.map((banner, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background image with gradient overlay */}
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover object-center brightness-[0.55]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

            {/* Slide Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl flex flex-col items-start gap-4 animate-fade-in">
                  {banner.badge && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-400 text-black font-extrabold text-[11px] tracking-widest uppercase shadow-glow">
                      <Zap size={12} className="fill-current" />
                      {banner.badge}
                    </span>
                  )}
                  <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-wider leading-[1.1] uppercase">
                    {banner.title}
                  </h1>
                  <p className="text-zinc-300 text-sm sm:text-base font-light leading-relaxed max-w-lg">
                    {banner.subtitle}
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                    <Link
                      to={banner.link || '/shop'}
                      className="px-8 py-3.5 bg-brand-400 hover:bg-brand-500 text-black font-extrabold text-xs tracking-widest uppercase rounded-lg shadow-lg hover:shadow-glow flex items-center gap-2 transition-all active:scale-95"
                    >
                      <span>{banner.buttonText || 'Shop Collection'}</span>
                      <ArrowRight size={16} />
                    </Link>
                    <Link
                      to="/shop"
                      className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs tracking-widest uppercase rounded-lg backdrop-blur-md transition-all"
                    >
                      View All
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Controls */}
        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Indicators */}
          <div className="flex gap-2">
            {displayBanners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentSlide ? 'w-8 bg-brand-400' : 'w-2 bg-white/40'
                }`}
              />
            ))}
          </div>

          {/* Prev / Next buttons */}
          <div className="flex gap-2">
            <button
              onClick={() =>
                setCurrentSlide((prev) => (prev - 1 + displayBanners.length) % displayBanners.length)
              }
              aria-label="Previous slide"
              className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 flex items-center justify-center transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % displayBanners.length)}
              aria-label="Next slide"
              className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 flex items-center justify-center transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* 2. PROMO STRIP */}
      <section className="bg-zinc-900 border-y border-zinc-800 py-4 text-zinc-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-around items-center gap-4 text-xs tracking-wider uppercase font-semibold">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-brand-400" />
            <span>100% Genuine Materials</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame size={16} className="text-brand-400" />
            <span>Limited Batch Street Drops</span>
          </div>
          <div className="flex items-center gap-2">
            <Award size={16} className="text-brand-400" />
            <span>Pan-India Cash on Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-brand-400" />
            <span>Same-Day Dispatch</span>
          </div>
        </div>
      </section>

      {/* 3. ALL 12 CATEGORIES GRID */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
            <div>
              <span className="text-brand-600 font-bold text-xs uppercase tracking-widest block mb-1">
                Explore The Arsenal
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-zinc-950 uppercase tracking-tight">
                Shop By Category
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-xs font-bold uppercase tracking-wider text-zinc-900 hover:text-brand-600 flex items-center gap-1 group"
            >
              View All 12 Collections
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {catLoading ? (
            <CategoryGridSkeleton count={12} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat._id || cat.slug}
                  to={`/shop?category=${cat.slug}`}
                  className="group relative aspect-[4/5] rounded-xl overflow-hidden bg-zinc-900 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={cat.image || 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=400&q=80'}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 brightness-75 group-hover:brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <h3 className="text-white text-xs sm:text-sm font-bold tracking-wider uppercase group-hover:text-brand-400 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] text-zinc-400 mt-0.5">
                      {cat.productCount ? `${cat.productCount} items` : 'Explore'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS SECTION */}
      <section className="py-16 bg-[#FAFAFA] border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
            <div>
              <span className="text-brand-600 font-bold text-xs uppercase tracking-widest block mb-1">
                Handpicked By BITTAALO
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-zinc-950 uppercase tracking-tight">
                Featured Accessories
              </h2>
            </div>
            <Link
              to="/shop?featured=true"
              className="text-xs font-bold uppercase tracking-wider text-zinc-900 hover:text-brand-600 flex items-center gap-1 group"
            >
              See All Featured
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {featLoading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {featured.slice(0, 8).map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. EDITORIAL CAMPAIGN BANNER */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden bg-zinc-950 text-white min-h-[380px] flex items-center shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=80"
              alt="Cuban Links Campaign"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-40 brightness-75"
            />
            <div className="relative max-w-xl p-8 sm:p-12 z-10">
              <span className="text-brand-400 font-extrabold text-xs uppercase tracking-widest block mb-2">
                STATEMENT PIECES
              </span>
              <h3 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-wider leading-tight mb-4">
                SOLID 316L SURGICAL STEEL & 18K GOLD PLATING
              </h3>
              <p className="text-zinc-300 text-xs sm:text-sm font-light leading-relaxed mb-6">
                Guaranteed zero rust, zero green skin, and engineered to endure sweat, workouts, and Indian weather with commanding street prestige.
              </p>
              <Link
                to="/shop?category=jewellery"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-brand-400 text-xs font-extrabold uppercase tracking-widest rounded-lg transition-colors"
              >
                Shop Jewellery Drop
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. NEW ARRIVALS */}
      <section className="py-16 bg-[#FAFAFA] border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
            <div>
              <span className="text-brand-600 font-bold text-xs uppercase tracking-widest block mb-1">
                Fresh From The Lab
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-zinc-950 uppercase tracking-tight">
                New Arrivals
              </h2>
            </div>
            <Link
              to="/shop?newarrival=true"
              className="text-xs font-bold uppercase tracking-wider text-zinc-900 hover:text-brand-600 flex items-center gap-1 group"
            >
              View Latest Drops
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {newLoading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {newArrivals.slice(0, 4).map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 7. BEST SELLERS */}
      <section className="py-16 bg-white border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
            <div>
              <span className="text-brand-600 font-bold text-xs uppercase tracking-widest block mb-1">
                Most Wanted
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-zinc-950 uppercase tracking-tight">
                Best Sellers
              </h2>
            </div>
            <Link
              to="/shop?bestseller=true"
              className="text-xs font-bold uppercase tracking-wider text-zinc-900 hover:text-brand-600 flex items-center gap-1 group"
            >
              Shop Top Rated
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {bestLoading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {bestSellers.slice(0, 4).map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="py-16 bg-zinc-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-brand-400 font-extrabold text-xs uppercase tracking-widest block mb-2">
            The Community
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-wider mb-12">
            What Our Customers Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between">
              <div>
                <div className="flex text-brand-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-current" />
                  ))}
                </div>
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mb-4">
                  "The Onyx Hex Polarized Sunglasses are legitimately top tier. The polarization is so clean while driving, and the frame weight feels like luxury designer eyewear."
                </p>
              </div>
              <div>
                <h4 className="font-bold text-xs text-white uppercase tracking-wider">Aakash Verma</h4>
                <p className="text-[11px] text-zinc-500">Bengaluru • Verified Buyer</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between">
              <div>
                <div className="flex text-brand-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-current" />
                  ))}
                </div>
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mb-4">
                  "Ordered the Tactical Cobra Belt and RAW Dad Cap. Delivered to Mumbai in 2 days via Bluedart. Both items are rugged and look killer with cargos."
                </p>
              </div>
              <div>
                <h4 className="font-bold text-xs text-white uppercase tracking-wider">Devendra Singh</h4>
                <p className="text-[11px] text-zinc-500">Mumbai • Verified Buyer</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between">
              <div>
                <div className="flex text-brand-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-current" />
                  ))}
                </div>
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mb-4">
                  "Customer support on WhatsApp was super responsive when I had a query about ring sizing. Got the Obsidian Signet Ring and it fits like a glove."
                </p>
              </div>
              <div>
                <h4 className="font-bold text-xs text-white uppercase tracking-wider">Priya Nair</h4>
                <p className="text-[11px] text-zinc-500">Kochi • Verified Buyer</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
