const CommunityPost = require('../models/Community');
const { login } = require('./User');
const mongoose = require('mongoose');
const User = require('../models/User');
const Subscription = require("../models/Subscription");

// Create a post
const createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
     // Collect uploaded media (images/videos)
     const media = req.files?.map(file => ({
        url: file.path,
        type: file.mimetype.startsWith('video') ? 'video' : 'image'
      })) || [];
    const post = await CommunityPost.create({
      authorId: req.user._id,
      title,
      content,
      tags,
      media
    });
    res.status(201).json({ message: 'Post created', post });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// List visible posts
const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, tag, authorId, isAdminPost } = req.query;
    const subscription = await Subscription.findOne({ userId: req.user._id, isActive: true });
    const userPlanId = subscription?.planId;

    const onlyAdminPosts = isAdminPost === 'true';
    const onlyUserPosts = isAdminPost === 'false';

    const filter = { status: 'visible' };

    if (onlyAdminPosts) {
      filter.createdByAdmin = true;
      filter.visibleToPlans = { $in: [userPlanId] };
    } else if (onlyUserPosts) {
      filter.createdByAdmin = false;
    } else {
      filter.$or = [
        { createdByAdmin: false },
        { createdByAdmin: true, visibleToPlans: { $in: [userPlanId] } }
      ];
    }

    if (tag) filter.tags = tag;
    if (authorId) filter.authorId = authorId;

    const posts = await CommunityPost.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    // Collect all userIds for names (author + commenters)
    const userIds = new Set();
    posts.forEach(p => {
      if (p.authorId) userIds.add(p.authorId.toString());
      p.comments?.forEach(c => {
        if (c.userId) userIds.add(c.userId.toString());
      });
    });

    const users = await User.find({ _id: { $in: [...userIds] } }).select('_id name');
    const userMap = {};
    users.forEach(u => (userMap[u._id.toString()] = u.name));

    // Attach author and comment user names
    const enrichedPosts = posts.map(post => ({
      ...post,
      authorName: userMap[post.authorId?.toString()] || 'Unknown',
      comments: post.comments?.map(c => ({
        ...c,
        userName: userMap[c.userId?.toString()] || 'Unknown'
      })) || []
    }));

    const total = await CommunityPost.countDocuments(filter);

    res.status(200).json({
      posts: enrichedPosts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('getPosts error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};



  

// Get a specific post with comments
// const getPostById = async (req, res) => {
//     try {
//       const post = await CommunityPost.findOneAndUpdate(
//         { _id: req.params.id, status: 'visible' },
//         { $inc: { views: 1 } },
//         { new: true }
//       );
  
//       if (!post) return res.status(404).json({ message: 'Post not found' });
  
//       res.status(200).json({ post, views: post.views });
//     } catch (error) {
//       res.status(500).json({ message: 'Server error', error });
//     }
//   };

const getPostById = async (req, res) => {
  try {
    const post = await CommunityPost.findOneAndUpdate(
      { _id: req.params.id, status: 'visible' },
      { $inc: { views: 1 } },
      { new: true }
    ).lean();

    if (!post) return res.status(404).json({ message: 'Post not found' });

    const allUserIds = new Set([
      post.authorId?.toString(),
      ...post.likes.map(id => id?.toString()),
      ...post.comments.map(c => c.userId?.toString()),
      ...post.comments.flatMap(c => c.likes.map(id => id?.toString()))
    ]);
    const users = await User.find({ _id: { $in: [...allUserIds] } }).select('_id name');
    const userMap = {};
    users.forEach(u => userMap[u._id.toString()] = u.name);

    const enrichedPost = {
      ...post,
      authorName: userMap[post.authorId?.toString()] || 'Unknown',
      likes: post.likes.map(id => ({
        userId: id,
        name: userMap[id?.toString()] || 'Unknown'
      })),
      comments: post.comments.map(c => ({
        ...c,
        userName: userMap[c.userId?.toString()] || 'Unknown',
        likesWithNames: c.likes.map(id => ({
          userId: id,
          name: userMap[id?.toString()] || 'Unknown'
        }))
      }))
    };

    res.status(200).json({ post: enrichedPost, views: enrichedPost.views });

  } catch (error) {
    console.error('getPostById error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};


// Add comment to post
const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await CommunityPost.findById(req.params.id);
    if (!post || post.status !== 'visible') {
      return res.status(404).json({ message: 'Post not found or inactive' });
    }
    const user = await User.findById(req.user._id).select('name');
    if (!user) return res.status(404).json({ message: 'User not found' });

    post.comments.push({
      userId: req.user._id,
      userName: user.name,
      content,
      createdAt: new Date()
    });
    await post.save();

    res.status(200).json({ message: 'Comment added', post });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Admin updates post status
const updatePostStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['visible', 'flagged'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const post = await CommunityPost.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.status(200).json({ message: 'Post status updated', post });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete post by author
const deleteMyPost = async (req, res) => {
    try {
      console.log("Deleting post with ID:", req.params.id);
      console.log("User ID:", req.user._id);
  
      const post = await CommunityPost.findOne({
        _id: new mongoose.Types.ObjectId(req.params.id),
        authorId: req.user._id
      });
    //   console.log("Found post:", post);
      if (!post) return res.status(404).json({ message: 'Post not found or unauthorized' });
  
      post.status = 'deleted';
      await post.save();
  
      res.status(200).json({ message: 'Post deleted' });
    } catch (error) {
      console.error('Delete post error:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  };


// PATCH /community/posts/:id/like
const togglePostLike = async (req, res) => {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
  
    const userId = req.user._id;
    const index = post.likes.indexOf(userId);
  
    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }
  
    await post.save();
    res.status(200).json({ message: 'Post like toggled', likesCount: post.likes.length });
  };

  // PATCH /community/posts/:postId/comment/:commentId/like
const toggleCommentLike = async (req, res) => {
    const post = await CommunityPost.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
  
    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
  
    const userId = req.user._id;
    const index = comment.likes.indexOf(userId);
  
    if (index === -1) {
      comment.likes.push(userId);
    } else {
      comment.likes.splice(index, 1);
    }
  
    await post.save();
    res.status(200).json({ message: 'Comment like toggled', likesCount: comment.likes.length });
  };

  // DELETE /community/posts/:postId/comment/:commentId
const deleteComment = async (req, res) => {
    const post = await CommunityPost.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
  
    const comment = post.comments.id(req.params.commentId);
    if (!comment || comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }
  
    post.comments.pull({ _id: req.params.commentId });
    await post.save();
  
    res.status(200).json({ message: 'Comment deleted' });
  };
  
  
  

module.exports = {
  createPost,
  getPosts,
  getPostById,
  addComment,
  togglePostLike,
  toggleCommentLike,
  updatePostStatus,
  deleteMyPost,
  deleteComment
};
