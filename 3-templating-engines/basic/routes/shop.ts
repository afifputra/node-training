import { Router } from "express";
import path from "path";

const router = Router();

const rootDir = require("../utils/path");
const adminData = require("./admin");

router.get("/", (req, res, next) => {
  const products = adminData.products;
  // res.sendFile(path.join(rootDir, "views", "shop.html"));
  res.render("shop", {
    prods: products,
    docTitle: "Shop",
    path: "/",
  });
});

module.exports = router;
