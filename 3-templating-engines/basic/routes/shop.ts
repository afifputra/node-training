import { Router } from "express";

import shopController from "../controllers/shop";

const router = Router();

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

export default router;
