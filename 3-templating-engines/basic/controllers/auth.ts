import { Request, Response, NextFunction } from "express";
import { hash } from "bcryptjs";
import User, { UserInterface } from "../models/user";
import { Document } from "mongodb";

const getLogin = (_: Request, res: Response, __: NextFunction) => {
  res.render("auth/login", {
    docTitle: "Login",
    path: "/login",
  });
};

const getSignup = (_: Request, res: Response, __: NextFunction) => {
  res.render("auth/signup", {
    path: "/signup",
    docTitle: "Signup",
  });
};

const postLogin = async (req: Request, res: Response, __: NextFunction) => {
  const { email, password } = req.body;

  const fetchedUser = (await User.findOne({ email })) as UserInterface & Document;

  if (!fetchedUser) {
    return res.redirect("/login");
  }

  const isPasswordValid = await fetchedUser.comparePassword(password);

  if (!isPasswordValid) {
    return res.redirect("/login");
  }

  const { cart, ...user } = fetchedUser._doc;

  if (user) {
    Object.assign(req.session, { user, isLoggedIn: true });
    req.session!.save(() => {
      res.redirect("/");
    });
  } else {
    res.redirect("/login");
  }
};

const postLogout = (req: Request, res: Response, __: NextFunction) => {
  req.session?.destroy(() => {
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
    const encryptedPassword = await hash(password, 12);
    const user = new User({
      name,
      email,
      password: encryptedPassword,
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
