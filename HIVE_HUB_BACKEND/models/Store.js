const { object } = require('joi');
const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  subdomain: String,
  logo: String,
  description: String,
  tier: String,
  layout: {
    type: Object,
    default: {}
  },
  TemplateId : {
    type: Number,
    default: 1
  },
  githubRepo: String,
  vercelProjectId: String,
  paymentGateways: {
    stripe: { connected: Boolean, accountId: String },
    paypal: { connected: Boolean, clientId: String },
    razorpay: { connected: Boolean, accountId: String }
  },
  isApproved:{
    type:Boolean,
    default:false
  },
  isBlocked: {
    type:Boolean,
    default:false
  }
}, { timestamps: true });

module.exports = mongoose.model('Store', storeSchema);
