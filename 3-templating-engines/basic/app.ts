import path from "path";
import express from "express";
import bodyParser from "body-parser";
import { connect, set } from "mongoose";
import session from "express-session";
import ConnectMongoDBSession from "connect-mongodb-session";
import Csrf from "csurf";

import User, { UserInterface } from "./models/user";

import errorController from "./controllers/error";

import rootDir from "./utils/path";
import adminRoutes from "./routes/admin";
import shopRoutes from "./routes/shop";
import authRoutes from "./routes/auth";

declare module "express-serve-static-core" {
  interface Request {
    user?: UserInterface;
  }
}

declare module "express-session" {
  interface SessionData {
    user?: UserInterface;
    isLoggedIn?: boolean;
  }
}

const MONGODB_URI = "mongodb+srv://web-app:online123@cluster0.5fapyff.mongodb.net/shop";

const MongoDBStore = ConnectMongoDBSession(session);

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
const csrfProtection = Csrf();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "../", "public")));
app.use(
  session({
    secret: "rimuru tempest",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
    store: store,
  })
);
app.use(csrfProtection);

app.use((req, __, next) => {
  if (!req.session?.isLoggedIn) {
    return next();
  }

  (async () => {
    try {
      const user = await User.findById(req.session?.user?._id)!;
      Object.assign(req, { user: user });
      next();
    } catch (error) {
      console.log(error);
    }
  })();
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session?.isLoggedIn || false;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

set("strictQuery", true);

(async () => {
  try {
    await connect(MONGODB_URI);

    app.listen(3001);

    console.log("Connected to database");
  } catch (error) {
    console.log(error);
  }
})();
