import { Router } from "express";
import path from "path";
import { stringify } from "querystring";

const router = Router();

const rootDir = require("../utils/path");

const products: {
  title: string;
}[] = [];

// GET => /admin/add-product
router.get("/add-product", (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "add-product.html"));
});

// POST => /admin/add-product
router.post("/add-product", (req, res, next) => {
  const title: string = req.body.title;
  products.push({ title });
  res.redirect("/");
});

module.exports = {
  router,
  products,
};
