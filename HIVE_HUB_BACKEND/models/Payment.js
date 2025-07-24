const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['order', 'subscription'], // NEW
    required: true
  },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }, // nullable
  subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' }, // nullable
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' }, // optional for subscriptions
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // NEW: for subscription owner
  method: String, // stripe, razorpay, etc.
  transactionId: String,
  amount: Number,
  status: { type: String, enum: ['success', 'failed'], default: 'success' }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
