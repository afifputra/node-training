import { Request, Response, NextFunction } from "express";

import Product from "../models/product";
// import { ObjectID } from "bson";

const getProducts = async (req: Request, res: Response, __: NextFunction) => {
  const isLoggedIn = req.session?.isLoggedIn || false;

  try {
    const products = await Product.find();
    res.render("admin/products", {
      prods: products ? products : [],
      docTitle: "Admin Products",
      path: "/admin/products",
      isAuthenticated: isLoggedIn,
    });
  } catch (error) {
    console.log(error);
  }
};

const getAddProduct = (req: Request, res: Response, __: NextFunction) => {
  const isLoggedIn = req.session?.isLoggedIn || false;

  res.render("admin/edit-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    isAuthenticated: isLoggedIn,
  });
};

const postAddProduct = async (req: Request, res: Response, _: NextFunction) => {
  const title: string = req.body.title;
  const imageUrl: string = req.body.imageUrl;
  const price: number = req.body.price;
  const description: string = req.body.description;
  const userId = req.session?.user;

  const product = new Product({
    title,
    imageUrl,
    price,
    description,
    userId,
  });
  await product.save();
  res.redirect("/");
};

const getEditProduct = async (req: Request, res: Response, _: NextFunction) => {
  const editMode = req.query.edit;
  const isLoggedIn = req.session?.isLoggedIn || false;

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
      isAuthenticated: isLoggedIn,
    });
  } catch (error) {
    console.log(error);
  }
};

const postEditProduct = async (req: Request, res: Response, _: NextFunction) => {
  const prodId: string = req.body.productId;
  const updatedTitle: string = req.body.title;
  const updatedPrice: number = +req.body.price;
  const updatedImageUrl: string = req.body.imageUrl;
  const updatedDesc: string = req.body.description;
  // const userId: ObjectID = new ObjectID(req.user!._id);

  try {
    const result = await Product.findByIdAndUpdate(
      prodId,
      {
        title: updatedTitle,
        price: updatedPrice,
        imageUrl: updatedImageUrl,
        description: updatedDesc,
      },
      { new: true }
    );

    if (!result) {
      return res.redirect("/");
    }

    res.redirect("/admin/products");
  } catch (error) {
    console.log(error);
  }
};

const postDeleteProduct = async (req: Request, res: Response, _: NextFunction) => {
  const prodId: string = req.body.productId;

  try {
    await Product.findByIdAndRemove(prodId);
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
