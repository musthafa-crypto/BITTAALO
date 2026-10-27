import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Loader2 } from 'lucide-react';
import { fetchSearchSuggestions } from '../services/api';

const POPULAR_SEARCHES = ['Sunglasses', 'Cuban Chain', 'Dad Cap', 'RFID Wallet', 'Recovery Slides', 'Tactical Shorts'];

export const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSuggestions([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await fetchSearchSuggestions(query);
        setSuggestions(results || []);
      } catch (e) {
        console.warn('Search error:', e);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelectProduct = (slug) => {
    onClose();
    navigate(`/product/${slug}`);
  };

  const handleQuickTagClick = (tag) => {
    onClose();
    navigate(`/shop?search=${encodeURIComponent(tag)}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative min-h-screen flex items-start justify-center pt-16 sm:pt-24 px-4 pb-6">
        <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-zinc-200">
          {/* Search Input Bar */}
          <form onSubmit={handleSubmit} className="flex items-center px-6 py-4 border-b border-zinc-200">
            <Search size={20} className="text-zinc-400 mr-3 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sunglasses, caps, chains, watches, shorts..."
              className="w-full text-sm sm:text-base text-zinc-900 placeholder-zinc-400 bg-transparent focus:outline-none"
            />
            {loading && <Loader2 size={18} className="text-zinc-400 animate-spin mr-2" />}
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-zinc-400 hover:text-zinc-600 mr-2"
              >
                <X size={16} />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-zinc-500 hover:text-black uppercase tracking-wider pl-2 border-l border-zinc-200"
            >
              ESC
            </button>
          </form>

          {/* Body Content */}
          <div className="p-6">
            {/* Real-time suggestions */}
            {suggestions.length > 0 ? (
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                  Matching Products
                </span>
                {suggestions.map((item) => (
                  <button
                    key={item._id}
                    onClick={() => handleSelectProduct(item.slug)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-zinc-50 text-left transition-colors group"
                  >
                    <img
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=150&q=80'}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover bg-zinc-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-zinc-900 group-hover:text-brand-600 truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-zinc-400">{item.category?.name}</p>
                    </div>
                    <span className="text-xs font-extrabold text-zinc-900">
                      ₹{(item.discountPrice || item.price).toLocaleString('en-IN')}
                    </span>
                  </button>
                ))}
              </div>
            ) : query.length >= 2 && !loading ? (
              <div className="py-8 text-center text-zinc-500 text-xs">
                No products found matching "<strong>{query}</strong>". Press Enter to view all results.
              </div>
            ) : (
              /* Popular quick searches */
              <div>
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block mb-3">
                  Trending Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleQuickTagClick(tag)}
                      className="px-3.5 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-xs font-medium text-zinc-800 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer View All */}
          {query.trim().length > 0 && (
            <div className="px-6 py-3 bg-zinc-50 border-t border-zinc-200 flex justify-between items-center text-xs">
              <span className="text-zinc-500">See all matches</span>
              <button
                onClick={handleSubmit}
                className="font-bold text-zinc-900 hover:text-brand-600 flex items-center gap-1"
              >
                View Results &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
