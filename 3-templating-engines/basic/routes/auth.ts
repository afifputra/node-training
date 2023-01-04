import { Router } from "express";

import authController from "../controllers/auth";

const router = Router();

// GET => /login
router.get("/login", authController.getLogin);

// GET => /signup
router.get("/signup", authController.getSignup);

// POST => /login
router.post("/login", authController.postLogin);

// POST => /logout
router.post("/logout", authController.postLogout);

// POST => /signup
router.post("/signup", authController.postSignup);

export default router;
