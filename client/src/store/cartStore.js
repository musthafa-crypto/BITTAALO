import { create } from 'zustand';
import api from '../utils/axios';

const CART_STORAGE_KEY = 'bittaalo_guest_cart';

const getLocalCart = () => {
  try {
    const data = localStorage.getItem(CART_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveLocalCart = (items) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('Local cart save failed:', e);
  }
};

export const useCartStore = create((set, get) => ({
  items: getLocalCart(),
  isDrawerOpen: false,
  appliedCoupon: null,

  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),

  // Subtotal Calculation
  getSubtotal: () => {
    return get().items.reduce((sum, item) => {
      const price = item.product?.discountPrice || item.product?.price || item.price || 0;
      return sum + price * (item.quantity || 1);
    }, 0);
  },

  // Shipping Calculation: Free above ₹999
  getShippingPrice: () => {
    const subtotal = get().getSubtotal();
    if (subtotal === 0) return 0;
    return subtotal >= 999 ? 0 : 99;
  },

  // Discount Calculation
  getDiscount: () => {
    const coupon = get().appliedCoupon;
    if (!coupon) return 0;
    return coupon.discountAmount || 0;
  },

  // Total Calculation
  getTotal: () => {
    const subtotal = get().getSubtotal();
    if (subtotal === 0) return 0;
    const shipping = get().getShippingPrice();
    const discount = get().getDiscount();
    return Math.max(0, subtotal + shipping - discount);
  },

  // Add Item to Bag
  addItem: async (product, quantity = 1, variant = null, isAuthenticated = false) => {
    const currentItems = [...get().items];
    const existingIndex = currentItems.findIndex(
      (item) =>
        (item.product?._id || item.product) === (product._id || product.id) &&
        (!variant || item.variant?.value === variant?.value)
    );

    if (existingIndex > -1) {
      currentItems[existingIndex].quantity += quantity;
    } else {
      currentItems.push({
        product,
        quantity,
        variant,
      });
    }

    set({ items: currentItems });
    saveLocalCart(currentItems);

    if (isAuthenticated) {
      try {
        await api.post('/cart/add', {
          productId: product._id || product.id,
          quantity,
          variant,
        });
      } catch (e) {
        console.warn('DB Cart add note:', e.message);
      }
    }

    set({ isDrawerOpen: true });
  },

  // Update Item Quantity
  updateQuantity: async (itemKey, quantity, isAuthenticated = false) => {
    if (quantity < 1) return;

    const currentItems = get().items.map((item, idx) => {
      const key = item._id || `${item.product?._id || item.product}-${item.variant?.value || idx}`;
      if (key === itemKey || item._id === itemKey) {
        return { ...item, quantity };
      }
      return item;
    });

    set({ items: currentItems });
    saveLocalCart(currentItems);

    if (isAuthenticated && itemKey) {
      try {
        await api.put(`/cart/item/${itemKey}`, { quantity });
      } catch (e) {
        console.warn('DB Cart update note:', e.message);
      }
    }
  },

  // Remove Item
  removeItem: async (itemKey, isAuthenticated = false) => {
    const currentItems = get().items.filter((item, idx) => {
      const key = item._id || `${item.product?._id || item.product}-${item.variant?.value || idx}`;
      return key !== itemKey && item._id !== itemKey;
    });

    set({ items: currentItems });
    saveLocalCart(currentItems);

    if (isAuthenticated && itemKey) {
      try {
        await api.delete(`/cart/item/${itemKey}`);
      } catch (e) {
        console.warn('DB Cart remove note:', e.message);
      }
    }
  },

  // Clear Bag
  clearCart: async (isAuthenticated = false) => {
    set({ items: [], appliedCoupon: null });
    saveLocalCart([]);

    if (isAuthenticated) {
      try {
        await api.delete('/cart/clear');
      } catch (e) {
        console.warn('DB Cart clear note:', e.message);
      }
    }
  },

  // Apply Coupon
  applyCoupon: async (couponCode) => {
    const subtotal = get().getSubtotal();
    const res = await api.post('/coupons/validate', {
      code: couponCode,
      cartTotal: subtotal,
    });

    if (res.data?.success) {
      set({ appliedCoupon: res.data.coupon });
      return res.data;
    }
    throw new Error(res.data?.message || 'Invalid coupon');
  },

  removeCoupon: () => set({ appliedCoupon: null }),

  // Sync Local Cart to Server on Login
  syncCartWithServer: async () => {
    try {
      const localItems = get().items;
      if (localItems.length > 0) {
        const res = await api.post('/cart/sync', { items: localItems });
        if (res.data?.success && res.data.cart) {
          set({ items: res.data.cart.items });
          saveLocalCart(res.data.cart.items);
          return;
        }
      }
      // If no local items, just fetch user's cart
      const res = await api.get('/cart');
      if (res.data?.success && res.data.cart) {
        set({ items: res.data.cart.items });
        saveLocalCart(res.data.cart.items);
      }
    } catch (e) {
      console.warn('Cart sync error:', e.message);
    }
  },
}));
