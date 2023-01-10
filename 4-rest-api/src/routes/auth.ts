import { Router } from "express";
import { body } from "express-validator";

import AuthController from "../controllers/auth";
import User from "../models/user";

const router = Router();

const signUpValidator = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom(async (value, _) => {
      const user = await User.findOne({ email: value });
      if (user) {
        return Promise.reject("E-Mail address already exists.");
      }
      return true;
    })
    .normalizeEmail(),
  body("password").trim().isLength({ min: 5 }),
  body("name").trim().not().isEmpty(),
];

// PUT /auth/signup
router.put("/signup", signUpValidator, AuthController.register);

// POST /auth/login
router.post("/login", AuthController.login);

export default router;
