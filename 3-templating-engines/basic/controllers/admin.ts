import { Request, Response, NextFunction } from "express";

const Product = require("../models/product");

type Product = {
  title: string;
};

module.exports.getAddProduct = (req: Request, res: Response, next: NextFunction) => {
  res.render("admin/add-product", {
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
  Product.fetchAll((products: Product[]) => {
    res.render("admin/products", {
      prods: products,
      docTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};
