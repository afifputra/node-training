import { Router } from "express";

import authController from "../controllers/auth";

const router = Router();

// GET => /login
router.get("/login", authController.getLogin);

// POST => /login
router.post("/login", authController.postLogin);

// POST => /logout
router.post("/logout", authController.postLogout);

export default router;
