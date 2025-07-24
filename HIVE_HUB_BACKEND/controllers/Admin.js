const Invite = require('../models/Invite');
const crypto = require('crypto');
const userModel = require('../models/User');
const adminModel = require("../models/Admin");
const jwt = require('jsonwebtoken');
const responseCode = require("../utils/responseCode");
const message = require('../messages/message');
const Utility = require("../utils/utility");
const Store = require("../models/Store");
const SubscriptionPlan = require('../models/SubscriptionPlan');
const sendMail = require("../utils/mail"); // Assuming you have a utility function to send emails
const CommunityPost = require("../models/Community");

const signupAdmin = async (req,res) => {
    try {
        console.log("Hello");
           const data = req.body;
            let admin;
            if (Utility.isEmail(data.email)) {
                admin = await adminModel.findOne({ email: data.email });
            }
            if (admin) {
                return res.send({message:"admin already exist"});
            }
            data.password = await Utility.hashed_password(data.password);
            admin = await adminModel.create(data);
            if (admin) {
            return res.send({
                status: responseCode.CREATED,
                message: "Admin Created",
                data: admin,
            });
            } else {
            return res.send({
                status: responseCode.BAD_REQUEST,
                message: "Failed",
            });
            }
    } catch (error) {
        return res.send({message:"Server Error",error});
    }
  };

  const signInAdmin = async (req,res) => {
  try{
        const data = req.body;
        console.log("data==?",data);
        let admin = await adminModel.findOne({ email: data.email });
        if (!admin) {
            return res.send({message:"Admin not found"});
        }
        let match = await Utility.comparePasswordUsingBcrypt(
            data.password,
            admin.password
        );
        if (!match) {
            return res.send({message:"Invalid Password"});
        }
        admin = await adminModel.findOne({ _id: admin._id }).lean();
        admin.token = await Utility.jwtSign({ _id: admin._id, role: "ADMIN" });
        admin.type = "Bearer";
        admin.expire = await Utility.getJwtExpireTime();
        admin.refreshToken = await Utility.jwtRefreshSign({ _id: admin._id });
        return res.send({data:admin});
  } catch (error) {
    console.log(error);
    return res.send({message:"Server Error", error});
  }
}


const generateInviteCode = async () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code;
    while (true) {
      code = Array.from({ length: 6 }, () =>
        characters.charAt(Math.floor(Math.random() * characters.length))
      ).join('');
      const exists = await Invite.findOne({ code });
      if (!exists) break;
    }
    return code;
  };

// const createInviteCode = async (req, res) => {
//   try {
//     const code = await generateInviteCode();
//     console.log("code==>",code);
//     const invite = new Invite({
//       code,
//       used: false,
//     });
//     await invite.save();
//     res.status(201).json({ message: 'Invite code created', code: invite.code });
//   } catch (error) {
//     console.log('Error creating invite:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };


