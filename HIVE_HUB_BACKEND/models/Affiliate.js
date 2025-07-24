const mongoose = require('mongoose');

const affiliateSchema = new mongoose.Schema({
  storeId: mongoose.Schema.Types.ObjectId,
  affiliateUserId: mongoose.Schema.Types.ObjectId,
  referralLink: String,
  commissionsEarned: Number,
  sales: [{
    orderId: mongoose.Schema.Types.ObjectId,
    commission: Number
  }]
}, { timestamps: true });

module.exports = mongoose.model('Affiliate', affiliateSchema);
