import { Router } from "express";

import authController from "../controllers/auth";

const router = Router();

// GET => /login
router.get("/login", authController.getLogin);

export default router;
