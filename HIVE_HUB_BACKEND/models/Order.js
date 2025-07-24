const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shoper' },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    price: Number
  }],
  shippingAddress: String,
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  deliveryStatus: { type: String, enum: ['pending', 'shipped','out for delivery', 'delivered'], default: 'pending' },
  totalAmount: Number,
  orderDate: { type: Date, default: Date.now },
  discount: { type: Number, default: 0 }
}, { timestamps: true });
module.exports = mongoose.model('Order', orderSchema);
