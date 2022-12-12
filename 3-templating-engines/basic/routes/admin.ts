import { Router } from "express";

const router = Router();

const adminController = require("../controllers/admin");

// GET => /admin/add-product
router.get("/add-product", adminController.getAddProduct);

// POST => /admin/add-product
router.post("/add-product", adminController.postAddProduct);

// GET => /admin/products
router.get("/products", adminController.getProducts);

// GET => /admin/edit-product/:productId
router.get("/edit-product/:productId", adminController.getEditProduct);

// POST => /admin/edit-product
router.post("/edit-product", adminController.postEditProduct);

module.exports = router;
