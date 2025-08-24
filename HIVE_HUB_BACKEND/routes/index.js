const router = require("express").Router();
const userRouter = require("./User");
const adminRouter = require("./Admin");
const communityRouter = require("./Community");
const shoperRouter = require("./shoper");
const cjRoutes = require("./CjRoutes");
 
router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/community", communityRouter);
router.use("/shoper", shoperRouter);
router.use("/cj", cjRoutes);


 
module.exports = router;
