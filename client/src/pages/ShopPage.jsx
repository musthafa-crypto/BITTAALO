import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Filter, X, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { fetchProducts, fetchCategories } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { SEO } from '../components/SEO';
import { ProductGridSkeleton } from '../components/LoadingSkeleton';

export const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // URL Params state
  const selectedCategory = searchParams.get('category') || '';
  const searchKeyword = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const inStock = searchParams.get('inStock') === 'true';

  // Local filter states for price range
  const [priceRange, setPriceRange] = useState({
    min: minPrice,
    max: maxPrice,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['products', { category: selectedCategory, search: searchKeyword, sort, page, minPrice, maxPrice, inStock }],
    queryFn: () =>
      fetchProducts({
        category: selectedCategory,
        search: searchKeyword,
        sort,
        page,
        minPrice,
        maxPrice,
        inStock: inStock ? 'true' : undefined,
        limit: 12,
      }),
  });

  const products = data?.products || [];
  const totalPages = data?.pages || 1;
  const totalCount = data?.total || 0;

  const updateParam = (key, val) => {
    const newParams = new URLSearchParams(searchParams);
    if (val !== undefined && val !== null && val !== '') {
      newParams.set(key, val);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // Reset to page 1 on filter
    setSearchParams(newParams);
  };

  const handlePriceApply = () => {
    const newParams = new URLSearchParams(searchParams);
    if (priceRange.min) newParams.set('minPrice', priceRange.min);
    else newParams.delete('minPrice');

    if (priceRange.max) newParams.set('maxPrice', priceRange.max);
    else newParams.delete('maxPrice');

    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setPriceRange({ min: '', max: '' });
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(
    selectedCategory || searchKeyword || minPrice || maxPrice || inStock || sort !== 'newest'
  );

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen py-8">
      <SEO
        title="Shop Luxury Lifestyle Accessories"
        description="Browse all 12 categories of accessories including sunglasses, caps, Cuban chains, stealth watches, RFID wallets, tactical cargo shorts and footwear."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Controls */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-zinc-200">
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-zinc-950 uppercase tracking-tight">
              {selectedCategory
                ? categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory
                : searchKeyword
                ? `Results for "${searchKeyword}"`
                : 'All Accessories'}
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Showing {products.length} of {totalCount} items
            </p>
          </div>

          {/* Right Action Controls: Mobile Filter Toggle & Sort Dropdown */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-bold text-zinc-800 shadow-sm"
            >
              <Filter size={14} />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-brand-500" />
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-zinc-200 rounded-lg shadow-sm text-xs">
              <ArrowUpDown size={14} className="text-zinc-500" />
              <label htmlFor="sortSelect" className="text-zinc-500 font-medium">Sort:</label>
              <select
                id="sortSelect"
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="bg-transparent font-bold text-zinc-900 focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Active Filters:
            </span>

            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-900 text-white text-xs font-medium">
                Category: {selectedCategory}
                <button onClick={() => updateParam('category', '')} className="hover:text-brand-400">
                  <X size={12} />
                </button>
              </span>
            )}

            {searchKeyword && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-900 text-white text-xs font-medium">
                Search: {searchKeyword}
                <button onClick={() => updateParam('search', '')} className="hover:text-brand-400">
                  <X size={12} />
                </button>
              </span>
            )}

            {(minPrice || maxPrice) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-900 text-white text-xs font-medium">
                ₹{minPrice || 0} - ₹{maxPrice || '5000+'}
                <button
                  onClick={() => {
                    setPriceRange({ min: '', max: '' });
                    const p = new URLSearchParams(searchParams);
                    p.delete('minPrice');
                    p.delete('maxPrice');
                    setSearchParams(p);
                  }}
                  className="hover:text-brand-400"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {inStock && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-900 text-white text-xs font-medium">
                In Stock Only
                <button onClick={() => updateParam('inStock', '')} className="hover:text-brand-400">
                  <X size={12} />
                </button>
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="text-xs text-red-600 hover:underline font-bold ml-2"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Layout: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1 space-y-6 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm self-start sticky top-28">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="font-bold text-xs uppercase tracking-widest text-zinc-900 flex items-center gap-2">
                <SlidersHorizontal size={14} /> Filter Catalog
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] text-zinc-400 hover:text-black"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Categories Filter */}
            <div>
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-3">
                Categories
              </h4>
              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                <button
                  onClick={() => updateParam('category', '')}
                  className={`w-full text-left text-xs py-1.5 px-2 rounded-md transition-colors flex justify-between items-center ${
                    !selectedCategory ? 'bg-zinc-900 text-white font-bold' : 'text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  <span>All Categories</span>
                  <span>{categories.reduce((a, b) => a + (b.productCount || 0), 0)}</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => updateParam('category', cat.slug)}
                    className={`w-full text-left text-xs py-1.5 px-2 rounded-md transition-colors flex justify-between items-center ${
                      selectedCategory === cat.slug
                        ? 'bg-zinc-900 text-white font-bold'
                        : 'text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[11px] opacity-70">{cat.productCount}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="pt-4 border-t border-zinc-100">
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-3">
                Price (INR ₹)
              </h4>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  type="number"
                  placeholder="Min ₹"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                />
                <input
                  type="number"
                  placeholder="Max ₹"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                />
              </div>
              <button
                onClick={handlePriceApply}
                className="w-full py-1.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
              >
                Apply Range
              </button>
            </div>

            {/* Availability Filter */}
            <div className="pt-4 border-t border-zinc-100">
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-3">
                Availability
              </h4>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-700">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : '')}
                  className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 w-4 h-4"
                />
                <span>Exclude Out of Stock</span>
              </label>
            </div>
          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <ProductGridSkeleton count={8} />
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
                <h3 className="font-bold text-base text-zinc-900 mb-2">No accessories found</h3>
                <p className="text-xs text-zinc-500 mb-6 max-w-sm mx-auto">
                  We couldn't find any items matching your selected criteria. Try adjusting your filters or search keywords.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {products.map((prod) => (
                  <ProductCard key={prod._id} product={prod} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => updateParam('page', page - 1)}
                  className="p-2 border border-zinc-300 rounded-lg hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  const pNum = i + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => updateParam('page', pNum)}
                      className={`w-9 h-9 rounded-lg text-xs font-bold transition-colors ${
                        page === pNum
                          ? 'bg-zinc-950 text-white'
                          : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                <button
                  disabled={page >= totalPages}
                  onClick={() => updateParam('page', page + 1)}
                  className="p-2 border border-zinc-300 rounded-lg hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-zinc-200">
                <h3 className="font-bold text-sm text-zinc-900 uppercase tracking-wider">
                  Filters
                </h3>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2">
                  Category
                </h4>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  <button
                    onClick={() => {
                      updateParam('category', '');
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full text-left text-xs py-1.5 px-2 rounded ${
                      !selectedCategory ? 'bg-zinc-900 text-white font-bold' : 'text-zinc-600'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => {
                        updateParam('category', c.slug);
                        setMobileFilterOpen(false);
                      }}
                      className={`w-full text-left text-xs py-1.5 px-2 rounded ${
                        selectedCategory === c.slug
                          ? 'bg-zinc-900 text-white font-bold'
                          : 'text-zinc-600'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2">
                  Price
                </h4>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="number"
                    placeholder="Min ₹"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="p-2 border border-zinc-200 rounded text-xs"
                  />
                  <input
                    type="number"
                    placeholder="Max ₹"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="p-2 border border-zinc-200 rounded text-xs"
                  />
                </div>
                <button
                  onClick={() => {
                    handlePriceApply();
                    setMobileFilterOpen(false);
                  }}
                  className="w-full py-2 bg-zinc-900 text-white text-xs font-bold rounded"
                >
                  Apply
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                clearAllFilters();
                setMobileFilterOpen(false);
              }}
              className="w-full py-2.5 border border-zinc-300 text-xs font-bold uppercase rounded mt-6"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
