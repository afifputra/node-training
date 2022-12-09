import { Router } from "express";

const router = Router();

const shopController = require("../controllers/shop");

// GET => /
router.get("/", shopController.getIndex);

// GET => /products
router.get("/products", shopController.getProducts);

// GET => /cart
router.get("/cart", shopController.getCart);

// GET => /checkout
router.get("/checkout", shopController.getCheckout);

module.exports = router;
