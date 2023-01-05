import { Request, Response, NextFunction } from "express";
import { hash } from "bcryptjs";
import mail from "@sendgrid/mail/src/mail";
// import { createTransport } from "nodemailer";
// import sendGrid from "nodemailer-sendgrid";

import User, { UserInterface } from "../models/user";
import { Document } from "mongodb";

// const transporter = createTransport(
//   sendGrid({
//     apiKey: "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",
//   })
// );

mail.setApiKey("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");

const getLogin = (req: Request, res: Response, __: NextFunction) => {
  const message = req.flash("error");

  res.render("auth/login", {
    docTitle: "Login",
    path: "/login",
    errorMessage: message.length > 0 ? message[0] : null,
  });
};

const getSignup = (req: Request, res: Response, __: NextFunction) => {
  const message = req.flash("error");

  res.render("auth/signup", {
    path: "/signup",
    docTitle: "Signup",
    errorMessage: message.length > 0 ? message[0] : null,
  });
};

const postLogin = async (req: Request, res: Response, __: NextFunction) => {
  const { email, password } = req.body;

  const fetchedUser = (await User.findOne({ email })) as UserInterface & Document;

  if (!fetchedUser) {
    req.flash("error", "Invalid email.");
    return res.redirect("/login");
  }

  const isPasswordValid = await fetchedUser.comparePassword(password);

  if (!isPasswordValid) {
    req.flash("error", "Invalid password.");
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
      req.flash("error", "Email already exists.");
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

    // try {
    //   await transporter.sendMail({
    //     to: email,
    //     from: "<>",
    //     subject: "Signup Succeeded!",
    //     html: "<h1>You successfully signed up!</h1>",
    //   });
    // } catch (error) {
    //   console.log(error);
    // }

    try {
      await mail.send({
        to: email,
        from: "renoa230112@gmail.com",
        subject: "Signup Succeeded!",
        html: "<h1>You successfully signed up!</h1>",
      });
      res.redirect("/login");
    } catch (error) {
      console.log(error.response.body.errors);
    }
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
