const Subscription = require('../models/Subscription');

const requireActiveSubscription = async (req, res, next) => {
  const now = new Date();
  const subscription = await Subscription.findOne({
    userId: req.user._id,
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now }
  });
  console.log('Active subscription:', subscription);
  if (!subscription) {
    return res.status(403).json({ message: 'Active subscription required to access this feature.' });
  }

  req.subscription = subscription;
  next();
};

module.exports = requireActiveSubscription;
