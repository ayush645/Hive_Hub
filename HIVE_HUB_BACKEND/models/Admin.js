const { string, number } = require("joi");
const mongoose = require("mongoose");
const AdminSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isEmailVerify: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['ADMIN', 'SUBADMIN'],
      default: 'ADMIN',
    },
    roleType: {
      type: String,
      default: '',
    },
  },
  { timeStamp: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const adminModel = mongoose.model("Admin", AdminSchema);

module.exports = adminModel;
