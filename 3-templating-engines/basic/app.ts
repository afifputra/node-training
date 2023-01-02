import path from "path";
import express from "express";
import bodyParser from "body-parser";

import { connect, set } from "mongoose";
import User from "./models/user";

import errorController from "./controllers/error";

import rootDir from "./utils/path";
import adminRoutes from "./routes/admin";
import shopRoutes from "./routes/shop";

declare module "express-serve-static-core" {
  interface Request {
    user?: typeof User;
  }
}

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "../", "public")));

app.use((req, __, next) => {
  // User.findByPk(1)
  //   .then((result: unknown) => {
  //     const user = result as { id: string; name: string; email: string };
  //     Object.assign(req, { user: user });
  //     next();
  //   })
  //   .catch((error: Error) => console.log(error));
  (async () => {
    try {
      const user = await User.findById("63b24750d12ed099c3c2dbcc")!;
      Object.assign(req, { user: user });
      next();
    } catch (error) {
      console.log(error);
    }
  })();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

set("strictQuery", true);

(async () => {
  try {
    await connect("mongodb+srv://web-app:online123@cluster0.5fapyff.mongodb.net/shop?retryWrites=true&w=majority");

    const registUser = await User.findOne();
    if (!registUser) {
      const user = new User({
        name: "Afif",
        email: "afif@mailinator.com",
        cart: {
          items: [],
        },
      });
      await user.save();
    }

    app.listen(3001);

    console.log("Connected to database");
  } catch (error) {
    console.log(error);
  }
})();
