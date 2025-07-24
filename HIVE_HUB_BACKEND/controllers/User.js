const userModel = require('../models/User');
const Invite = require('../models/Invite');
const Utility = require("../utils/utility");
const SubscriptionPlan = require('../models/SubscriptionPlan');
const Payment = require('../models/Payment');
const Subscription = require('../models/Subscription');

const signup = async (req, res) => {
  try {
    const { email, inviteCode, name, password } = req.body;
    console.log("data==>",email,inviteCode,name);
    if(!email || !inviteCode || !password){
        return res.status(400).json({ message: 'email, inviteCode, and password are required' });
    }
    const u = await userModel.findOne({email});
    if(u){
        return res.status(400).json({ message: 'User already exist' });
    }
    const invite = await Invite.findOne({ code: inviteCode, used: false, email: email });
    console.log("invite==>",invite);
    if (!invite) return res.status(400).json({ message: 'Invalid invite code or email' });
    const hashedPassword = await Utility.hashed_password(password);
    const user = await userModel.create({ email, inviteCode, name, password: hashedPassword });
    invite.used = true;
    invite.usedBy = user._id;
    await invite.save();
    res.json({ data: user });
  } catch (err) {
    console.log(err);
    res.status(500).json({message:"ServerError", err });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    // const invite = await Invite.findOne({ code: inviteCode, usedBy: user._id });
    // if (!invite) return res.status(401).json({ message: 'Invalid invite code' });
    const match = await Utility.comparePasswordUsingBcrypt(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid password' });
    user = await userModel.findOne({ _id: user._id }).lean();

    user.token = await Utility.jwtSign({ _id: user._id, role: "storeOwner" });
    user.type = "Bearer";
    user.expire = await Utility.getJwtExpireTime();
    user.refreshToken = await Utility.jwtRefreshSign({ _id: user._id });
    res.json({ data:user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllPlans = async (req, res) => {
    try {
      const plans = await SubscriptionPlan.find({ isActive: true,isDeleted:false }).lean();
      res.status(200).json({ message: 'Plans fetched successfully', plans });
    } catch (error) {
      console.error('Error fetching plans:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


  const buySubscription = async (req, res) => {
    try {
      const { planId, paymentMethod = 'manual' } = req.body;
  
      const plan = await SubscriptionPlan.findById(planId);
      if (!plan) return res.status(404).json({ message: 'Plan not found' });
  
      const now = new Date();
      const endDate = new Date(now.getTime() + plan.durationInDays * 24 * 60 * 60 * 1000);
      const transactionId = `TXN-${Date.now()}`;
  
      // Step 1: Create subscription (only logical info)
      const subscription = await Subscription.create({
        userId: req.user._id,
        planId,
        startDate: now,
        endDate,
        isActive: true
      });
  
      // Step 2: Create payment (track real-world payment)
      const payment = await Payment.create({
        type: 'subscription',
        userId: req.user._id,
        subscriptionId: subscription._id,
        method: paymentMethod,
        transactionId,
        amount: plan.price,
        status: 'success'
      });
  
      res.status(201).json({
        message: 'Subscription and payment recorded',
        subscription,
        payment
      });
  
    } catch (error) {
      console.error('Buy subscription error:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  };
  
  // StoreOwner - Get Active Subscription
  const getMySubscription = async (req, res) => {
    try {
      const now = new Date();
      const sub = await Subscription.findOne({
        userId: req.user._id,
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now }
      }).populate('planId');
  
      if (!sub) return res.status(404).json({ message: 'No active subscription' });
  
      res.status(200).json({ subscription: sub });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };


  const getUserData = async (req, res) => {
    try {
      const userId = req.user._id;
  
      const user = await userModel.findById(userId).lean().select('-__v -isDeleted');
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const now = new Date();
  
      // Fetch active subscription
      const subscription = await Subscription.findOne({
        userId,
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now }
      }).populate('planId');
  
      const subscriptionData = subscription
        ? {
            isActive: true,
            startDate: subscription.startDate,
            endDate: subscription.endDate,
            plan: {
              _id: subscription.planId._id,
              name: subscription.planId.name,
              price: subscription.planId.price,
              durationInDays: subscription.planId.durationInDays,
              features: subscription.planId.features
            }
          }
        : {
            isActive: false,
            plan: null
          };
  
      res.status(200).json({
        message: 'User data with subscription fetched successfully',
        user,
        subscription: subscriptionData
      });
  
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Internal server error', error });
    }
  };


  const getDashboardStats = async (req, res) => {
    try {
      const { filter = 'monthly' } = req.query;
      const store = await Store.findOne({ ownerId: req.user._id });
      if (!store) return res.status(404).json({ message: 'Store not found' });
  
      const now = new Date();
      let groupBy, dateLimit;
  
      switch (filter) {
        case 'daily':
          groupBy = { year: { $year: "$createdAt" }, month: { $month: "$createdAt" }, day: { $dayOfMonth: "$createdAt" } };
          dateLimit = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'weekly':
          groupBy = { year: { $year: "$createdAt" }, week: { $week: "$createdAt" } };
          dateLimit = new Date(now.setDate(now.getDate() - 30));
          break;
        case 'yearly':
          groupBy = { year: { $year: "$createdAt" } };
          dateLimit = new Date(now.setFullYear(now.getFullYear() - 2));
          break;
        default:
          groupBy = { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } };
          dateLimit = new Date(now.setMonth(now.getMonth() - 12));
      }
  
      const matchStage = {
        storeId: store._id,
        paymentStatus: 'paid',
        createdAt: { $gte: dateLimit }
      };
  
      // ⏳ Time series stats
      const orderStats = await Order.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: groupBy,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: "$totalAmount" }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]);
  
      // 📦 Top-selling products (by quantity)
      const topProducts = await Order.aggregate([
        { $match: { storeId: store._id, paymentStatus: 'paid' } },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.productId',
            totalSold: { $sum: '$items.quantity' },
            totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
          }
        },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        { $project: { title: '$product.title', totalSold: 1, totalRevenue: 1 } },
        { $sort: { totalSold: -1 } },
        { $limit: 5 }
      ]);
  
      // 📊 Revenue by category
      const revenueByCategory = await Order.aggregate([
        { $match: { storeId: store._id, paymentStatus: 'paid' } },
        { $unwind: '$items' },
        {
          $lookup: {
            from: 'products',
            localField: 'items.productId',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        {
          $group: {
            _id: '$product.category',
            revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
            count: { $sum: '$items.quantity' }
          }
        },
        { $sort: { revenue: -1 } }
      ]);
  
      // Total Orders + Revenue
      const totalOrders = await Order.countDocuments({ storeId: store._id, paymentStatus: 'paid' });
      const totalRevenueResult = await Order.aggregate([
        { $match: { storeId: store._id, paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ]);
      const totalRevenue = totalRevenueResult[0]?.total || 0;
  
      res.status(200).json({
        totalOrders,
        totalRevenue,
        orderStats,
        topProducts,
        revenueByCategory
      });
  
    } catch (error) {
      console.error("Dashboard stats error:", error);
      res.status(500).json({ message: 'Server error', error });
    }
  };




module.exports = {
    signup,
    login,
    getUserData,
    getAllPlans,
    buySubscription,
    getMySubscription
}