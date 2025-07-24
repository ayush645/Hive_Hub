const { string, number } = require("joi");
const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shoper' },
    items: [{
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number
    }]
  }, { timestamps: true });
const cartModel = mongoose.model("Cart", cartSchema);

module.exports = cartModel; 
