import { RequestHandler } from "express";
import Jwt from "jsonwebtoken";

const Auth: RequestHandler = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  const token = req.get("Authorization")?.split(" ")[1];

  try {
    if (!token) {
      req.isAuth = false;
      return next();
    }

    const decodedToken = Jwt.verify(token, "rimurutempest") as { userId: string };

    if (!decodedToken) {
      req.isAuth = false;
      return next();
    }

    req.userId = decodedToken.userId;
    req.isAuth = true;
    next();
  } catch (error) {
    const { message } = error as Error;
    res.status(401).json({
      message,
    });
  }
};

export default Auth;
