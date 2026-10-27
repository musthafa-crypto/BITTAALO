import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Heart,
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Share2,
  AlertCircle,
  Plus,
  Minus,
  MessageSquare,
} from 'lucide-react';
import {
  fetchProductBySlug,
  fetchRelatedProducts,
  fetchProductReviews,
  submitProductReview,
} from '../services/api';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';
import { ProductCard } from '../components/ProductCard';
import { SEO } from '../components/SEO';
import toast from 'react-hot-toast';

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();

  const { addItem } = useCartStore();
  const { isWishlisted, toggleWishlist } = useWishlistStore();
  const { isAuthenticated, user } = useAuthStore();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Review submission state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  // Fetch product
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetchProductBySlug(slug),
  });

  // Fetch related products
  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['related-products', product?._id],
    queryFn: () => fetchRelatedProducts(product._id),
    enabled: !!product?._id,
  });

  // Fetch reviews
  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', product?._id],
    queryFn: () => fetchProductReviews(product._id),
    enabled: !!product?._id,
  });

  // Submit review mutation
  const reviewMutation = useMutation({
    mutationFn: (data) => submitProductReview(product._id, data),
    onSuccess: () => {
      toast.success('Your review has been submitted!');
      setShowReviewForm(false);
      setReviewTitle('');
      setReviewComment('');
      queryClient.invalidateQueries({ queryKey: ['reviews', product._id] });
      queryClient.invalidateQueries({ queryKey: ['product', slug] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square bg-zinc-200 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-4 bg-zinc-200 rounded w-1/4" />
            <div className="h-8 bg-zinc-200 rounded w-3/4" />
            <div className="h-6 bg-zinc-200 rounded w-1/3" />
            <div className="h-24 bg-zinc-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-zinc-900 mb-2">Product Not Found</h2>
        <p className="text-xs text-zinc-500 mb-6">The accessory you are looking for may have been retired or moved.</p>
        <Link to="/shop" className="px-6 py-2.5 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase">
          Back to Shop
        </Link>
      </div>
    );
  }

  const activePrice = product.discountPrice || product.price;
  const originalPrice = product.discountPrice ? product.price : null;
  const discountPercent = originalPrice
    ? Math.round(((originalPrice - activePrice) / originalPrice) * 100)
    : null;
  const inWishlist = isWishlisted(product._id);

  // Initialize first option for variants if not selected
  const getSelectedVariant = (varName) => {
    return selectedVariants[varName] || product.variants?.find((v) => v.name === varName)?.options[0];
  };

  const handleAddToCart = () => {
    if (product.stock < 1) {
      toast.error('Product is out of stock');
      return;
    }

    const variantPayload = product.variants?.[0]
      ? {
          name: product.variants[0].name,
          value: getSelectedVariant(product.variants[0].name),
        }
      : null;

    addItem(product, quantity, variantPayload, isAuthenticated);
    toast.success(`Added ${product.name} to bag!`, { icon: '🛍️' });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on BITTAALO:`,
          url: window.location.href,
        });
      } catch {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to leave a verified review');
      return;
    }
    reviewMutation.mutate({
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewComment,
    });
  };

  return (
    <div className="w-full bg-[#FAFAFA] py-8 sm:py-12">
      <SEO
        title={product.name}
        description={product.shortDescription || product.description?.slice(0, 160)}
        image={product.images?.[0]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
          <Link to="/" className="hover:text-zinc-900">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-zinc-900">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category?.slug}`} className="hover:text-zinc-900">
            {product.category?.name}
          </Link>
          <span>/</span>
          <span className="text-zinc-900 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Top Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 bg-white p-6 sm:p-10 rounded-3xl border border-zinc-200/80 shadow-sm">
          {/* Left: Image Gallery */}
          <div className="flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      selectedImageIndex === idx ? 'border-zinc-950 scale-105' : 'border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image */}
            <div className="relative flex-1 aspect-square rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 group">
              <img
                src={product.images?.[selectedImageIndex] || product.images?.[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
              />

              {/* Wishlist and Share Floating Buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={() => toggleWishlist(product, isAuthenticated)}
                  aria-label="Save to Wishlist"
                  className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-zinc-700 hover:text-red-500 shadow-md transition-all active:scale-95"
                >
                  <Heart
                    size={18}
                    className={inWishlist ? 'fill-red-500 text-red-500' : 'text-zinc-700'}
                  />
                </button>
                <button
                  onClick={handleShare}
                  aria-label="Share product"
                  className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-zinc-700 hover:text-black shadow-md transition-all active:scale-95"
                >
                  <Share2 size={16} />
                </button>
              </div>

              {discountPercent && (
                <span className="absolute top-4 left-4 bg-brand-400 text-black font-black text-xs tracking-wider uppercase px-2.5 py-1 rounded shadow-md">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Right: Product Buy Box Details */}
          <div className="flex flex-col justify-start">
            {/* Category tag & SKU */}
            <div className="flex items-center justify-between text-xs text-zinc-400 uppercase tracking-widest mb-2">
              <Link to={`/shop?category=${product.category?.slug}`} className="hover:text-brand-600 font-bold">
                {product.category?.name}
              </Link>
              {product.sku && <span>SKU: {product.sku}</span>}
            </div>

            {/* Title */}
            <h1 className="font-display font-black text-2xl sm:text-3xl text-zinc-950 tracking-tight mb-3">
              {product.name}
            </h1>

            {/* Ratings Summary */}
            <div className="flex items-center gap-3 mb-4 text-xs">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.floor(product.ratingsAverage || 5) ? 'fill-current' : 'text-zinc-300'}
                  />
                ))}
                <span className="ml-1.5 font-bold text-zinc-900">{product.ratingsAverage || 4.8}</span>
              </div>
              <span className="text-zinc-300">|</span>
              <a href="#reviews" onClick={() => setActiveTab('reviews')} className="text-zinc-600 hover:underline">
                {reviews.length || product.ratingsQuantity || 12} customer reviews
              </a>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-3 mb-4 pb-4 border-b border-zinc-100">
              <span className="text-2xl sm:text-3xl font-black text-zinc-950">
                ₹{activePrice.toLocaleString('en-IN')}
              </span>
              {originalPrice && (
                <span className="text-base text-zinc-400 line-through">
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-[11px] text-zinc-500 font-medium">
                (Inclusive of all taxes & GST)
              </span>
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-6">
              {product.shortDescription || product.description}
            </p>

            {/* Variants Selector */}
            {product.variants?.map((variant) => (
              <div key={variant.name} className="mb-5">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-900 mb-2">
                  <span>{variant.name}:</span>
                  <span className="text-zinc-500 font-medium">{getSelectedVariant(variant.name)}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {variant.options.map((opt) => {
                    const isSelected = getSelectedVariant(variant.name) === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() =>
                          setSelectedVariants({ ...selectedVariants, [variant.name]: opt })
                        }
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-zinc-950 text-white shadow-sm ring-2 ring-zinc-950 ring-offset-1'
                            : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Stock Urgency indicator */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  {product.stock <= 5 ? (
                    <span className="text-amber-700">Only {product.stock} left in stock - order soon!</span>
                  ) : (
                    <span className="text-emerald-700">In Stock & Ready for Immediate Dispatch</span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-semibold text-red-600">
                  <AlertCircle size={14} />
                  <span>Currently Out of Stock</span>
                </div>
              )}
            </div>

            {/* Quantity Stepper & Add to Bag CTA */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-zinc-300 rounded-xl bg-zinc-50 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-zinc-600 hover:text-black"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="px-4 text-xs font-extrabold text-zinc-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2 text-zinc-600 hover:text-black"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 py-3.5 px-6 bg-zinc-950 hover:bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg hover:shadow-glow flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:bg-zinc-300 disabled:pointer-events-none"
              >
                <ShoppingBag size={16} />
                <span>{product.stock > 0 ? 'Add to Bag' : 'Out of Stock'}</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-center text-[11px] text-zinc-600">
              <div className="flex flex-col items-center gap-1">
                <Truck size={16} className="text-brand-500" />
                <span className="font-bold text-zinc-900">Free Shipping</span>
                <span className="text-[10px] text-zinc-400">On orders &gt; ₹999</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck size={16} className="text-brand-500" />
                <span className="font-bold text-zinc-900">100% Authentic</span>
                <span className="text-[10px] text-zinc-400">Verified Quality</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw size={16} className="text-brand-500" />
                <span className="font-bold text-zinc-900">7-Day Returns</span>
                <span className="text-[10px] text-zinc-400">Easy Doorstep Pickup</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Info: Description, Specifications, Reviews */}
        <div id="reviews" className="mt-12 bg-white rounded-3xl p-6 sm:p-10 border border-zinc-200/80 shadow-sm">
          <div className="flex border-b border-zinc-200 gap-8 mb-8 text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-3 transition-colors ${
                activeTab === 'description'
                  ? 'border-b-2 border-zinc-950 text-zinc-950'
                  : 'text-zinc-400 hover:text-zinc-700'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 transition-colors flex items-center gap-1.5 ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-zinc-950 text-zinc-950'
                  : 'text-zinc-400 hover:text-zinc-700'
              }`}
            >
              <span>Reviews ({reviews.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-3 transition-colors ${
                activeTab === 'shipping'
                  ? 'border-b-2 border-zinc-950 text-zinc-950'
                  : 'text-zinc-400 hover:text-zinc-700'
              }`}
            >
              Shipping & Delivery
            </button>
          </div>

          {activeTab === 'description' && (
            <div className="text-zinc-700 text-xs sm:text-sm leading-relaxed space-y-4 max-w-3xl">
              <p>{product.description}</p>
              {product.tags?.length > 0 && (
                <div className="pt-4 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mr-2">Tags:</span>
                  {product.tags.map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded bg-zinc-100 text-zinc-600 text-[11px]">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Review Header & Write Review Action */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-zinc-100">
                <div>
                  <h3 className="font-bold text-base text-zinc-900">Customer Ratings & Reviews</h3>
                  <p className="text-xs text-zinc-500">Real feedback from verified purchasers in India</p>
                </div>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-5 py-2.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2"
                >
                  <MessageSquare size={14} />
                  <span>{showReviewForm ? 'Cancel' : 'Write a Review'}</span>
                </button>
              </div>

              {/* Review Submission Form */}
              {showReviewForm && (
                <form
                  onSubmit={handleReviewSubmit}
                  className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4 animate-fade-in"
                >
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Leave Your Feedback</h4>

                  <div>
                    <label className="text-xs text-zinc-600 block mb-1">Rating</label>
                    <div className="flex gap-1 text-amber-500 cursor-pointer">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className="hover:scale-110 transition-transform"
                        >
                          <Star size={20} className={star <= reviewRating ? 'fill-current' : 'text-zinc-300'} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-zinc-600 block mb-1">Review Headline</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Incredible quality, definitely worth the price"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      className="w-full p-2.5 bg-white border border-zinc-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-600 block mb-1">Your Detailed Experience</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Tell us about the fit, material feel, packaging..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full p-2.5 bg-white border border-zinc-300 rounded-lg text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reviewMutation.isPending}
                    className="px-6 py-2.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold uppercase rounded-lg disabled:opacity-50"
                  >
                    {reviewMutation.isPending ? 'Submitting...' : 'Post Verified Review'}
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-4">No reviews yet. Be the first to review this product!</p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev._id} className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-zinc-900">{rev.user?.name || 'Customer'}</span>
                          {rev.verifiedPurchase && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                              <Check size={10} /> Verified Purchase
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-zinc-400">
                          {new Date(rev.createdAt).toLocaleDateString('en-IN')}
                        </span>
                      </div>

                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className={i < rev.rating ? 'fill-current' : 'text-zinc-300'} />
                        ))}
                      </div>

                      <h5 className="font-bold text-xs text-zinc-900">{rev.title}</h5>
                      <p className="text-xs text-zinc-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="text-zinc-700 text-xs sm:text-sm leading-relaxed space-y-4 max-w-2xl">
              <h4 className="font-bold text-zinc-900 text-sm">Domestic Delivery Across India</h4>
              <p>We partner with premium couriers including Bluedart, Delhivery, and DTDC to ensure quick, damage-free delivery to all pincodes in India.</p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li><strong>Metro Cities (Mumbai, Bengaluru, Delhi, Hyderabad, Chennai):</strong> 2 to 3 business days.</li>
                <li><strong>Rest of India:</strong> 4 to 6 business days.</li>
                <li><strong>Tracking:</strong> Real-time SMS and WhatsApp updates dispatched upon pickup.</li>
                <li><strong>Cash on Delivery:</strong> Available nationwide without surcharge.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Related Products Recommendation */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h3 className="font-display font-black text-xl sm:text-2xl text-zinc-950 uppercase tracking-tight mb-8">
              Complete The Look (Related Gear)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel._id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
