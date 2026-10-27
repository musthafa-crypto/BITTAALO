import express from 'express';
import { getRazorpayKey, verifyPayment, webhookHandler } from '../controllers/paymentController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/key', getRazorpayKey);
router.post('/verify', optionalAuth, verifyPayment);
router.post('/webhook', express.raw({ type: 'application/json' }), webhookHandler);

export default router;
