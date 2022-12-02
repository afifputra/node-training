import express from "express";
import bodyParser from "body-parser";

const app = express();
const adminRoutes = require("../routes/admin");
const shopRoutes = require("../routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(adminRoutes);
app.use(shopRoutes);

app.listen(3001);
