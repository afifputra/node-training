import { Router } from "express";

const router = Router();

const adminController = require("../controllers/admin");

// GET => /admin/add-product
router.get("/add-product", adminController.getAddProduct);

// POST => /admin/add-product
router.post("/add-product", adminController.postAddProduct);

// GET => /admin/products
router.get("/products", adminController.getProducts);

module.exports = router;
