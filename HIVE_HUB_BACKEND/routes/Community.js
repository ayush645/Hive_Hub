const express = require('express');
const communityRouter = express.Router();
const adminController = require("../controllers/Admin");
const communityController = require("../controllers/Community");
const auth = require("../middleware/auth");
const {uploadCommunityMedia} = require('../middleware/communityUpload');

communityRouter.post('/createPost', auth.userAuth, uploadCommunityMedia.array('media', 5), communityController.createPost);
communityRouter.get('/getPosts',auth.userAuth, communityController.getPosts);
communityRouter.get('/getPostById/:id',auth.userAuth, communityController.getPostById);
communityRouter.put('/addComment/:id', auth.userAuth, communityController.addComment);
communityRouter.put("/togglePostLike/:id", auth.userAuth, communityController.togglePostLike);
communityRouter.put("/toggleCommentLike/:postId/:commentId", auth.userAuth, communityController.toggleCommentLike);
communityRouter.delete('/deleteComment/:postId/:commentId', auth.userAuth, communityController.deleteComment);
communityRouter.delete('/deleteMyPost/:id', auth.userAuth, communityController.deleteMyPost);
communityRouter.put('/updatePostStatus/:id', auth.userAuth, communityController.updatePostStatus);

//================================ ADMIN ==========================================================
communityRouter.post("/createAdminPost",auth.adminAuth,uploadCommunityMedia.array('media', 5),adminController.createAdminPost);
communityRouter.get("/getAllAdminPosts", auth.adminAuth, adminController.getAllAdminPosts);
communityRouter.put("/updateAdminPost/:id", auth.adminAuth,uploadCommunityMedia.array('media', 5), adminController.updateAdminPost);
communityRouter.delete("/deleteAdminPost/:id", auth.adminAuth, adminController.deleteAdminPost);
communityRouter.get("/getAdminPostById/:id", auth.adminAuth, adminController.getAdminPostById);
communityRouter.get("/getAllCommunityPosts", auth.adminAuth, adminController.getAllCommunityPosts);
// communityRouter.put("/updateCommunityPostStatus/:id", auth.adminAuth, adminController.updateCommunityPostStatus);
communityRouter.put("/togglePostFlag/:id", auth.adminAuth, adminController.togglePostFlag);
communityRouter.delete("/deleteCommentAsAdmin/:postId/:commentId", auth.adminAuth, adminController.deleteCommentAsAdmin);
communityRouter.delete("/deletePostAsAdmin/:id",auth.adminAuth,adminController.deletePostAsAdmin);
communityRouter.put("/addCommentAsAdmin/:id",auth.adminAuth,adminController.addCommentAsAdmin);


module.exports = communityRouter;
