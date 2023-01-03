import { Request, Response, NextFunction } from "express";

const getLogin = (req: Request, res: Response, __: NextFunction) => {
  const isLoggedIn = req.get("Cookie")?.includes("loggedIn=true");

  res.render("auth/login", {
    docTitle: "Login",
    path: "/login",
    isAuthenticated: isLoggedIn,
  });
};

const postLogin = (req: Request, res: Response, __: NextFunction) => {
  const { email, password } = req.body;
  console.log(email, password);
  //   res.setHeader("Set-Cookie", "loggedIn=true");
  return res.redirect("/");
};

export default {
  getLogin,
  postLogin,
};
