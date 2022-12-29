import path from "path";
import express from "express";
import bodyParser from "body-parser";

import { mongoConnect } from "./utils/database";
import { User } from "./models/user";

import errorController from "./controllers/error";

import rootDir from "./utils/path";
import adminRoutes from "./routes/admin";
import shopRoutes from "./routes/shop";

declare module "express-serve-static-core" {
  interface Request {
    user?: { _id: string; name: string; email: string };
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
      const user = await User.findById("63acff144e363d38e6afbc69");
      console.log(user);
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

mongoConnect(() => {
  app.listen(3001);
});
