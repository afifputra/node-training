import { Request, Response, NextFunction } from "express";

import Product from "../models/product";

type Product = {
  id?: string;
  title: string;
  imageUrl: string;
  description: string;
  price: number;
};

const getAddProduct = (req: Request, res: Response, next: NextFunction) => {
  res.render("admin/edit-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

const postAddProduct = (req: Request, res: Response, next: NextFunction) => {
  const title: string = req.body.title;
  const imageUrl: string = req.body.imageUrl;
  const price: number = req.body.price;
  const description: string = req.body.description;

  Product.create({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
  })
    .then(() => {
      res.redirect("/");
    })
    .catch((error: Error) => console.log(error));
};

const getEditProduct = (req: Request, res: Response, next: NextFunction) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect("/");
  }

  const prodId = req.params.productId;

  Product.findByPk(prodId)
    .then((result: unknown) => {
      const product = result as Product;
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        docTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((error: Error) => console.log(error));
};

const postEditProduct = (req: Request, res: Response, next: NextFunction) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Product.update(
    {
      title: updatedTitle,
      price: updatedPrice,
      imageUrl: updatedImageUrl,
      description: updatedDesc,
    },
    { where: { id: prodId } }
  )
    .then(() => {
      console.log("UPDATED PRODUCT");
      res.redirect("/admin/products");
    })
    .catch((error: Error) => console.log(error));
};

const getProducts = (req: Request, res: Response, next: NextFunction) => {
  Product.findAll()
    .then((result: unknown) => {
      const products = result as Product[];
      res.render("admin/products", {
        prods: products,
        docTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((error: Error) => console.log(error));
};

const postDeleteProduct = (req: Request, res: Response, next: NextFunction) => {
  const prodId = req.body.productId;
  Product.destroy({ where: { id: prodId } })
    .then(() => {
      console.log("DESTROYED PRODUCT");
      res.redirect("/admin/products");
    })
    .catch((error: Error) => console.log(error));
};

export default {
  getAddProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  getProducts,
  postDeleteProduct,
};
