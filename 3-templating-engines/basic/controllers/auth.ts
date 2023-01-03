import { Request, Response, NextFunction } from "express";

const getLogin = (_: Request, res: Response, __: NextFunction) => {
  res.render("auth/login", {
    docTitle: "Login",
    path: "/login",
  });
};

export default {
  getLogin,
};
