import { RequestHandler } from "express";

import { Product } from "../models/product";

const getAddProduct: RequestHandler = (_, res, __) => {
  res.render("admin/edit-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

const postAddProduct: RequestHandler = async (req, res, _) => {
  const title: string = req.body.title;
  const imageUrl: string = req.body.imageUrl;
  const price: number = req.body.price;
  const description: string = req.body.description;

  const product = new Product(title, price, imageUrl, description);
  await product.save();
  res.redirect("/admin/add-product");
};

const getEditProduct: RequestHandler = async (req, res, _) => {
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

// const postEditProduct = (req: Request, res: Response, next: NextFunction) => {
//   const prodId = req.body.productId;
//   const updatedTitle = req.body.title;
//   const updatedPrice = req.body.price;
//   const updatedImageUrl = req.body.imageUrl;
//   const updatedDesc = req.body.description;

//   Product.update(
//     {
//       title: updatedTitle,
//       price: updatedPrice,
//       imageUrl: updatedImageUrl,
//       description: updatedDesc,
//     },
//     { where: { id: prodId } }
//   )
//     .then(() => {
//       console.log("UPDATED PRODUCT");
//       res.redirect("/admin/products");
//     })
//     .catch((error: Error) => console.log(error));
// };

const getProducts: RequestHandler = async (_, res, __) => {
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

// const postDeleteProduct = (req: Request, res: Response, next: NextFunction) => {
//   const prodId = req.body.productId;
//   Product.destroy({ where: { id: prodId } })
//     .then(() => {
//       console.log("DESTROYED PRODUCT");
//       res.redirect("/admin/products");
//     })
//     .catch((error: Error) => console.log(error));
// };

export default {
  getAddProduct,
  postAddProduct,
  getEditProduct,
  getProducts,
};
