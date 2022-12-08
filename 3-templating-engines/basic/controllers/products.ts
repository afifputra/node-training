import { Request, Response, NextFunction } from "express";
const Product = require("../models/product");

module.exports.getAddProduct = (req: Request, res: Response, next: NextFunction) => {
  res.render("add-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    activeAddProduct: true,
    formsCss: true,
    productCss: true,
  });
};

module.exports.postAddProduct = (req: Request, res: Response, next: NextFunction) => {
  const title: string = req.body.title;
  const product = new Product(title);
  product.save();
  res.redirect("/");
};

module.exports.getProducts = (req: Request, res: Response, next: NextFunction) => {
  const products = Product.fetchAll();
  res.render("shop", {
    prods: products,
    docTitle: "Shop",
    path: "/",
    hasProducts: products.length > 0,
    activeShop: true,
    productCss: true,
  });
};