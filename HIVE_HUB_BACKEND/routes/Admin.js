const express = require('express');
const adminRouter = express.Router();
const adminController = require("../controllers/Admin");
const auth = require("../middleware/auth");

adminRouter.post('/signupAdmin', adminController.signupAdmin);
adminRouter.post('/signInAdmin', adminController.signInAdmin);
adminRouter.post("/createInviteCode",auth.adminAuth,adminController.createInviteCode);
adminRouter.get("/getAllInvites", auth.adminAuth, adminController.getAllInvites);
adminRouter.delete("/deleteInvite/:id", auth.adminAuth, adminController.deleteInvite);
adminRouter.patch("/blockUnblockInvite/:id", auth.adminAuth, adminController.blockUnblockInvite);
adminRouter.get("/getAllStores",auth.adminAuth,adminController.getAllStores);
adminRouter.patch("/approveStore/:id/approve",auth.adminAuth,adminController.approveStore);
adminRouter.post("/createPlan",auth.adminAuth,adminController.createPlan);
adminRouter.patch("/updatePlan/:id",auth.adminAuth,adminController.updatePlan);
adminRouter.delete("/deletePlan/:id",auth.adminAuth,adminController.deletePlan);
adminRouter.get("/getAllPlans",auth.adminAuth,adminController.getAllPlans);
adminRouter.patch("/activateORDeactivatePlan/:id", auth.adminAuth, adminController.activateORDeactivatePlan);
adminRouter.get("/getAdminData",auth.adminAuth,adminController.getAdminData);
adminRouter.get("/getAllUsersWithSubscriptions",auth.adminAuth,adminController.getAllUsersWithSubscriptions);

module.exports = adminRouter;
