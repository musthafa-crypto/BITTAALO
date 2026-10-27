import { Wishlist } from '../models/Wishlist.js';

export const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate(
      'products',
      'name slug price discountPrice images stock category ratingsAverage'
    );

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [] });
    }

    res.json({
      success: true,
      wishlist: wishlist.products,
    });
  } catch (err) {
    next(err);
  }
};

export const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [productId] });
      return res.json({
        success: true,
        isWishlisted: true,
        message: 'Added to wishlist',
      });
    }

    const index = wishlist.products.findIndex((p) => p.toString() === productId);
    let isWishlisted = false;

    if (index > -1) {
      wishlist.products.splice(index, 1);
      isWishlisted = false;
    } else {
      wishlist.products.push(productId);
      isWishlisted = true;
    }

    await wishlist.save();

    res.json({
      success: true,
      isWishlisted,
      message: isWishlisted ? 'Added to wishlist' : 'Removed from wishlist',
      count: wishlist.products.length,
    });
  } catch (err) {
    next(err);
  }
};
