import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export const ProductCard = ({ product }) => {
  const { addItem } = useCartStore();
  const { isWishlisted, toggleWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  const inWishlist = isWishlisted(product._id);
  const activePrice = product.discountPrice || product.price;
  const originalPrice = product.discountPrice ? product.price : null;
  const discountPercent = originalPrice
    ? Math.round(((originalPrice - activePrice) / originalPrice) * 100)
    : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock < 1) {
      toast.error('This product is currently out of stock');
      return;
    }

    const defaultVariant = product.variants?.[0]
      ? { name: product.variants[0].name, value: product.variants[0].options[0] }
      : null;

    addItem(product, 1, defaultVariant, isAuthenticated);
    toast.success(`Added ${product.name} to bag!`, {
      icon: '🛍️',
      style: {
        background: '#18181B',
        color: '#FFFFFF',
        borderRadius: '8px',
        fontSize: '13px',
      },
    });
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const added = await toggleWishlist(product, isAuthenticated);
    if (added) {
      toast.success('Saved to your wishlist', { icon: '❤️' });
    } else {
      toast('Removed from wishlist', { icon: '💔' });
    }
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-xl overflow-hidden border border-zinc-200/80 shadow-sm hover:shadow-xl hover:border-zinc-300 transition-all duration-300">
      {/* Product Image & Badges */}
      <Link to={`/product/${product.slug}`} className="relative aspect-square overflow-hidden bg-zinc-100">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Badges Container */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {discountPercent && (
            <span className="bg-brand-400 text-black font-extrabold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-zinc-950 text-white font-bold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded shadow-sm">
              NEW
            </span>
          )}
          {product.isBestSeller && !product.isNewArrival && (
            <span className="bg-amber-600 text-white font-bold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded shadow-sm">
              BESTSELLER
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label="Save to Wishlist"
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-zinc-700 hover:text-red-500 hover:scale-110 active:scale-95 transition-all shadow-sm"
        >
          <Heart
            size={16}
            className={inWishlist ? 'fill-red-500 text-red-500' : 'text-zinc-600'}
          />
        </button>

        {/* Out of Stock Overlay */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-zinc-900 text-zinc-300 font-bold text-xs uppercase px-3 py-1.5 rounded tracking-widest border border-zinc-700">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick Add To Cart Hover Button (Desktop) */}
        {product.stock > 0 && (
          <div className="absolute inset-x-3 bottom-3 z-10 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden sm:block">
            <button
              onClick={handleAddToCart}
              className="w-full py-2.5 px-4 bg-zinc-900/95 hover:bg-black text-white text-xs font-bold tracking-wider uppercase rounded-lg shadow-lg flex items-center justify-center gap-2 hover:shadow-glow transition-all"
            >
              <ShoppingBag size={14} />
              Quick Add
            </button>
          </div>
        )}
      </Link>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category tag */}
        <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
          {product.category?.name || 'Accessories'}
        </span>

        {/* Product Title */}
        <Link
          to={`/product/${product.slug}`}
          className="font-medium text-sm text-zinc-900 hover:text-brand-500 line-clamp-1 transition-colors duration-200"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-1.5 mt-1.5 mb-3 text-xs text-zinc-500">
          <div className="flex items-center text-amber-500">
            <Star size={13} className="fill-current" />
            <span className="ml-1 font-semibold text-zinc-800 text-xs">
              {product.ratingsAverage || 4.8}
            </span>
          </div>
          <span>•</span>
          <span className="text-[11px]">({product.ratingsQuantity || 12})</span>
        </div>

        {/* Price & Mobile Add Button */}
        <div className="mt-auto pt-2 border-t border-zinc-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-extrabold text-zinc-900">
              ₹{activePrice.toLocaleString('en-IN')}
            </span>
            {originalPrice && (
              <span className="text-xs text-zinc-400 line-through">
                ₹{originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Mobile visible Add to Cart icon button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="sm:hidden w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center hover:bg-black disabled:bg-zinc-300 transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingBag size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
