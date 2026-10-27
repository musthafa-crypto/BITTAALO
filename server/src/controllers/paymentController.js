import crypto from 'crypto';
import { Order } from '../models/Order.js';
import { verifyRazorpayPayment } from '../config/razorpay.js';

export const getRazorpayKey = (req, res) => {
  res.json({
    success: true,
    key: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key_id',
  });
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const isValid = verifyRazorpayPayment({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Invalid signature',
      });
    }

    // Find order
    let order = null;
    if (orderId) {
      order = await Order.findById(orderId);
    } else if (razorpay_order_id) {
      order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found for payment' });
    }

    order.paymentStatus = 'paid';
    order.orderStatus = 'Confirmed';
    order.razorpayPaymentId = razorpay_payment_id;
    order.timeline.push({
      status: 'Confirmed',
      comment: `Payment received successfully via Razorpay (Txn ID: ${razorpay_payment_id})`,
    });

    await order.save();

    res.json({
      success: true,
      message: 'Payment verified successfully',
      order,
    });
  } catch (err) {
    next(err);
  }
};

export const webhookHandler = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_webhook_secret_key';
    const signature = req.headers['x-razorpay-signature'];

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (signature && signature !== expectedSignature) {
      return res.status(400).json({ status: 'invalid signature' });
    }

    const { event, payload } = req.body;
    if (event === 'payment.captured') {
      const payment = payload.payment.entity;
      const razorpayOrderId = payment.order_id;

      const order = await Order.findOne({ razorpayOrderId });
      if (order && order.paymentStatus !== 'paid') {
        order.paymentStatus = 'paid';
        order.orderStatus = 'Confirmed';
        order.razorpayPaymentId = payment.id;
        order.timeline.push({
          status: 'Confirmed',
          comment: `Payment captured via Webhook (Txn ID: ${payment.id})`,
        });
        await order.save();
      }
    }

    res.json({ status: 'ok' });
  } catch (err) {
    console.error('[Razorpay Webhook Error]', err);
    res.status(500).json({ status: 'error' });
  }
};
