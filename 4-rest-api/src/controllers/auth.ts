import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { hash, compare } from "bcryptjs";

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
    password: await hash(password, 12),
  });

  try {
    const result = await user.save();
    return res.status(201).json({ message: "User created.", userId: result._id });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong." });
  }
};

const login: RequestHandler = async (req, res, _) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials. E-Mail Not Found." });
    }

    const isEqual = await compare(password, user.password);

    if (!isEqual) {
      return res.status(401).json({ message: "Invalid credentials. Password is incorrect." });
    }

    return res.status(200).json({ message: "Logged in." });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong." });
  }
};

export default {
  register,
  login,
};
