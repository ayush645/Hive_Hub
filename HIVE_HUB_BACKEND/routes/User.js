const express = require('express');
const userRouter = express.Router();
const userController = require("../controllers/User");
const storeController = require("../controllers/Store");
const auth = require("../middleware/auth");
const { uploadImage, uploadVideo } = require('../middleware/upload');
const requireActiveSubscription = require("../middleware/reuired");
const uploadMedia = require("../middleware/cloudinaryUpload");
const campaignController = require("../controllers/campaigns");

userRouter.post("/signup",userController.signup);
userRouter.post("/login",userController.login);
userRouter.get("/getUserData", auth.userAuth, userController.getUserData);

//============================= Store Routes ============================
userRouter.post("/createStore", auth.userAuth, requireActiveSubscription, uploadImage.single('logo'), storeController.createStore);
userRouter.put("/updateStore/:id", auth.userAuth,  uploadImage.single('logo'), storeController.updateStore);
userRouter.post("/createProduct",auth.userAuth,uploadImage.array('images', 5),storeController.createProduct);
userRouter.patch("/updateProduct/:id", auth.userAuth, uploadImage.array('images', 5), storeController.updateProduct);
userRouter.get("/getMyStoreWithProducts", auth.userAuth, storeController.getMyStoreWithProducts);
userRouter.get("/getAllPlans", userController.getAllPlans);
userRouter.post("/buySubscription", auth.userAuth, userController.buySubscription);
userRouter.get("/getMySubscription", auth.userAuth, userController.getMySubscription);
userRouter.get('/subdomain/:subdomain', storeController.getStoreBySubdomain);
userRouter.patch('/publicProductById/:id', auth.userAuth, storeController.publicProductById);

userRouter.post("/upload",uploadMedia.array('files', 10),storeController.uploadMdedia);

//============================= INVENTORY ROUTES =======================================
userRouter.post("/createInventory", auth.userAuth, storeController.createInventory);
userRouter.get("/getMyInventory", auth.userAuth, storeController.getMyInventory);
userRouter.patch('/updateInventory/:id', auth.userAuth, storeController.updateInventory);
userRouter.delete('/deleteInventory/:id', auth.userAuth, storeController.deleteInventory);

//============================ ORDER ROUTES =====================================================
userRouter.get("/getAllOrdersForStoreOwner",auth.userAuth,storeController.getAllOrdersForStoreOwner);
userRouter.get("/getOrderByIdForStoreOwner/:id",auth.userAuth,storeController.getOrderByIdForStoreOwner);
userRouter.put("/updateOrderStatus/:id",auth.userAuth,storeController.updateOrderStatus);
userRouter.get("/getDashboardStats/", auth.userAuth, storeController.getDashboardStats);


//========================== CAMPAIGNS ===============================================================
userRouter.post("/createCampaign",auth.userAuth,campaignController.createCampaign);
userRouter.put("/updateCampaignStatus/:id",auth.userAuth,campaignController.updateCampaignStatus);
userRouter.put("/updateCampaignMetrics/:id",auth.userAuth,campaignController.updateCampaignMetrics);
userRouter.get("/getMyCampaigns",auth.userAuth,campaignController.getMyCampaigns);
userRouter.put("/syncWithGoogleAds/:id",auth.userAuth,campaignController.syncWithGoogleAds);
userRouter.put("/syncWithFacebookAds/:id",auth.userAuth,campaignController.syncWithFacebookAds);


module.exports = userRouter;
