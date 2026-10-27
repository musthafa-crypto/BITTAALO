import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1, name: 1 });

    // Count products per category
    const counts = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    counts.forEach((c) => {
      countMap[c._id.toString()] = c.count;
    });

    const categoriesWithCount = categories.map((cat) => ({
      ...cat.toObject(),
      productCount: countMap[cat._id.toString()] || 0,
    }));

    res.json({
      success: true,
      categories: categoriesWithCount,
    });
  } catch (err) {
    next(err);
  }
};

export const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug, isActive: true });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const count = await Product.countDocuments({ category: category._id, isActive: true });

    res.json({
      success: true,
      category: {
        ...category.toObject(),
        productCount: count,
      },
    });
  } catch (err) {
    next(err);
  }
};
