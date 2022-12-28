import path from "path";
import express from "express";
import bodyParser from "body-parser";

import { mongoConnect } from "./utils/database";

import errorController from "./controllers/error";

import rootDir from "./utils/path";
import adminRoutes from "./routes/admin";
import shopRoutes from "./routes/shop";

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "../", "public")));

app.use((_, __, next) => {
  // User.findByPk(1)
  //   .then((result: unknown) => {
  //     const user = result as { id: string; name: string; email: string };
  //     Object.assign(req, { user: user });
  //     next();
  //   })
  //   .catch((error: Error) => console.log(error));
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(3001);
});
