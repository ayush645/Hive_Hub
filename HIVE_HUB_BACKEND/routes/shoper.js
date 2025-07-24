const express = require('express');
const shoperRouter = express.Router();
const shoperController = require("../controllers/shoper");
const auth = require("../middleware/auth");

// Shoper Routes
shoperRouter.post("/shoperSignUp", shoperController.shoperSignUp);
shoperRouter.post("/shoperLogin", shoperController.shoperLogin);
shoperRouter.post("/addAddress", auth.shoperAuth, shoperController.addAddress);
shoperRouter.put("/updateAddress/:index", auth.shoperAuth, shoperController.updateAddress);
shoperRouter.get("/getShoper", auth.shoperAuth, shoperController.getShoper);

shoperRouter.get("/getStoreProducts/:subdomain", shoperController.getStoreProducts);
shoperRouter.get("/getPublicProductById/:id", shoperController.getPublicProductById);
shoperRouter.post("/addToCart",auth.shoperAuth,shoperController.addToCart);
shoperRouter.put("/updateCartItem",auth.shoperAuth, shoperController.updateCartItem);
shoperRouter.delete("/removeCartItem/:productId",auth.shoperAuth,shoperController.removeCartItem);
shoperRouter.get("/getCart",auth.shoperAuth,shoperController.getCart);
shoperRouter.post("/checkout",auth.shoperAuth,shoperController.checkout);
shoperRouter.get("/getMyOrders",auth.shoperAuth,shoperController.getMyOrders);
shoperRouter.get("/getOrderById/:id",auth.shoperAuth,shoperController.getOrderById);



// Export the shoper router
module.exports = shoperRouter;
