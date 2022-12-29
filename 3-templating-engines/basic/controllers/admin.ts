import { Request, Response, NextFunction } from "express";

import { Product } from "../models/product";

const getProducts = async (_: Request, res: Response, __: NextFunction) => {
  try {
    const products = await Product.fetchAll();
    res.render("admin/products", {
      prods: products ? products : [],
      docTitle: "Admin Products",
      path: "/admin/products",
    });
  } catch (error) {
    console.log(error);
  }
};

const getAddProduct = (_: Request, res: Response, __: NextFunction) => {
  res.render("admin/edit-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

const postAddProduct = async (req: Request, res: Response, _: NextFunction) => {
  const title: string = req.body.title;
  const imageUrl: string = req.body.imageUrl;
  const price: number = req.body.price;
  const description: string = req.body.description;

  const product = new Product(title, price, imageUrl, description, null);
  await product.save();
  res.redirect("/");
};

const getEditProduct = async (req: Request, res: Response, _: NextFunction) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect("/");
  }

  const prodId = req.params.productId;
  try {
    const product = await Product.findById(prodId);

    if (!product) {
      return res.redirect("/");
    }

    res.render("admin/edit-product", {
      docTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  } catch (error) {
    console.log(error);
  }
};

const postEditProduct = async (req: Request, res: Response, _: NextFunction) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  const updatedProduct = new Product(updatedTitle, updatedPrice, updatedImageUrl, updatedDesc, prodId);

  try {
    const result = await updatedProduct.save();
    if (!result) {
      return res.redirect("/");
    }
    res.redirect("/admin/products");
  } catch (error) {
    console.log(error);
  }
};

const postDeleteProduct = async (req: Request, res: Response, _: NextFunction) => {
  const prodId = req.body.productId;

  try {
    const deletedProduct = await Product.deleteById(prodId);

    if (!deletedProduct) {
      return res.redirect("/");
    }
    console.log("DESTROYED PRODUCT");
    res.redirect("/admin/products");
  } catch (error) {
    console.log(error);
  }
};

export default {
  getProducts,
  getAddProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
};
