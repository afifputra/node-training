import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import User from "../models/user";

const register: RequestHandler = async (req, res, _) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ message: "Validation failed.", errors: errors.array() });
  }

  const { email, name, password } = req.body;

  const user = new User({
    email,
    name,
    password,
  });

  try {
    await user.save();
    return res.status(201).json({ message: "User created." });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong." });
  }
};

export default {
  register,
};
