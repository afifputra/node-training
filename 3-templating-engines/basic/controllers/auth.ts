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

const getSignup = (_: Request, res: Response, __: NextFunction) => {
  res.render("auth/signup", {
    path: "/signup",
    docTitle: "Signup",
    isAuthenticated: false,
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

const postSignup = async (req: Request, res: Response, ___: NextFunction) => {
  const { name, email, password } = req.body;
  // Should Validate - But Not Now
  try {
    const userDoc = await User.findOne({ email });
    if (userDoc) {
      return res.redirect("/signup");
    }
    const user = new User({
      name,
      email,
      password,
      cart: { items: [] },
    });
    await user.save();
    res.redirect("/login");
  } catch (error) {
    console.log(error);
  }
};

export default {
  getLogin,
  getSignup,
  postLogin,
  postLogout,
  postSignup,
};

// store user on session
// use session data
