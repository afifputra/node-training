import { RequestHandler } from "express";

import { Product } from "../models/product";

const getProducts: RequestHandler = async (_, res, __) => {
  try {
    const products = await Product.fetchAll();
    res.render("shop/product-list", {
      prods: products,
      docTitle: "All Products",
      path: "/products",
    });
  } catch (error) {
    console.log(error);
  }
};
// const getProduct = (req: Request, res: Response, next: NextFunction) => {
//   const prodId = req.params.productId;
//   Product.findByPk(prodId)
//     .then((result: unknown) => {
//       const product: Product = result as Product;
//       res.render("shop/product-detail", {
//         product: product,
//         docTitle: product.title,
//         path: "/products",
//       });
//     })
//     .catch((error: Error) => console.log(error));
// };

const getIndex: RequestHandler = async (_, res, __) => {
  try {
    const products = await Product.fetchAll();
    res.render("shop/index", {
      prods: products,
      docTitle: "Shop",
      path: "/",
    });
  } catch (error) {
    console.log(error);
  }
};

// const getCart = (req: any, res: Response, next: NextFunction) => {
//   req.user
//     .getCart()
//     .then((cart: any) => {
//       console.log(cart);
//       return cart
//         .getProducts()
//         .then((products: Product[]) => {
//           res.render("shop/cart", {
//             docTitle: "Your Cart",
//             path: "/cart",
//             products: products,
//           });
//         })
//         .catch((error: Error) => console.log(error));
//     })
//     .catch((error: Error) => console.log(error));
// };

// const postCart = (req: any, res: Response, next: NextFunction) => {
//   const productId = req.body.productId;
//   let fetchedCart: any;
//   let newQuantity = 1;

//   req.user
//     .getCart()
//     .then((cart: any) => {
//       fetchedCart = cart;
//       return cart.getProducts({ where: { id: productId } });
//     })
//     .then((products: Product[]) => {
//       let product: any;

//       if (products.length > 0) {
//         product = products[0];
//       }

//       if (product) {
//         const oldQuantity = product.cartItem.quantity;
//         newQuantity = oldQuantity + 1;
//         return product;
//       }

//       return Product.findByPk(productId);
//     })
//     .then((product: any) => {
//       return fetchedCart.addProduct(product, {
//         through: { quantity: newQuantity },
//       });
//     })
//     .then(() => {
//       res.redirect("/cart");
//     })
//     .catch((error: Error) => console.log(error));
// };

// const postCartDeleteProduct = (req: any, res: Response, next: NextFunction) => {
//   const productId = req.body.productId;
//   req.user
//     .getCart()
//     .then((cart: any) => {
//       return cart.getProducts({ where: { id: productId } });
//     })
//     .then((products: Product[]) => {
//       const product: any = products[0];
//       return product.cartItem.destroy();
//     })
//     .then(() => {
//       res.redirect("/cart");
//     })
//     .catch((error: Error) => console.log(error));
// };

// const getOrders = (req: any, res: Response, next: NextFunction) => {
//   req.user
//     .getOrders({
//       include: ["products"],
//     })
//     .then((orders: any) => {
//       console.log(orders);
//       res.render("shop/orders", {
//         docTitle: "Your Orders",
//         path: "/orders",
//         orders: orders,
//       });
//     })
//     .catch((error: Error) => console.log(error));
// };

// const postOrder = (req: any, res: Response, next: NextFunction) => {
//   let fetchedCart: any;
//   req.user
//     .getCart()
//     .then((cart: any) => {
//       fetchedCart = cart;
//       return cart.getProducts();
//     })
//     .then((products: Product[]) => {
//       req.user
//         .createOrder()
//         .then((order: any) => {
//           return order.addProducts(
//             products.map((product: any) => {
//               product.orderItem = { quantity: product.cartItem.quantity };
//               return product;
//             })
//           );
//         })
//         .catch((error: Error) => console.log(error));
//     })
//     .then((result: any) => {
//       return req.user.getCart().then((cart: any) => {
//         return cart.setProducts(null);
//       });
//     })
//     .then((result: any) => {
//       return fetchedCart.setProducts(null);
//     })
//     .then(() => {
//       res.redirect("/orders");
//     })
//     .catch((error: Error) => console.log(error));
// };

// const getCheckout = (req: Request, res: Response, next: NextFunction) => {
//   res.render("shop/checkout", {
//     docTitle: "Checkout",
//     path: "/checkout",
//   });
// };

export default {
  getProducts,
  // getProduct,
  getIndex,
  // getCart,
  // postCart,
  // postCartDeleteProduct,
  // getOrders,
  // postOrder,
  // getCheckout,
};
