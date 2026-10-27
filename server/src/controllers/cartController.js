import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';

export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product', 'name slug price discountPrice images stock category')
      .populate('coupon');

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    res.json({
      success: true,
      cart,
    });
  } catch (err) {
    next(err);
  }
};

export const syncCart = async (req, res, next) => {
  try {
    const { items = [] } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    // Merge incoming guest items into existing cart
    for (const incoming of items) {
      const prodId = incoming.product?._id || incoming.product || incoming.productId;
      if (!prodId) continue;

      const product = await Product.findById(prodId);
      if (!product) continue;

      const existingIndex = cart.items.findIndex(
        (item) =>
          item.product.toString() === prodId.toString() &&
          item.variant?.value === incoming.variant?.value
      );

      if (existingIndex > -1) {
        cart.items[existingIndex].quantity = Math.min(
          cart.items[existingIndex].quantity + (incoming.quantity || 1),
          product.stock
        );
      } else {
        cart.items.push({
          product: prodId,
          quantity: Math.min(incoming.quantity || 1, product.stock),
          variant: incoming.variant || {},
        });
      }
    }

    await cart.save();
    cart = await Cart.findById(cart._id).populate(
      'items.product',
      'name slug price discountPrice images stock category'
    );

    res.json({
      success: true,
      cart,
    });
  } catch (err) {
    next(err);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, variant } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items left in stock.`,
      });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        (!variant || item.variant?.value === variant?.value)
    );

    if (itemIndex > -1) {
      const newQty = cart.items[itemIndex].quantity + quantity;
      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Current stock limit is ${product.stock}.`,
        });
      }
      cart.items[itemIndex].quantity = newQty;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        variant,
      });
    }

    await cart.save();
    cart = await Cart.findById(cart._id).populate(
      'items.product',
      'name slug price discountPrice images stock category'
    );

    res.json({
      success: true,
      cart,
      message: 'Item added to bag',
    });
  } catch (err) {
    next(err);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    const product = await Product.findById(item.product);
    if (product && quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Requested quantity exceeds available stock (${product.stock}).`,
      });
    }

    item.quantity = quantity;
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      'items.product',
      'name slug price discountPrice images stock category'
    );

    res.json({
      success: true,
      cart: populatedCart,
    });
  } catch (err) {
    next(err);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      'items.product',
      'name slug price discountPrice images stock category'
    );

    res.json({
      success: true,
      cart: populatedCart,
      message: 'Item removed from bag',
    });
  } catch (err) {
    next(err);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [], coupon: null });
    res.json({
      success: true,
      message: 'Cart cleared',
    });
  } catch (err) {
    next(err);
  }
};
