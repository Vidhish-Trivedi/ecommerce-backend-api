const Product = require('../models/Product');

const createProduct = async (req, res) => {
  try {
    const { title, description, category, price, quantity } = req.body;
    const images = req.files ? req.files.map(file => file.filename) : [];

    const product = new Product({
      title,
      description,
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      images,
      seller: req.user._id,
    });

    await product.save();
    await product.populate('seller', 'fullName storeName');

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { title, description, category, price, quantity } = req.body;
    const product = await Product.findOne({ _id: req.params.id, seller: req.user._id });

    if (!product) {
      return res.status(404).json({ error: 'Product not found or not authorized' });
    }

    const updateData = {
      title: title || product.title,
      description: description || product.description,
      category: category || product.category,
      price: price ? parseFloat(price) : product.price,
      quantity: quantity ? parseInt(quantity) : product.quantity,
    };

    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => file.filename);
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate('seller', 'fullName storeName');

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, seller: req.user._id });

    if (!product) {
      return res.status(404).json({ error: 'Product not found or not authorized' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSellerProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({ seller: req.user._id })
      .populate('seller', 'fullName storeName')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments({ seller: req.user._id });

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (req.query.category) {
      filter.category = new RegExp(req.query.category, 'i');
    }
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
    }
    if (req.query.search) {
      filter.$or = [
        { title: new RegExp(req.query.search, 'i') },
        { description: new RegExp(req.query.search, 'i') },
      ];
    }

    const products = await Product.find(filter)
      .populate('seller', 'fullName storeName')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'fullName storeName');
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts,
  getAllProducts,
  getProductById
};