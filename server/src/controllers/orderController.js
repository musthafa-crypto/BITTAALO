import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Coupon } from '../models/Coupon.js';
import { Cart } from '../models/Cart.js';
import { createRazorpayOrder } from '../config/razorpay.js';
import { sendEmail } from '../config/nodemailer.js';

export const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      couponCode,
      guestInfo,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.pinCode) {
      return res.status(400).json({ success: false, message: 'Shipping address is incomplete' });
    }

    // Verify stock and fetch fresh prices
    let itemsPrice = 0;
    const verifiedItems = [];

    for (const item of items) {
      const prodId = item.product?._id || item.product || item.productId;
      const product = await Product.findById(prodId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.name || prodId}`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Only ${product.stock} available.`,
        });
      }

      const activePrice = product.discountPrice || product.price;
      itemsPrice += activePrice * item.quantity;

      verifiedItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || '',
        price: activePrice,
        quantity: item.quantity,
        variant: item.variant || {},
      });
    }

    // Shipping calculation: Free above ₹999, else ₹99
    const shippingPrice = itemsPrice >= 999 ? 0 : 99;

    // GST calculation: 18% inclusive
    const taxPrice = Math.round(itemsPrice * 0.18);

    // Coupon discount calculation
    let discountPrice = 0;
    let couponApplied = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        expiryDate: { $gt: new Date() },
      });

      if (coupon && itemsPrice >= coupon.minOrderAmount) {
        if (coupon.discountType === 'percentage') {
          discountPrice = Math.round((itemsPrice * coupon.discountValue) / 100);
          if (coupon.maxDiscountAmount && discountPrice > coupon.maxDiscountAmount) {
            discountPrice = coupon.maxDiscountAmount;
          }
        } else {
          discountPrice = coupon.discountValue;
        }

        couponApplied = {
          code: coupon.code,
          discount: discountPrice,
        };

        // Increment coupon use count
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    const totalPrice = Math.max(0, itemsPrice + shippingPrice - discountPrice);

    // Generate Order Number
    const timestamp = Date.now().toString().slice(-6);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `BIT-${timestamp}-${randomSuffix}`;

    // Handle Razorpay or COD
    let razorpayOrder = null;
    let paymentStatus = 'pending';

    if (paymentMethod === 'razorpay') {
      razorpayOrder = await createRazorpayOrder({
        amount: totalPrice,
        currency: 'INR',
        receipt: orderNumber,
        notes: {
          orderNumber,
          customerEmail: req.user?.email || guestInfo?.email || 'customer@bittaalo.com',
        },
      });
    } else {
      // COD orders are automatically placed with status 'Confirmed' or 'Pending'
      paymentStatus = 'pending';
    }

    // Deduct stock for all items
    for (const item of verifiedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // Create Order Document
    const order = await Order.create({
      orderNumber,
      user: req.user ? req.user.id : null,
      guestInfo: !req.user ? guestInfo : undefined,
      items: verifiedItems,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      razorpayOrderId: razorpayOrder ? razorpayOrder.id : undefined,
      orderStatus: paymentMethod === 'cod' ? 'Confirmed' : 'Pending',
      itemsPrice,
      shippingPrice,
      taxPrice,
      discountPrice,
      totalPrice,
      couponApplied,
      timeline: [
        {
          status: paymentMethod === 'cod' ? 'Confirmed' : 'Pending',
          comment: paymentMethod === 'cod' ? 'Order placed via Cash on Delivery' : 'Awaiting payment confirmation',
        },
      ],
    });

    // Clear user's DB cart if logged in
    if (req.user) {
      await Cart.findOneAndUpdate({ user: req.user.id }, { items: [], coupon: null });
    }

    // Send confirmation email asynchronously
    const targetEmail = req.user?.email || guestInfo?.email;
    if (targetEmail) {
      sendEmail({
        to: targetEmail,
        subject: `Order Confirmed: ${orderNumber} - BITTAALO`,
        text: `Thank you for your order with BITTAALO! Order Number: ${orderNumber}. Total: ₹${totalPrice}.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111;">
            <h1 style="font-size: 24px; letter-spacing: 3px; margin-bottom: 8px;">BITTAALO</h1>
            <p style="color: #666; margin-top: 0;">PREMIUM LIFESTYLE ACCESSORIES</p>
            <div style="background: #f4f4f5; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 8px;">Order Placed Successfully</h3>
              <p style="margin: 4px 0;"><strong>Order ID:</strong> ${orderNumber}</p>
              <p style="margin: 4px 0;"><strong>Total Amount:</strong> ₹${totalPrice.toLocaleString('en-IN')}</p>
              <p style="margin: 4px 0;"><strong>Payment Method:</strong> ${paymentMethod.toUpperCase()}</p>
              <p style="margin: 4px 0;"><strong>Shipping To:</strong> ${shippingAddress.fullName}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pinCode}</p>
            </div>
            <p>We are packaging your order. You can track your package anytime or message us on WhatsApp: <strong>+91 9037489104</strong>.</p>
          </div>
        `,
      }).catch((e) => console.warn('Email trigger note:', e.message));
    }

    res.status(201).json({
      success: true,
      order,
      razorpayOrder,
    });
  } catch (err) {
    next(err);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name slug images');

    res.json({
      success: true,
      orders,
    });
  } catch (err) {
    next(err);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let order;

    if (id.startsWith('BIT-')) {
      order = await Order.findOne({ orderNumber: id }).populate('items.product', 'name slug images');
    } else {
      order = await Order.findById(id).populate('items.product', 'name slug images');
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check ownership if user is not admin
    if (req.user && req.user.role !== 'admin' && order.user && order.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this order' });
    }

    res.json({
      success: true,
      order,
    });
  } catch (err) {
    next(err);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user && order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    if (['Shipped', 'Delivered', 'Cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled in status: ${order.orderStatus}`,
      });
    }

    order.orderStatus = 'Cancelled';
    order.timeline.push({
      status: 'Cancelled',
      comment: 'Cancelled by customer',
    });

    // Restock items
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order,
    });
  } catch (err) {
    next(err);
  }
};
