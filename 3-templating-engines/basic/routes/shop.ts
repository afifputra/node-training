import { Router } from "express";

const router = Router();

const productsController = require("../controllers/products");

router.get("/", productsController.getProducts);

module.exports = router;
