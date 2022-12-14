import { Request, Response, NextFunction } from "express";

import Product from "../models/product";
import Cart from "../models/cart";

type Product = {
  id?: string;
  title: string;
  imageUrl: string;
  description: string;
  price: number;
};

const getProducts = (req: Request, res: Response, next: NextFunction) => {
  Product.findAll()
    .then((result: unknown) => {
      const products: Product[] = result as Product[];
      res.render("shop/product-list", {
        prods: products,
        docTitle: "All Products",
        path: "/products",
      });
    })
    .catch((error: Error) => console.log(error));
};

const getProduct = (req: Request, res: Response, next: NextFunction) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then((result: unknown) => {
      const product: Product = result as Product;
      res.render("shop/product-detail", {
        product: product,
        docTitle: product.title,
        path: "/products",
      });
    })
    .catch((error: Error) => console.log(error));
};

const getIndex = (req: Request, res: Response, next: NextFunction) => {
  Product.findAll()
    .then((result: unknown) => {
      const products: Product[] = result as Product[];
      res.render("shop/index", {
        prods: products,
        docTitle: "Shop",
        path: "/",
      });
    })
    .catch((error: Error) => console.log(error));
};

const getCart = (req: Request, res: Response, next: NextFunction) => {
  // Cart.getCart((cart: any) => {
  //   Product.fetchAll((products: Product[]) => {
  //     const cartProducts = [];
  //     for (const product of products) {
  //       const cartProductData = cart.products?.find((prod: any) => prod.id === product.id) || null;
  //       if (cartProductData) {
  //         cartProducts.push({ productData: product, qty: cartProductData.qty });
  //       }
  //     }
  res.render("shop/cart", {
    docTitle: "Your Cart",
    path: "/cart",
    products: [],
  });
  //   });
  // });
};

const postCart = (req: Request, res: Response, next: NextFunction) => {
  const productId = req.body.productId;
  // Product.findById(productId, (product: Product) => {
  // Cart.addProduct(productId, product.price);
  // });
  res.redirect("/cart");
};

const postCartDeleteProduct = (req: Request, res: Response, next: NextFunction) => {
  const productId = req.body.productId;
  // Product.findById(productId, (product: Product) => {
  // Cart.deleteProduct(productId, product.price);
  res.redirect("/cart");
  // });
};

const getOrders = (req: Request, res: Response, next: NextFunction) => {
  res.render("shop/orders", {
    docTitle: "Your Orders",
    path: "/orders",
  });
};

const getCheckout = (req: Request, res: Response, next: NextFunction) => {
  res.render("shop/checkout", {
    docTitle: "Checkout",
    path: "/checkout",
  });
};

export default {
  getProducts,
  getProduct,
  getIndex,
  getCart,
  postCart,
  postCartDeleteProduct,
  getOrders,
  getCheckout,
};
