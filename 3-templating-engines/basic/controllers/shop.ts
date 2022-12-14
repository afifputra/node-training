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

const getCart = (req: any, res: Response, next: NextFunction) => {
  req.user
    .getCart()
    .then((cart: any) => {
      console.log(cart);
      return cart
        .getProducts()
        .then((products: Product[]) => {
          res.render("shop/cart", {
            docTitle: "Your Cart",
            path: "/cart",
            products: products,
          });
        })
        .catch((error: Error) => console.log(error));
    })
    .catch((error: Error) => console.log(error));
};

const postCart = (req: any, res: Response, next: NextFunction) => {
  const productId = req.body.productId;
  let fetchedCart: any;
  req.user
    .getCart()
    .then((cart: any) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products: Product[]) => {
      let product: any;

      if (products.length > 0) {
        product = products[0];
      }

      let newQuantity = 1;

      if (product) {
        // ...
      }

      return Product.findByPk(productId)
        .then((product: any) => {
          return fetchedCart.addProduct(product, {
            through: { quantity: newQuantity },
          });
        })
        .catch((error: Error) => console.log(error));
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((error: Error) => console.log(error));
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
