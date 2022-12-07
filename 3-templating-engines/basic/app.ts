import express from "express";
import bodyParser from "body-parser";
import path from "path";

const app = express();

const rootDir = require("./utils/path");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "../", "public")));

app.use("/admin", adminRoutes.router);
app.use(shopRoutes);

app.use((req, res, next) => {
  // res.status(404).sendFile(path.join(__dirname, "../", "views", "404.html"));
  res.status(404).render("404", {
    docTitle: "Page Not Found",
  });
});

app.listen(3001);
