const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shoper' },
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const variantSchema = new mongoose.Schema({
  size: String,         // e.g., S, M, L, XL
  color: String,        // optional (e.g., Red, Blue)
  stock: Number,
  sku: String,
  price: Number,
  discount: { type: Number, default: 0 } // percentage
}, { _id: false });

const productSchema = new mongoose.Schema({
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  title: String,
  description: String,
  basePrice: Number,          // base price (for single variant or fallback)
  category: String,
  tags: [String],
  images: [String],

  variants: [variantSchema],  // clothing support: sizes, colors
  attributes: {               // general-purpose specs (for electronics, etc.)
    type: Map,
    of: String
  },

  reviews: [reviewSchema],
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },

  isPublished: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
