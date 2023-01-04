import { Router } from "express";
import isAuth from "../middleware/is-auth";

import shopController from "../controllers/shop";

const router = Router();

// GET => /
router.get("/", shopController.getIndex);

// GET => /products
router.get("/products", shopController.getProducts);

// GET => /products/:productId
router.get("/products/:productId", shopController.getProduct);

// GET => /cart
router.get("/cart", isAuth, shopController.getCart);

// POST => /cart
router.post("/cart", isAuth, shopController.postCart);

// POST => /cart-delete-item
router.post("/cart-delete-item", isAuth, shopController.postCartDeleteProduct);

// GET => /orders
router.get("/orders", isAuth, shopController.getOrders);

// POST => /create-order
router.post("/create-order", isAuth, shopController.postOrder);

// GET => /checkout
// router.get("/checkout", shopController.getCheckout);

export default router;
