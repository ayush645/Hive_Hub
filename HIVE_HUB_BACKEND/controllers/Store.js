const Store = require('../models/Store');
const path = require('path');
const Product = require("../models/Product");
const Inventory = require("../models/Inventory");
const Order = require("../models/Order");
const sendEmailConfirmn = require("../utils/mail");


const createStore = async (req, res) => {
    try {
      const { name, description, subdomain, layout, TemplateId } = req.body;
      console.log("Creating store with data:", req.body);
      // Check if store already exists for this user
      const existingStore = await Store.findOne({ ownerId: req.user._id });
      if (existingStore) {
        return res.status(400).json({ message: 'Store already exists for this user.' });
      }
      // Handle logo file
      const logoPath = req.file ? req.file.path : null;
  
      const store = await Store.create({
        ownerId: req.user._id,
        name,
        subdomain,
        logo: logoPath,
        description,
        layout,
        TemplateId,
        isApproved: false, // default: must be approved by admin
        tier: req.user.tier,
      });
  
      res.status(201).json({ message: 'Store created successfully', store });
  
    } catch (error) {
      console.error('Store creation error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };  

const updateStore = async (req, res) => {
    try {
        const store = await Store.findOne({ _id: req.params.id, ownerId: req.user._id });
        if (!store) return res.status(404).json({ message: 'Store not found' });
        console.log("Updating store with data:", req.body);
        
        Object.assign(store, req.body);
        await store.save();
        res.json(store);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const connectPaymentGateway = async (req, res) => {
  const { gateway, credentials } = req.body;
  const store = await Store.findOne({ ownerId: req.user._id });
  if (!store) return res.status(404).json({ message: 'Store not found' });
  if (gateway === 'stripe') {
    store.paymentGateways.stripe = { connected: true, ...credentials };
  } else if (gateway === 'paypal') {
    store.paymentGateways.paypal = { connected: true, ...credentials };
  } else if (gateway === 'razorpay') {
    store.paymentGateways.razorpay = { connected: true, ...credentials };
  }
  await store.save();
  res.json({ message: `${gateway} connected successfully` });
};

const getPaymentStatus = async (req, res) => {
  const store = await Store.findOne({ ownerId: req.user._id });
  if (!store) return res.status(404).json({ message: 'Store not found' });

  res.json(store.paymentGateways);
};

const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      basePrice,
      category,
      tags,
      attributes,
      variants
    } = req.body;

    const store = await Store.findOne({ ownerId: req.user._id });
    if (!store) return res.status(403).json({ message: 'No store associated with this user.' });

    const imagePaths = req.files?.map(file => file.path) || [];
    const parsedVariants = variants ? JSON.parse(variants) : [];
    const parsedAttributes = attributes ? JSON.parse(attributes) : {};
    // Step 1: Create product
    const product = await Product.create({
      storeId: store._id,
      title,
      description,
      basePrice: parseFloat(basePrice || 0),
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      images: imagePaths,
      variants: parsedVariants,
      attributes: parsedAttributes,
      isPublished: false
    });

    for (const variant of parsedVariants) {
      const stock = parseInt(variant.stock || 0);
      const lowStockThreshold = 3;

      const status = stock === 0
        ? 'out-of-stock'
        : stock <= lowStockThreshold
          ? 'low-stock'
          : 'in-stock';

      await Inventory.create({
        productId: product._id,
        stock,
        lowStockThreshold,
        status
      });
    }

    res.status(201).json({
      message: 'Product created successfully',
      product
    });

  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};


const publicProductById = async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      const store = await Store.findOne({ _id: product.storeId, ownerId: req.user._id });
      if (!store) {
        return res.status(403).json({ message: 'You are not authorized to publish this product' });
      }
      product.isPublished = true;
      await product.save();
      res.status(200).json({ message: 'Product published successfully', product });
    } catch (error) {
      console.error('Error publishing product:', error);
      res.status(500).json({ message: 'Internal server error' }); 
    }
  };


const getMyStoreWithProducts = async (req, res) => {
  try {
    const store = await Store.findOne({
      ownerId: req.user._id
    }).lean();

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const includeUnpublished = req.query.includeUnpublished === 'true';

    const productQuery = { storeId: store._id };
    if (includeUnpublished) {
      productQuery.isPublished = true;
    }

    const products = await Product.find(productQuery).lean();
    const productIds = products.map((p) => p._id);

    const inventories = await Inventory.find({ productId: { $in: productIds } }).lean();

    // Create inventory map for quick lookup
    const inventoryMap = {};
    inventories.forEach(inv => {
      inventoryMap[inv.productId.toString()] = inv;
    });

    // Attach inventory data to products
    const enrichedProducts = products.map(product => ({
      ...product,
      inventory: inventoryMap[product._id.toString()] || null
    }));

    res.status(200).json({
      message: 'Store with products and inventory fetched successfully',
      store,
      products: enrichedProducts
    });

  } catch (error) {
    console.error('Error fetching store with products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updates = JSON.parse(req.body.updates || '{}');
    console.log("Updating product with ID:", productId, "and updates:", updates);
    const store = await Store.findOne({ ownerId: req.user._id });
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const product = await Product.findOne({ _id: productId, storeId: store._id });
    if (!product) return res.status(404).json({ message: 'Product not found or unauthorized' });

    // Basic field updates
    const allowedFields = ['title', 'description', 'basePrice', 'category', 'isPublished'];
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        product[field] = updates[field];
      }
    }

    // Tags (string or array)
    if (updates.tags) {
      product.tags = Array.isArray(updates.tags)
        ? updates.tags
        : updates.tags.split(',').map(tag => tag.trim());
    }

    // Attributes
    if (updates.attributes) {
      product.attributes = typeof updates.attributes === 'string'
        ? JSON.parse(updates.attributes)
        : updates.attributes;
    }

    // Variants (replace array)
    if (updates.variants) {
      product.variants = typeof updates.variants === 'string'
        ? JSON.parse(updates.variants)
        : updates.variants;
    }

    // Replace images if uploaded
    if (req.files && req.files.length > 0) {
      product.images = req.files.map(file => file.path);
    }

    await product.save();

    res.status(200).json({
      message: 'Product updated successfully',
      product
    });

  } catch (error) {
    console.error('Product update error:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};    


const getStoreBySubdomain = async (req, res) => {
    try {
      const { subdomain } = req.params;
      const store = await Store.findOne({ subdomain, isApproved: true, isBlocked: false })
        .select('-__v') // Optional: hide internal fields
        .populate('ownerId', 'email name'); // Optional: if you want owner info
  
      if (!store) {
        return res.status(404).json({ message: 'Store not found or not accessible' });
      }
  
      res.status(200).json({ store });
    } catch (error) {
      console.error('Error fetching store by subdomain:', error);
      res.status(500).json({ message: 'Internal server error', error });
    }
  };

// Auto update status based on stock
function getStockStatus(stock, threshold) {
  if (stock === 0) return 'out-of-stock';
  if (stock <= threshold) return 'low-stock';
  return 'in-stock';
}

// Create Inventory Entry
const createInventory = async (req, res) => {
  try {
    const { productId, stock, lowStockThreshold } = req.body;
    const store = await Store.findOne({ ownerId: req.user._id });
    if (!store) return res.status(404).json({ message: 'Store not found' });
    const product = await Product.findOne({ _id: productId, storeId: store._id });
    if (!product) return res.status(403).json({ message: 'Unauthorized or invalid product' });
    const status = getStockStatus(stock, lowStockThreshold);
    const inventory = await Inventory.create({ productId, stock, lowStockThreshold, status });
    res.status(201).json({ message: 'Inventory created', inventory });
  } catch (error) {
    console.error('Create inventory error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get All Inventory for StoreOwner
const getMyInventory = async (req, res) => {
  try {
    const store = await Store.findOne({ ownerId: req.user._id });
    if (!store) return res.status(404).json({ message: 'Store not found' });
    const products = await Product.find({ storeId: store._id }).select('_id');
    const productIds = products.map(p => p._id);
    const inventory = await Inventory.find({ productId: { $in: productIds } }).populate('productId');
    res.status(200).json({ inventory });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update Inventory (Stock or Threshold)
const updateInventory = async (req, res) => {
  try {
    const { stock, lowStockThreshold } = req.body;
    console.log("Updating inventory with data:", req.body);
    const store = await Store.findOne({ ownerId: req.user._id });
    if (!store) return res.status(404).json({ message: 'Store not found' });
    // fetch product of this inventory
    const inventory = await Inventory.findById(req.params.id).populate('productId');
    console.log("Fetched inventory:", inventory);
    if (!inventory) return res.status(404).json({ message: 'Inventory not found' });
    // Ensure product belongs to the storeOwner
    if (inventory.productId.storeId.toString() !== store._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    console.log("Updating inventory with stock:", stock, "and lowStockThreshold:", lowStockThreshold);
    
    if (stock !== undefined) inventory.stock = stock;
    if (lowStockThreshold !== undefined) inventory.lowStockThreshold = lowStockThreshold;

    inventory.status = getStockStatus(inventory.stock, inventory.lowStockThreshold);
    await inventory.save();
    res.status(200).json({ message: 'Inventory updated', inventory });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// (Optional) Delete Inventory
const deleteInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id).populate('productId');
    if (!inventory) return res.status(404).json({ message: 'Inventory not found' });
    if (inventory.productId.storeId.toString() !== req.user.storeId.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await inventory.remove();
    res.status(200).json({ message: 'Inventory deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const uploadMdedia = async (req,res) => {
  try {
      const urls = req.files.map(file => ({
        url: file.path,
        resource_type: file.mimetype.startsWith('video/') ? 'video' : 'image'
      }));
      res.status(200).json({ message: 'Upload successful', files: urls });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed', error });
  }
}

// --- StoreOwner Order Management APIs with Shopper + Product Info ---

const getAllOrdersForStoreOwner = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const store = await Store.findOne({ ownerId: req.user._id });
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const orders = await Order.find({ storeId: store._id })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .populate('items.productId', 'title basePrice images')
      .lean();

    const total = await Order.countDocuments({ storeId: store._id });

    res.status(200).json({
      orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /store/orders/:id
const getOrderByIdForStoreOwner = async (req, res) => {
  try {
    const store = await Store.findOne({ ownerId: req.user._id });
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const order = await Order.findOne({ _id: req.params.id, storeId: store._id })
      .populate('userId', '-password')
      .populate('storeId', 'name subdomain tier')
      .populate('items.productId', 'title basePrice variants images category')
      .lean();

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.status(200).json({ order });
  } catch (error) {
    console.error('Error getting order by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /store/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { deliveryStatus } = req.body;
    console.log("deliveryStatus==>",deliveryStatus);
    
    const store = await Store.findOne({ ownerId: req.user._id });
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const order = await Order.findOne({ _id: req.params.id, storeId: store._id }).populate('userId');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.deliveryStatus = deliveryStatus;
    await order.save();
    console.log("order==>",order);
    

    // Send email confirmation to shopper
    await sendEmailConfirmn.sendOrderStatusConfirmation({
      to: order.userId.email,
      name: order.userId.name,
      orderId: order._id.toString(),
      deliveryStatus: order.deliveryStatus, // ✅ NEW: Include the delivery status
      totalAmount: order.totalAmount,
      shippingAddress: order.shippingAddress,
      items: order.items.map(item => ({
        title: item.productId?.title || 'Product',
        quantity: item.quantity,
        price: item.price
      }))
    });

    res.status(200).json({ message: 'Order status updated & email sent', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const getDashboardStats = async (req, res) => {
  try {
    const { filter = 'monthly', startDate, endDate } = req.query;
    console.log("filter==>",filter);
    const store = await Store.findOne({ ownerId: req.user._id });
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const now = new Date();
    let groupBy, start, end;
    const today = new Date(); // Immutable reference

    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      switch (filter) {
        case 'daily':
          groupBy = {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          };
          start = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000); // last 7 days
          end = today;
          break;
      
        case 'weekly':
          groupBy = {
            $dateToString: { format: "%Y-%U", date: "$createdAt" } // Week of year
          };
          start = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000); // last 30 days
          end = today;
          break;
      
        case 'yearly':
          groupBy = {
            $dateToString: { format: "%Y", date: "$createdAt" }
          };
          start = new Date(today.getFullYear() - 2, 0, 1); // Jan 1st, 2 years ago
          end = today;
          break;
      
        default: // monthly
          groupBy = {
            $dateToString: { format: "%Y-%m", date: "$createdAt" }
          };
          start = new Date(today.getFullYear(), today.getMonth() - 11, 1); // 12 months ago
          end = today;
      }
    }

    const matchStage = {
      storeId: store._id,
      paymentStatus: 'paid',
      createdAt: { $gte: start, $lte: end }
    };

    // Chart Data with Time Buckets
    const chartData = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: groupBy,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
          totalDiscount: { $sum: "$discount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top Products
    const topProducts = await Order.aggregate([
      { $match: { storeId: store._id, paymentStatus: 'paid' } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.quantity", "$items.price"] }
          }
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 1,
          title: "$product.title",
          totalSold: 1,
          totalRevenue: 1
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    // Revenue by Category
    const revenueByCategory = await Order.aggregate([
      { $match: { storeId: store._id, paymentStatus: 'paid' } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$product.category",
          revenue: {
            $sum: { $multiply: ["$items.quantity", "$items.price"] }
          },
          count: { $sum: "$items.quantity" }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    // Summary Stats
    const orders = await Order.find({
      storeId: store._id,
      createdAt: { $gte: start, $lte: end }
    });

    const totalOrders = orders.length;
    const deliveredOrders = orders.filter(o => o.deliveryStatus === 'delivered').length;
    const pendingOrders = orders.filter(o => o.deliveryStatus === 'pending').length;
    const failedOrders = orders.filter(o => o.paymentStatus === 'failed').length;
    const grossSales = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    const totalDiscount = orders.reduce((acc, order) => acc + (order.discount || 0), 0);
    const netSales = grossSales - totalDiscount;

    res.status(200).json({
      summary: {
        totalOrders,
        deliveredOrders,
        pendingOrders,
        failedOrders,
        grossSales,
        totalDiscount,
        netSales
      },
      chartData,
      topProducts,
      revenueByCategory
    });

  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

  

module.exports = {
  createStore,
  updateStore,
  connectPaymentGateway,
  getPaymentStatus,
  createProduct,
  updateProduct,
  getMyStoreWithProducts,
  getStoreBySubdomain,
  publicProductById,
  createInventory,
  getMyInventory,
  updateInventory,
  deleteInventory,   
  getAllOrdersForStoreOwner,  
  getOrderByIdForStoreOwner, 
  updateOrderStatus,
  uploadMdedia,
  getDashboardStats,
};