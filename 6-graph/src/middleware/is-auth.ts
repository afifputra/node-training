import { RequestHandler } from "express";
import Jwt from "jsonwebtoken";

const isAuth: RequestHandler = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return res.status(401).json({
      message: "Not authenticated.",
    });
  }

  const token = req.get("Authorization")?.split(" ")[1];

  try {
    if (!token) {
      throw new Error("Not authenticated.");
    }

    const decodedToken = Jwt.verify(token, "rimurutempest") as { userId: string };

    if (!decodedToken) {
      throw new Error("Not authenticated.");
    }

    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    const { message } = error as Error;
    res.status(401).json({
      message,
    });
  }
};

export default isAuth;
