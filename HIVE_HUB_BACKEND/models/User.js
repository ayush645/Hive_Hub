const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'storeOwner'], default: 'storeOwner' },
  tier: { type: String, enum: ['free', 'standard', 'premium'], default: 'free' },
  inviteCode: String,
  stripeCustomerId: String,
  isBlocked:{
    type:Boolean,
    default:false
  },
  isDeleted:{
    type:Boolean,
    default:false
  },
  isEmailVerify: {
    type: Boolean,
    default: false,
  },
  deviceType: { type: String, default: "" },
  deviceToken: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
