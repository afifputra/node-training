import { Request, Response, NextFunction } from "express";

const Product = require("../models/product");

type Product = {
  id?: string;
  title: string;
  imageUrl: string;
  description: string;
  price: number;
};

module.exports.getAddProduct = (req: Request, res: Response, next: NextFunction) => {
  res.render("admin/edit-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

module.exports.postAddProduct = (req: Request, res: Response, next: NextFunction) => {
  const title: string = req.body.title;
  const imageUrl: string = req.body.imageUrl;
  const price: number = req.body.price;
  const description: string = req.body.description;

  const product = new Product(null, title, imageUrl, description, price);
  product
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((error: Error) => console.log(error));
};

module.exports.getEditProduct = (req: Request, res: Response, next: NextFunction) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect("/");
  }

  const prodId = req.params.productId;

  Product.findById(prodId, (product: Product) => {
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      docTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  });
};

module.exports.postEditProduct = (req: Request, res: Response, next: NextFunction) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  const updatedProduct = new Product(prodId, updatedTitle, updatedImageUrl, updatedDesc, updatedPrice);
  updatedProduct.save();
  res.redirect("/admin/products");
};

module.exports.getProducts = (req: Request, res: Response, next: NextFunction) => {
  Product.fetchAll()
    .then(([rows, fieldData]: [Product[], any]) => {
      res.render("admin/products", {
        prods: rows,
        docTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((error: Error) => console.log(error));
};

module.exports.postDeleteProduct = (req: Request, res: Response, next: NextFunction) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId);
  res.redirect("/admin/products");
};
