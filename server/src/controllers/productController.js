import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';

export const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      inStock,
      sort,
      search,
      tags,
      featured,
      bestseller,
      newarrival,
      page = 1,
      limit = 12,
    } = req.query;

    const query = { isActive: true };

    // Category filter
    if (category) {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const foundCategory = await Category.findOne({ slug: category });
        if (foundCategory) {
          query.category = foundCategory._id;
        } else {
          return res.json({
            success: true,
            products: [],
            total: 0,
            page: Number(page),
            pages: 0,
          });
        }
      }
    }

    // Price range — only apply if values are non-empty strings
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Stock availability
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Tags
    if (tags) {
      const tagList = tags.split(',').map((t) => t.trim());
      query.tags = { $in: tagList };
    }

    // Flags
    if (featured === 'true') query.isFeatured = true;
    if (bestseller === 'true') query.isBestSeller = true;
    if (newarrival === 'true') query.isNewArrival = true;

    // Search query (text search or regex fallback)
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { shortDescription: searchRegex },
        { tags: searchRegex },
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // Default: newest
    if (sort === 'price-asc') sortOption = { price: 1 };
    else if (sort === 'price-desc') sortOption = { price: -1 };
    else if (sort === 'popular') sortOption = { ratingsQuantity: -1, ratingsAverage: -1 };
    else if (sort === 'rating') sortOption = { ratingsAverage: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      products,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    next(err);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    let product;

    if (slug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(slug).populate('category', 'name slug description');
    } else {
      product = await Product.findOne({ slug, isActive: true }).populate(
        'category',
        'name slug description'
      );
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (err) {
    next(err);
  }
};

export const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate('category', 'name slug')
      .limit(8);

    res.json({
      success: true,
      products,
    });
  } catch (err) {
    next(err);
  }
};

export const getNewArrivals = async (req, res, next) => {
  try {
    const products = await Product.find({ isNewArrival: true, isActive: true })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(8);

    res.json({
      success: true,
      products,
    });
  } catch (err) {
    next(err);
  }
};

export const getBestSellers = async (req, res, next) => {
  try {
    const products = await Product.find({ isBestSeller: true, isActive: true })
      .populate('category', 'name slug')
      .sort({ ratingsQuantity: -1 })
      .limit(8);

    res.json({
      success: true,
      products,
    });
  } catch (err) {
    next(err);
  }
};

export const getRelatedProducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const current = await Product.findById(id);

    if (!current) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const related = await Product.find({
      category: current.category,
      _id: { $ne: current._id },
      isActive: true,
    })
      .populate('category', 'name slug')
      .limit(4);

    res.json({
      success: true,
      products: related,
    });
  } catch (err) {
    next(err);
  }
};

export const searchSuggestions = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.json({ success: true, suggestions: [] });
    }

    const regex = new RegExp(q.trim(), 'i');
    const suggestions = await Product.find({
      name: regex,
      isActive: true,
    })
      .select('name slug price discountPrice images category')
      .populate('category', 'name slug')
      .limit(6);

    res.json({
      success: true,
      suggestions,
    });
  } catch (err) {
    next(err);
  }
};