const createInviteCode = async (req, res) => {
    try {
      const { email, name } = req.body;
      // check for existing invite
      const existing = await Invite.findOne({ email });
      if (existing) return res.status(400).json({ message: 'Invite already sent to this email' });
      const inviteCode = await generateInviteCode();
      const invite = await Invite.create({email: email, code:inviteCode });
      await sendMail.sendInviteEmail(email, name, inviteCode);
      res.status(201).json({data:invite, message: 'Invite sent successfully' });
    } catch (error) {
      console.error('Error creating invite:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const getAllInvites = async (req, res) => {
    try {
      const invites = await Invite.find({ isDeleted: false });
      res.status(200).json({
        message: 'Invites fetched successfully',
        count: invites.length,
        invites
      });
    } catch (error) {
      console.error('Error fetching invites:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const deleteInvite = async (req, res) => {
    try {
      const { id } = req.params;
      const invite = await Invite.findById(id);
      if (!invite) return res.status(404).json({ message: 'Invite not found' });
      
      invite.isDeleted = true;
      await invite.save();
      
      res.status(200).json({ message: 'Invite deleted successfully' });
    } catch (error) {
      console.error('Error deleting invite:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  const blockUnblockInvite = async (req, res) => {
    try {
        const {id} = req.params;
        if (!id) {
          return res.status(400).json({ message: 'Invite ID is required' });
        }
        const invite = await Invite.findById(id);
        console.log("invite==>",invite);
        
        if (!invite) {
          return res.status(404).json({ message: 'Invite not found' });
        }
        invite.isBlocked = !invite.isBlocked; // Toggle the isBlocked status
        await invite.save();
        res.status(200).json({
          message: `Invite ${invite.isBlocked ? 'blocked' : 'unblocked'} successfully`,
          isBlocked: invite.isBlocked,
          invite
        });
    } catch (error) {
      console.error('Error blocking/unblocking invite:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

const getAllStores = async (req, res) => {
    try {
      const query = {};
      if (req.query.isApproved !== undefined) {
        query.isApproved = req.query.isApproved === 'true';
      }
      if (req.query.isBlocked !== undefined) {
        query.isBlocked = req.query.isBlocked === 'true';
      }
      const stores = await Store.find(query).populate('ownerId', 'email name');
  
      res.status(200).json({
        message: 'Stores fetched successfully',
        count: stores.length,
        stores
      });
    } catch (error) {
      console.error('Error fetching stores:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


  const approveStore = async (req, res) => {
    try {
      const store = await Store.findById(req.params.id);
      if (!store) return res.status(404).json({ message: 'Store not found' });
  
      store.isApproved = true;
      await store.save();
  
      res.status(200).json({ message: 'Store approved successfully', store });
    } catch (error) {
      console.error('Error approving store:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const createPlan  = async (req, res) => {
    try {
        const { name, price, offer, features, durationInDays } = req.body;
        const plan = await SubscriptionPlan.create({ name, price, offer, features, durationInDays });
        res.status(201).json({ message: 'Plan created', plan });
    } catch (error) {
      console.error('Error creating subscription plan:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const updatePlan = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, price, offer, features, durationInDays } = req.body;
      const plan = await SubscriptionPlan.findByIdAndUpdate(id, {
        name,
        price,
        offer,
        features,
        durationInDays
      }, { new: true });
  
      if (!plan) return res.status(404).json({ message: 'Plan not found' });
  
      res.status(200).json({ message: 'Plan updated successfully', plan });
    } catch (error) {
      console.error('Error updating subscription plan:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const deletePlan = async (req, res) => {
    try {
      const { id } = req.params;
      const plan = await SubscriptionPlan.findById(id);
      if (!plan) return res.status(404).json({ message: 'Plan not found' });
      // set isDeleted to true instead of removing from DB
      plan.isDeleted = true;
      await plan.save();
      res.status(200).json({data:plan, message: 'Plan deleted successfully' });
    } catch (error) {
      console.error('Error deleting subscription plan:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const activateORDeactivatePlan = async (req, res) => {
    try {
      const { id } = req.params;
      const plan = await SubscriptionPlan.findById(id);
      if (!plan) return res.status(404).json({ message: 'Plan not found' });
  
      plan.isActive = !plan.isActive; // Toggle the isActive status
      await plan.save();
      res.status(200).json({
        message: `Plan ${plan.isActive ? 'activated' : 'deactivated'} successfully`,
        isActive: plan.isActive,
        plan
      });
    } catch (error) {
      console.error('Error activating/deactivating plan:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const getAllPlans = async (req, res) => {
    try {
      const plans = await SubscriptionPlan.find({ isDeleted: false }).lean();
      res.status(200).json({ message: 'Plans fetched successfully', plans });
    } catch (error) {
      console.error('Error fetching plans:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const getAdminData = async (req,res) => {
    try {
      const admin = await adminModel.findById(req.admin._id);
      if(!admin){
        return res.send({message:"admin not found"});
      }
      return res.send({data:admin,message:"admin found"});
    } catch (error) {
      console.error('Error fetching plans:', error);
      res.status(500).json({message:"internal server error"});
    }
  }

  const createAdminPost = async (req, res) => {
    try {
      let { title, content, tags, visibleToPlans } = req.body;
      console.log("title==>",title);
      
      visibleToPlans = Array.isArray(visibleToPlans)
      ? visibleToPlans
      : visibleToPlans
        ? [visibleToPlans]
        : [];

      if (!visibleToPlans.length) {
        return res.status(400).json({ message: 'visibleToPlans must be a non-empty array of plan IDs' });
      }
  
      const validPlans = await SubscriptionPlan.find({ _id: { $in: visibleToPlans } }).select('_id');
      if (validPlans.length !== visibleToPlans.length) {
        return res.status(400).json({ message: 'Some provided plan IDs are invalid' });
      }
      // Collect uploaded media (image or video)
      const media = req.files?.map(file => ({
        url: file.path,
        type: file.mimetype.startsWith('video') ? 'video' : 'image'
      })) || [];
  
      const post = await CommunityPost.create({
        authorId: req.admin._id, // Admin user
        title,
        content,
        tags,
        media,
        createdByAdmin: true,
        visibleToPlans
      });
      res.status(201).json({ message: 'Admin post created successfully', post });
    } catch (error) {
      console.error('Error creating admin post:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  };


  const getAllAdminPosts = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const filter = {
        authorId: req.admin._id,
        createdByAdmin: true,
        status: { $ne: 'deleted' }
      };
  
      const posts = await CommunityPost.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
  
      const total = await CommunityPost.countDocuments(filter);
  
      res.status(200).json({
        posts,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching admin posts:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  };

  const getAdminPostById = async (req, res) => {
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
      const users = await adminModel.find({ _id: { $in: [...allUserIds] } }).select('_id name');
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


  const updateAdminPost = async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: 'Post ID is required' });
      // Validate request body
      let { title, content, tags, visibleToPlans } = req.body;
      console.log("title==>",title);
      
      if (!title && !content && !tags && !visibleToPlans) {
        return res.status(400).json({ message: 'At least one field is required to update' });
      }
  
      visibleToPlans = Array.isArray(visibleToPlans)
        ? visibleToPlans
        : visibleToPlans
          ? [visibleToPlans]
          : [];
  
      const post = await CommunityPost.findOne({
        _id: id,
        authorId: req.admin._id,
        createdByAdmin: true
      });
  
      if (!post) return res.status(404).json({ message: 'Post not found' });
  
      if (title) post.title = title;
      if (content) post.content = content;
      if (tags) post.tags = tags.split(',').map(t => t.trim());
      if (visibleToPlans.length) post.visibleToPlans = visibleToPlans;
  
      // Update media (optional)
      if (req.files && req.files.length > 0) {
        const media = req.files.map(file => ({
          url: file.path,
          type: file.mimetype.startsWith('video') ? 'video' : 'image'
        }));
        post.media = media;
      }
  
      await post.save();
      res.status(200).json({ message: 'Post updated successfully', post });
  
    } catch (error) {
      console.error('Error updating admin post:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  };


  const deleteAdminPost = async (req, res) => {
    try {
      const { id } = req.params;
      const post = await CommunityPost.findOne({
        _id: id,
        authorId: req.admin._id,
        createdByAdmin: true
      });
  
      if (!post) return res.status(404).json({ message: 'Post not found or unauthorized' });
  
      post.status = 'deleted';
      await post.save();
  
      res.status(200).json({ message: 'Post deleted successfully' });
  
    } catch (error) {
      console.error('Error deleting admin post:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  };


  const getAllCommunityPosts = async (req, res) => {
    try {
      const { page = 1, limit = 10, status,isAdmin} = req.query;
  
      const filter = {};
      if (status) filter.status = status; // e.g., 'visible', 'flagged'
      filter.createdByAdmin = isAdmin;
      console.log("filter==>",filter);
      
  
      const posts = await CommunityPost.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .lean();
  
      const total = await CommunityPost.countDocuments(filter);
  
      res.status(200).json({
        posts,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Admin getAllCommunityPosts error:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  };

  const togglePostFlag = async (req, res) => {
    try {
      const post = await CommunityPost.findById(req.params.id);
      if (!post) return res.status(404).json({ message: 'Post not found' });
  
      post.status = post.status === 'flagged' ? 'visible' : 'flagged';
      await post.save();
  
      res.status(200).json({ message: `Post marked as ${post.status}`, post });
    } catch (error) {
      console.error('Error toggling post flag:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  };

  const deleteCommentAsAdmin = async (req, res) => {
    try {
      const { postId, commentId } = req.params;
  
      const post = await CommunityPost.findById(postId);
      console.log("POST==>",post);
      
      if (!post) return res.status(404).json({ message: 'Post not found' });
  
      console.log("post.comments ==>", post.comments);
      console.log("Deleting commentId:", commentId);
  
      const index = post.comments.findIndex((comment) =>
        comment._id?.toString() === commentId.toString()
      );
  
      if (index === -1) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      post.comments.splice(index, 1);
      await post.save();
  
      res.status(200).json({ message: 'Comment deleted by admin' });
    } catch (error) {
      console.error('Admin delete comment error:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  };  


  const deletePostAsAdmin = async (req, res) => {
    try {
      const post = await CommunityPost.findById(req.params.id);
      if (!post) return res.status(404).json({ message: 'Post not found' });
  
      post.status = "deleted";
      await post.save();
      res.status(200).json({ message: `Post marked as ${post.status}`, post });
    } catch (error) {
      console.error('Error toggling post flag:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  };


  const addCommentAsAdmin = async (req, res) => {
    try {
      const { content } = req.body;
      const post = await CommunityPost.findById(req.params.id);
      if (!post || post.status !== 'visible') {
        return res.status(404).json({ message: 'Post not found or inactive' });
      }
  
      post.comments.push({
        userId: req.admin._id,
        userName:"Hivehub",
        content,
        createdAt: new Date()
      });
      await post.save();
  
      res.status(200).json({ message: 'Comment added', post });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };



  const getAllUsersWithSubscriptions = async (req, res) => {
    try {
      const usersWithSubscriptions = await userModel.aggregate([
        {
          $match: { isDeleted: false }
        },
        {
          $lookup: {
            from: 'subscriptions',
            localField: '_id',
            foreignField: 'userId',
            as: 'subscription'
          }
        },
        {
          $unwind: {
            path: '$subscription',
            preserveNullAndEmptyArrays: true // Users without subscription also included
          }
        },
        {
          $lookup: {
            from: 'subscriptionplans',
            localField: 'subscription.planId',
            foreignField: '_id',
            as: 'subscription.planDetails'
          }
        },
        {
          $unwind: {
            path: '$subscription.planDetails',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            email: 1,
            role: 1,
            tier: 1,
            isBlocked: 1,
            isEmailVerify: 1,
            createdAt: 1,
            subscription: {
              _id: '$subscription._id',
              isActive: '$subscription.isActive',
              startDate: '$subscription.startDate',
              endDate: '$subscription.endDate',
              plan: {
                _id: '$subscription.planDetails._id',
                name: '$subscription.planDetails.name',
                price: '$subscription.planDetails.price',
                offer: '$subscription.planDetails.offer',
                features: '$subscription.planDetails.features',
                durationInDays: '$subscription.planDetails.durationInDays'
              }
            }
          }
        }
      ]);
  
      res.status(200).json({ users: usersWithSubscriptions });
    } catch (error) {
      console.error('Error fetching users with subscriptions:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };  

  
  
  
  
  
  
  
  

module.exports = { 
    signupAdmin,
    signInAdmin,
    createInviteCode,
    getAllInvites,
    deleteInvite,
    blockUnblockInvite,
    getAllStores,
    approveStore,
    createPlan,
    updatePlan,
    deletePlan,
    activateORDeactivatePlan,
    getAllPlans,
    getAdminData,
    createAdminPost,
    getAllAdminPosts,
    updateAdminPost,
    deleteAdminPost,
    getAdminPostById,
    getAllCommunityPosts,
    togglePostFlag,
    deleteCommentAsAdmin,
    deletePostAsAdmin,
    addCommentAsAdmin,
    getAllUsersWithSubscriptions,
};
