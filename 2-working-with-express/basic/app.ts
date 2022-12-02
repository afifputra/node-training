import express from "express";
import bodyParser from "body-parser";

const app = express();
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).send(`<h1>Page Not Found!</h1>`);
});

app.listen(3001);
