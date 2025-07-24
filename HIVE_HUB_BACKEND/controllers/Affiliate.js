const Store = require("../models/Store");
const Affiliate = require("../models/Affiliate");



const generateAffiliateLink = async (req, res) => {
    try {
      const { affiliateUserId } = req.body;
      const store = await Store.findOne({ ownerId: req.user._id });
      if (!store) return res.status(404).json({ message: 'Store not found' });
  
      // Simple unique code
      const code = Math.random().toString(36).substring(2, 8);
      const referralLink = `${process.env.FRONTEND_URL}/store/${store.subdomain}?ref=${code}`;
      console.log("referralLink==>",referralLink);
  
      const affiliate = await Affiliate.create({
        storeId: store._id,
        affiliateUserId,
        referralLink,
        commissionsEarned: 0,
        sales: []
      });
  
      res.status(201).json({ message: 'Affiliate link created', affiliate });
    } catch (error) {
      console.error('Generate affiliate error:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  };


  const trackAffiliateSale = async (storeId, refCode, orderId, amount) => {
    const affiliate = await Affiliate.findOne({ storeId, referralLink: { $regex: refCode } });
    if (!affiliate) return;
  
    const commission = Math.floor(amount * 0.10); // 10% commission (configurable)
  
    affiliate.sales.push({ orderId, commission });
    affiliate.commissionsEarned += commission;
  
    await affiliate.save();
  };

  
  const getMyAffiliates = async (req, res) => {
    const store = await Store.findOne({ ownerId: req.user._id });
    if (!store) return res.status(404).json({ message: 'Store not found' });
  
    const affiliates = await Affiliate.find({ storeId: store._id }).populate('affiliateUserId', 'email name');
    res.status(200).json({ affiliates });
  };

  
  const getMyCommissions = async (req, res) => {
    const affiliate = await Affiliate.find({ affiliateUserId: req.user._id });
    res.status(200).json({ affiliate });
  };
  
  