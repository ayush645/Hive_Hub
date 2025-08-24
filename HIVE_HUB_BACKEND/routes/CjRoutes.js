const express =  require("express");
const  { getCategories, getProductsByCategory } = require("../controllers/cjController");

const router = express.Router();

// Categories
router.get("/categories", getCategories);

// Products by Category
router.get("/products", getProductsByCategory);


module.exports = router;
