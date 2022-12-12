import { Router } from "express";

const router = Router();

const shopController = require("../controllers/shop");

// GET => /
router.get("/", shopController.getIndex);

// GET => /products
router.get("/products", shopController.getProducts);

// GET => /products/:productId
router.get("/products/:productId", shopController.getProduct);

// GET => /cart
router.get("/cart", shopController.getCart);

// POST => /cart
router.post("/cart", shopController.postCart);

// POST => /cart-delete-item
router.post("/cart-delete-item", shopController.postCartDeleteProduct);

// GET => /orders
router.get("/orders", shopController.getOrders);

// GET => /checkout
router.get("/checkout", shopController.getCheckout);

module.exports = router;
