const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  type: { type: String, enum: ['email', 'google-ads', 'facebook-ads'] },
  platformCampaignId: String,
  startDate:{
    type:Date
  },
  endDate:{
    type:Date
  },
  status: { type: String, enum: ['draft', 'running', 'paused', 'completed'] ,default:"draft"},
  metrics: {
    impressions: {
      type:Number,
      default:0,
    },
    clicks:{
      type:Number,
      default:0,
    },
    conversions: {
      type:Number,
      default:0,
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Campaign', campaignSchema);
