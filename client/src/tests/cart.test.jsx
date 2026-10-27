import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { useCartStore } from '../store/cartStore';

// Mock localStorage for test environment
beforeAll(() => {
  const store = {};
  global.localStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
  };
});

describe('Cart Store Logic & Rules', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], appliedCoupon: null });
  });

  it('calculates subtotal accurately for multiple items', () => {
    const { addItem, getSubtotal } = useCartStore.getState();

    addItem({ _id: 'p1', name: 'Dad Cap', price: 1499, discountPrice: 999 }, 2);
    addItem({ _id: 'p2', name: 'Cuban Chain', price: 2199 }, 1);

    // 999 * 2 = 1998, + 2199 = 4197
    expect(useCartStore.getState().getSubtotal()).toBe(4197);
  });

  it('awards free shipping when subtotal >= ₹999, else charges flat ₹99', () => {
    const { addItem, getShippingPrice } = useCartStore.getState();

    // Below 999 -> 99 shipping
    addItem({ _id: 'p1', name: 'Sunglasses Pouch', price: 699, discountPrice: 449 }, 1);
    expect(useCartStore.getState().getShippingPrice()).toBe(99);

    // Add another item to exceed 999 -> 0 shipping
    addItem({ _id: 'p2', name: 'Dad Cap', price: 1499, discountPrice: 999 }, 1);
    expect(useCartStore.getState().getShippingPrice()).toBe(0);
  });

  it('deducts coupon discount properly from total', () => {
    const store = useCartStore.getState();
    store.addItem({ _id: 'p1', name: 'Watch', price: 4499 }, 1);

    useCartStore.setState({
      appliedCoupon: {
        code: 'WELCOME10',
        discountType: 'percentage',
        discountValue: 10,
        discountAmount: 450,
      },
    });

    const subtotal = useCartStore.getState().getSubtotal();
    const shipping = useCartStore.getState().getShippingPrice();
    const discount = useCartStore.getState().getDiscount();
    const total = useCartStore.getState().getTotal();

    expect(subtotal).toBe(4499);
    expect(shipping).toBe(0); // Free > 999
    expect(discount).toBe(450);
    expect(total).toBe(4499 + 0 - 450);
  });
});
