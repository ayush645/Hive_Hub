const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema({
  name: { type: String, required: true }, // "standard", "premium"
  price: { type: Number, required: true },
  offer:{
    type: Number, // "10% off", "20% off", etc.
    default: 0
  },
  features: [String], // ["Multiple Products", "Custom Domain", etc.]
  durationInDays: Number, // optional: 30, 365
  isActive: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
