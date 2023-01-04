import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import { Document } from "mongodb";

const getLogin = (req: Request, res: Response, __: NextFunction) => {
  const isLoggedIn = req.session?.isLoggedIn || false;

  res.render("auth/login", {
    docTitle: "Login",
    path: "/login",
    isAuthenticated: isLoggedIn,
  });
};

const postLogin = async (req: Request, res: Response, __: NextFunction) => {
  const { email, password } = req.body;
  console.log(email, password);

  const fetchedUser = (await User.findById("63b24750d12ed099c3c2dbcc")!) as Document;
  const { cart, ...user } = fetchedUser._doc;

  if (user) {
    Object.assign(req.session, { user, isLoggedIn: true });
    req.session!.save((error) => {
      console.log(error);
      res.redirect("/");
    });
  } else {
    res.redirect("/login");
  }
};

const postLogout = (req: Request, res: Response, __: NextFunction) => {
  req.session?.destroy((error) => {
    console.log(error);
    res.redirect("/");
  });
};

export default {
  getLogin,
  postLogin,
  postLogout,
};

// store user on session
// use session data
