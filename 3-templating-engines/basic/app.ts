import path from "path";

import express from "express";
import bodyParser from "body-parser";
const errorController = require("./controllers/error");

const app = express();

const rootDir = require("./utils/path");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "../", "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(3001);
