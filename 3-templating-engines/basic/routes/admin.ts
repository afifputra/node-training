import { Router } from "express";

const router = Router();

const productsController = require("../controllers/products");

// GET => /admin/add-product
router.get("/add-product", productsController.getAddProduct);

// POST => /admin/add-product
router.post("/add-product", productsController.postAddProduct);

module.exports = router;
