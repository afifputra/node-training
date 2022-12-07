import { Router } from "express";
import path from "path";

const router = Router();

const rootDir = require("../utils/path");
const adminRoutes = require("./routes/admin");

const adminData = adminRoutes.products;

router.get("/", (req, res, next) => {
  console.log(adminData);
  res.sendFile(path.join(rootDir, "views", "shop.html"));
});

module.exports = router;
