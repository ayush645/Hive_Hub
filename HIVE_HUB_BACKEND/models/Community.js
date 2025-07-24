const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  authorId: mongoose.Schema.Types.ObjectId,
  title: String,
  content: String,
  media: [{
    url: String,
    type: { type: String, enum: ['image', 'video'] }
  }],
  tags: [String],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
  userId: mongoose.Schema.Types.ObjectId,
  userName:String,
  content: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // new
  createdAt: Date
}],
views: { type: Number, default: 0 },
status: { type: String, enum: ['visible', 'flagged', 'deleted'], default: 'visible' },
createdByAdmin: { type: Boolean, default: false },
visibleToPlans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan' }]
}, { timestamps: true });

module.exports = mongoose.model('CommunityPost', postSchema);
