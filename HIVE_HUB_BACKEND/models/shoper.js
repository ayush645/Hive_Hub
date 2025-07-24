const { string, number } = require("joi");
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: String,
    countryCode: String,
    phone: String,
    password: String, // hashed
    role: { type: String, enum: ['shopper'], default: 'shopper' },
    address: [{
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    }],
    isBlocked: { type: Boolean, default: false },
    deviceType: { type: String, default: "" },
    deviceToken: { type: String, default: "" },
  }, { timestamps: true });
const shoperModel = mongoose.model("Shoper", userSchema);   

module.exports = shoperModel;
