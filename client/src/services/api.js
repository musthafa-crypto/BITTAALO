import api from '../utils/axios';

// Public & Catalog
export const fetchCategories = async () => {
  const res = await api.get('/categories');
  return res.data.categories;
};

export const fetchProducts = async (params = {}) => {
  const res = await api.get('/products', { params });
  return res.data;
};

export const fetchProductBySlug = async (slug) => {
  const res = await api.get(`/products/${slug}`);
  return res.data.product;
};

export const fetchFeaturedProducts = async () => {
  const res = await api.get('/products/featured');
  return res.data.products;
};

export const fetchNewArrivals = async () => {
  const res = await api.get('/products/new-arrivals');
  return res.data.products;
};

export const fetchBestSellers = async () => {
  const res = await api.get('/products/best-sellers');
  return res.data.products;
};

export const fetchRelatedProducts = async (id) => {
  const res = await api.get(`/products/${id}/related`);
  return res.data.products;
};

export const fetchSearchSuggestions = async (q) => {
  const res = await api.get('/products/search-suggestions', { params: { q } });
  return res.data.suggestions;
};

export const fetchBanners = async () => {
  const res = await api.get('/banners');
  return res.data.banners;
};

// Reviews
export const fetchProductReviews = async (productId) => {
  const res = await api.get(`/reviews/product/${productId}`);
  return res.data.reviews;
};

export const submitProductReview = async (productId, data) => {
  const res = await api.post(`/reviews/product/${productId}`, data);
  return res.data;
};

// Orders & Checkout
export const placeOrder = async (orderData) => {
  const res = await api.post('/orders', orderData);
  return res.data;
};

export const fetchMyOrders = async () => {
  const res = await api.get('/orders/myorders');
  return res.data.orders;
};

export const fetchOrderById = async (id) => {
  const res = await api.get(`/orders/${id}`);
  return res.data.order;
};

export const cancelOrderRequest = async (id) => {
  const res = await api.put(`/orders/${id}/cancel`);
  return res.data;
};

// Payments
export const fetchRazorpayKey = async () => {
  const res = await api.get('/payments/key');
  return res.data.key;
};

export const verifyPaymentSignature = async (paymentData) => {
  const res = await api.post('/payments/verify', paymentData);
  return res.data;
};

// Contact
export const sendContactMessage = async (data) => {
  const res = await api.post('/contact', data);
  return res.data;
};

// Admin Services
export const fetchAdminStats = async () => {
  const res = await api.get('/admin/stats');
  return res.data.stats;
};

export const fetchAdminOrders = async (params = {}) => {
  const res = await api.get('/admin/orders', { params });
  return res.data;
};

export const updateAdminOrderStatus = async (id, data) => {
  const res = await api.put(`/admin/orders/${id}/status`, data);
  return res.data;
};

export const createAdminProduct = async (data) => {
  const res = await api.post('/admin/products', data);
  return res.data;
};

export const updateAdminProduct = async (id, data) => {
  const res = await api.put(`/admin/products/${id}`, data);
  return res.data;
};

export const deleteAdminProduct = async (id) => {
  const res = await api.delete(`/admin/products/${id}`);
  return res.data;
};

export const createAdminCategory = async (data) => {
  const res = await api.post('/admin/categories', data);
  return res.data;
};

export const updateAdminCategory = async (id, data) => {
  const res = await api.put(`/admin/categories/${id}`, data);
  return res.data;
};

export const deleteAdminCategory = async (id) => {
  const res = await api.delete(`/admin/categories/${id}`);
  return res.data;
};

export const fetchAdminCustomers = async () => {
  const res = await api.get('/admin/customers');
  return res.data.customers;
};

export const fetchAdminCoupons = async () => {
  const res = await api.get('/admin/coupons');
  return res.data.coupons;
};

export const createAdminCoupon = async (data) => {
  const res = await api.post('/admin/coupons', data);
  return res.data;
};

export const deleteAdminCoupon = async (id) => {
  const res = await api.delete(`/admin/coupons/${id}`);
  return res.data;
};

export const fetchAdminReviews = async () => {
  const res = await api.get('/admin/reviews');
  return res.data.reviews;
};

export const toggleAdminReview = async (id) => {
  const res = await api.put(`/admin/reviews/${id}/toggle`);
  return res.data;
};

export const deleteAdminReview = async (id) => {
  const res = await api.delete(`/admin/reviews/${id}`);
  return res.data;
};

export const fetchAdminMessages = async () => {
  const res = await api.get('/admin/messages');
  return res.data.messages;
};

export const markAdminMessageRead = async (id) => {
  const res = await api.put(`/admin/messages/${id}/read`);
  return res.data;
};

export const fetchAdminBanners = async () => {
  const res = await api.get('/admin/banners');
  return res.data.banners;
};

export const createAdminBanner = async (data) => {
  const res = await api.post('/admin/banners', data);
  return res.data;
};

export const deleteAdminBanner = async (id) => {
  const res = await api.delete(`/admin/banners/${id}`);
  return res.data;
};
