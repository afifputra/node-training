import { Router } from "express";
import isAuth from "../middleware/is-auth";

import adminController from "../controllers/admin";

const router = Router();

// GET => /admin/add-product
router.get("/add-product", isAuth, adminController.getAddProduct);

// POST => /admin/add-product
router.post("/add-product", isAuth, adminController.postAddProduct);

// GET => /admin/products
router.get("/products", isAuth, adminController.getProducts);

// GET => /admin/edit-product/:productId
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

// POST => /admin/edit-product
router.post("/edit-product", isAuth, adminController.postEditProduct);

// POST => /admin/delete-product
router.post("/delete-product", isAuth, adminController.postDeleteProduct);

export default router;
