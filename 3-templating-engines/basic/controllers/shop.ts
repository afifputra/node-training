import { Request, Response, NextFunction } from "express";

const Product = require("../models/product");
const Cart = require("../models/cart");

type Product = {
  id?: string;
  title: string;
  imageUrl: string;
  description: string;
  price: number;
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

module.exports.getProduct = (req: Request, res: Response, next: NextFunction) => {
  const prodId = req.params.productId;
  Product.findById(prodId, (product: Product) => {
    res.render("shop/product-detail", {
      product: product,
      docTitle: product.title,
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

module.exports.postCart = (req: Request, res: Response, next: NextFunction) => {
  const productId = req.body.productId;
  Product.findById(productId, (product: Product) => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect("/cart");
};

module.exports.getOrders = (req: Request, res: Response, next: NextFunction) => {
  res.render("shop/orders", {
    docTitle: "Your Orders",
    path: "/orders",
  });
};

module.exports.getCheckout = (req: Request, res: Response, next: NextFunction) => {
  res.render("shop/checkout", {
    docTitle: "Checkout",
    path: "/checkout",
  });
};
