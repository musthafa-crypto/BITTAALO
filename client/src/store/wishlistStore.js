import { create } from 'zustand';
import api from '../utils/axios';

const WISHLIST_STORAGE_KEY = 'bittaalo_guest_wishlist';

const getLocalWishlist = () => {
  try {
    const data = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveLocalWishlist = (items) => {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('Local wishlist save error:', e);
  }
};

export const useWishlistStore = create((set, get) => ({
  items: getLocalWishlist(),

  isWishlisted: (productId) => {
    return get().items.some((item) => (item._id || item.id || item) === productId);
  },

  toggleWishlist: async (product, isAuthenticated = false) => {
    const productId = product._id || product.id;
    const current = [...get().items];
    const exists = current.some((item) => (item._id || item.id || item) === productId);

    let updated;
    if (exists) {
      updated = current.filter((item) => (item._id || item.id || item) !== productId);
    } else {
      updated = [...current, product];
    }

    set({ items: updated });
    saveLocalWishlist(updated);

    if (isAuthenticated) {
      try {
        await api.post('/wishlist/toggle', { productId });
      } catch (e) {
        console.warn('DB Wishlist toggle error:', e.message);
      }
    }

    return !exists;
  },

  fetchWishlist: async () => {
    try {
      const res = await api.get('/wishlist');
      if (res.data?.success && res.data.wishlist) {
        set({ items: res.data.wishlist });
        saveLocalWishlist(res.data.wishlist);
      }
    } catch (e) {
      console.warn('Wishlist fetch error:', e.message);
    }
  },
}));
