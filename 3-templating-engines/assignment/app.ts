import express from "express";
import bodyParser from "body-parser";

const app = express();

const homeRoutes = require("./routes/home");
const userRoutes = require("./routes/user");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(userRoutes);
app.use(homeRoutes.router);

app.use((req, res, next) => {
  res.status(404).render("404", {
    docTitle: "Page Not Found",
  });
});

app.listen(3002);
