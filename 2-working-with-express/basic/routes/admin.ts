import { Router } from "express";
import path from "path";

const router = Router();

// GET => /admin/add-product
router.get("/add-product", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "../", "views", "add-product.html"));
});

// POST => /admin/add-product
router.post("/add-product", (req, res, next) => {
  console.log(req.body.title);
  res.redirect("/");
});

module.exports = router;
