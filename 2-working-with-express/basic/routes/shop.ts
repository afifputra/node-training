import { Router } from "express";
import path from "path";

const router = Router();

const rootDir = require("../utils/path");

router.get("/", (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "shop.html"));
});

module.exports = router;
