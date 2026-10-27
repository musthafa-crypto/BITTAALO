import express from 'express';
import {
  getDashboardStats,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCustomers,
  getCoupons,
  createCoupon,
  deleteCoupon,
  getAllReviews,
  toggleReviewApproval,
  deleteReview,
  getContactMessages,
  markContactRead,
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Apply admin protection to all routes below
router.use(protect, authorize('admin'));

// Upload helper for admin dashboard
router.post('/upload', upload.array('images', 5), (req, res) => {
  const fileUrls = (req.files || []).map(
    (file) => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
  );
  res.json({ success: true, urls: fileUrls });
});

// Overview KPI Stats
router.get('/stats', getDashboardStats);

// Products Management
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Categories Management
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Orders Management
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Customers
router.get('/customers', getAllCustomers);

// Coupons
router.get('/coupons', getCoupons);
router.post('/coupons', createCoupon);
router.delete('/coupons/:id', deleteCoupon);

// Reviews
router.get('/reviews', getAllReviews);
router.put('/reviews/:id/toggle', toggleReviewApproval);
router.delete('/reviews/:id', deleteReview);

// Contact messages
router.get('/messages', getContactMessages);
router.put('/messages/:id/read', markContactRead);

// Banners
router.get('/banners', getBanners);
router.post('/banners', createBanner);
router.put('/banners/:id', updateBanner);
router.delete('/banners/:id', deleteBanner);

export default router;
