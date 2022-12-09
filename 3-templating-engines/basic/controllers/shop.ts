import { Request, Response, NextFunction } from "express";

const Product = require("../models/product");

type Product = {
  title: string;
};

module.exports.getProducts = (req: Request, res: Response, next: NextFunction) => {
  Product.fetchAll((products: Product[]) => {
    res.render("shop/product-list", {
      prods: products,
      docTitle: "All Products",
      path: "/products",
    });
  });
};

module.exports.getIndex = (req: Request, res: Response, next: NextFunction) => {
  Product.fetchAll((products: Product[]) => {
    res.render("shop/index", {
      prods: products,
      docTitle: "Shop",
      path: "/",
    });
  });
};

module.exports.getCart = (req: Request, res: Response, next: NextFunction) => {
  res.render("shop/cart", {
    docTitle: "Your Cart",
    path: "/cart",
  });
};

module.exports.getCheckout = (req: Request, res: Response, next: NextFunction) => {
  res.render("shop/checkout", {
    docTitle: "Checkout",
    path: "/checkout",
  });
};
