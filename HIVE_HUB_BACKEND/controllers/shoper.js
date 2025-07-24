const Store = require('../models/Store');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const Order = require('../models/Order');
const Cart = require('../models/cart');
const shoperModel = require('../models/shoper');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Utility = require('../utils/utility');
const sendEmailConfirmn = require("../utils/mail");

const shoperSignUp = async (req, res) => {
    try {
      let { email, password, name, phone, countryCode } = req.body;
      email = email.toLowerCase().trim();
      const existingUser = await shoperModel.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'Email already registered' });
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await shoperModel.create({
        email,
        name,
        password: hashedPassword,
        phone,
        countryCode
      });
      res.status(201).json({ message: 'Shoper registered successfully', user });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // Shopper Login
  const shoperLogin = async (req, res) => {
    try {
      let { email, password } = req.body;
      email = email.toLowerCase().trim();
      const user = await shoperModel.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
        user.token = await Utility.jwtSign({ _id: user._id, role: user.role });
        user.type = "Bearer";
        user.expire = await Utility.getJwtExpireTime();
        user.refreshToken = await Utility.jwtRefreshSign({ _id: user._id });
        const token = user.token;
      res.json({ message: 'Login successful', token, user });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // Add Address
  const addAddress = async (req, res) => {
    try {
      const { street, city, state, country, zipCode } = req.body;
      if (!street || !city || !state || !country || !zipCode) {
            return res.status(400).json({ message: 'All address fields are required' });
       }
      const user = await shoperModel.findById(req.user._id);
      console.log('user._id:', req.user._id);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      user.address.push({ street, city, state, country, zipCode });
      await user.save();
  
      res.status(200).json({ message: 'Address added', addresses: user.address });
    } catch (error) {
      console.error('Add address error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // Update Address by index
  const updateAddress = async (req, res) => {
    try {
      const { index } = req.params;
      const { street, city, state, country, zipCode } = req.body;
  
      const user = await shoperModel.findById(req.user._id);
      if (!user || !user.address[index]) {
        return res.status(404).json({ message: 'Address not found' });
      }
  
      user.address[index] = { street, city, state, country, zipCode };
      await user.save();
  
      res.status(200).json({ message: 'Address updated', addresses: user.address });
    } catch (error) {
      console.error('Update address error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  // --- Public Store APIs for Shoppers ---
  
  // Get published products by store subdomain with filters
  const getStoreProducts = async (req, res) => {
    const { subdomain } = req.params;
    const { category, search, tags, minPrice, maxPrice, sortBy, page = 1, limit = 12 } = req.query;
  
    const store = await Store.findOne({ subdomain, isApproved: true, isBlocked: false });
    if (!store) return res.status(404).json({ message: 'Store not found or not published' });
  
    const query = {
      storeId: store._id,
      isPublished: true
    };
  
    if (category) query.category = category;
    if (tags) query.tags = { $in: tags.split(',') };
    if (search) query.title = { $regex: search, $options: 'i' };
    if (minPrice || maxPrice) query.basePrice = {};
    if (minPrice) query.basePrice.$gte = parseFloat(minPrice);
    if (maxPrice) query.basePrice.$lte = parseFloat(maxPrice);
  
    const skip = (parseInt(page) - 1) * parseInt(limit);
  
    let sortOptions = {};
    if (sortBy === 'priceAsc') sortOptions.basePrice = 1;
    else if (sortBy === 'priceDesc') sortOptions.basePrice = -1;
    else if (sortBy === 'latest') sortOptions.createdAt = -1;
  
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-reviews')
      .lean();

      console.log('Products found:', products.length, products );
      

    const productsWithInventory = await Promise.all(products.map(async product => {
      const inventory = await Inventory.findOne({ productId: product._id });
      return {
        ...product,
        inventory: inventory || null
      };
    }));
  
    res.status(200).json({ store, products: productsWithInventory });
  };  
  
  // Get single product detail for shopper
  const getPublicProductById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const product = await Product.findOne({ _id: id, isPublished: true })
        .populate('storeId')
        .lean(); // ✅ Needed to attach additional fields
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found or unpublished' });
      }
  
      // ✅ Attach inventory
      const Inventory = require('../models/Inventory');
      const inventory = await Inventory.findOne({ productId: product._id });
      product.inventory = inventory || null;
  
      // ✅ Optional: Related products
      const related = await Product.find({
        storeId: product.storeId._id,
        category: product.category,
        _id: { $ne: product._id },
        isPublished: true
      })
      .limit(4)
      .lean();
  
      res.status(200).json({ product, related });
  
    } catch (error) {
      console.error('Error in getPublicProductById:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

  const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user._id }) || new Cart({ userId: req.user._id, items: [] });
    const existingItem = cart.items.find(item => item.productId === productId);
  
    if (existingItem) existingItem.quantity += quantity;
    else cart.items.push({ productId, quantity });
  
    await cart.save();
    res.status(200).json({ message: 'Item added to cart', cart });
  };
  
  // Update cart item quantity
  const updateCartItem = async (req, res) => {
    try {
      const { productId, quantity } = req.body;
  
      const cart = await Cart.findOne({ userId: req.user._id });
      if (!cart) return res.status(404).json({ message: 'Cart not found' });
  
      const item = cart.items.find(
        i => i.productId && i.productId.toString() === productId
      );
      
      console.log('Updating cart item:', item, 'with quantity:', quantity);
      
  
      if (!item) return res.status(404).json({ message: 'Item not found in cart' });
  
      item.quantity = quantity;
      await cart.save();
  
      res.status(200).json({ message: 'Cart updated', cart });
    } catch (error) {
      console.error('Update cart error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  
  // Remove item from cart
  const removeCartItem = async (req, res) => {
    const { productId } = req.params;
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
  
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();
  
    res.status(200).json({ message: 'Item removed', cart });
  };
  
  // View cart
  const getCart = async (req, res) => {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    res.status(200).json({ cart });
  };
  
  // Checkout
  const checkout = async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }
  
      const shopper = await shoperModel.findById(req.user._id);
      if (!shopper) {
        return res.status(404).json({ message: 'Shopper not found' });
      }
  
      // Use address from body if provided, otherwise default to last saved address
      let shippingAddress = req.body.shippingAddress || null;
      if (!shippingAddress && shopper.address.length > 0) {
        shippingAddress = shopper.address[shopper.address.length - 1];
      }
  
      if (!shippingAddress) {
        return res.status(400).json({ message: 'No shipping address available' });
      }
  
      const firstProduct = cart.items[0].productId;
      const storeId = firstProduct.storeId;
  
      let total = 0;
      const items = cart.items.map(({ productId, quantity }) => {
        const price = productId.basePrice;
        total += price * quantity;
        return { productId: productId._id, quantity, price };
      });
  
      const order = await Order.create({
        userId: req.user._id,
        storeId,
        items,
        shippingAddress,
        totalAmount: total,
        paymentStatus: 'paid', // Simulated
        deliveryStatus: 'pending'
      });
  
      // Update inventory
      for (let item of items) {
        const inventory = await Inventory.findOne({ productId: item.productId });
        if (inventory) {
          inventory.stock -= item.quantity;
          inventory.status =
            inventory.stock <= 0 ? 'out-of-stock' :
            inventory.stock <= inventory.lowStockThreshold ? 'low-stock' :
            'in-stock';
          await inventory.save();
        }
      }
      await cart.deleteOne();
      // call email for order confirmation
      await sendEmailConfirmn.sendOrderConfirmationEmail({
        to: shopper.email,
        name: shopper.name || 'Customer',
        orderId: order._id.toString(),
        totalAmount: order.totalAmount,
        shippingAddress,
        items: cart.items.map(({ productId, quantity }) => ({
          title: productId.title,
          quantity,
          price: productId.basePrice
        }))
      });
      res.status(201).json({ message: 'Order placed', order });
  
    } catch (error) {
      console.error('Checkout error:', error);
      res.status(500).json({ message: 'Internal server error', error });
    }
  };
  
  
  // --- Shopper Order APIs ---
  
  // Get my orders
  const getMyOrders = async (req, res) => {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ orders });
  };
  
  // Get single order
  const getOrderById = async (req, res) => {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({ order });
  };

  const getShoper = async (req, res) => {
    try {
      const shoper = await shoperModel.findById(req.user._id).select('-password');
      const cart = await Cart.findOne({ userId: req.user._id }).populate({
        path: 'items.productId',
        model: 'Product'
      });
      console.log('Cart items:', cart ? cart.items : 'No items in cart');
      
      let cartItems = {};
      if (cart && cart.items) {
        cart.items.forEach(item => {
          if (item.productId && item.productId._id) {
            cartItems[item.productId._id.toString()] = item.quantity;
          } else {
            console.warn('🟡 Warning: Missing productId in cart item:', item);
          }
        });
      }
  
      const shoperData = {
        cartItems,
        shoper
      };
  
      if (!shoper) return res.status(404).json({ message: 'Shoper not found' });
  
      res.status(200).json({ data: shoperData });
    } catch (error) {
      console.error('Get Shoper error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  
  




module.exports = {
    shoperSignUp,
    shoperLogin,
    addAddress,
    updateAddress,
    getStoreProducts,
    getPublicProductById,
    addToCart,
    updateCartItem,
    removeCartItem,
    getCart,
    checkout,
    getMyOrders,
    getOrderById,
    getShoper
}



  