import { Request, Response, NextFunction } from "express";

import Product, { ProductInterface } from "../models/product";
import Order from "../models/order";
// import { ObjectId } from "mongodb"

const getProducts = async (_: Request, res: Response, __: NextFunction) => {
  try {
    const products = await Product.find();
    res.render("shop/product-list", {
      prods: products,
      docTitle: "All Products",
      path: "/products",
    });
  } catch (error) {
    console.log(error);
  }
};

const getProduct = async (req: Request, res: Response, _: NextFunction) => {
  const prodId = req.params.productId;

  try {
    const product = await Product.findById(prodId);

    if (!product) {
      return res.redirect("/");
    }

    res.render("shop/product-detail", {
      product: product,
      docTitle: product.title,
      path: "/products",
    });
  } catch (error) {
    console.log(error);
  }
};

const getIndex = async (_: Request, res: Response, __: NextFunction) => {
  try {
    const products = await Product.find();
    res.render("shop/index", {
      prods: products,
      docTitle: "Shop",
      path: "/",
    });
  } catch (error) {
    console.log(error);
  }
};

const getCart = async (req: Request, res: Response, _: NextFunction) => {
  const requestUser = req.user!;

  try {
    const getCart = await requestUser.populate("cart.items.productId");
    const cart = getCart.cart?.items || [];

    res.render("shop/cart", {
      docTitle: "Your Cart",
      path: "/cart",
      products: cart,
    });
  } catch (error) {
    console.log(error);
  }
};

const postCart = async (req: Request, res: Response, __: NextFunction) => {
  const requestUser = req.user!;
  const productId: string = req.body.productId;

  try {
    const product = (await Product.findById(productId)) as ProductInterface;

    if (!product) {
      return res.redirect("/");
    }

    await requestUser!.addToCart(product);

    res.redirect("/cart");
  } catch (error) {
    console.log(error);
  }
};

const postCartDeleteProduct = async (req: Request, res: Response, _: NextFunction) => {
  const productId: string = req.body.productId;
  const requestUser = req.user!;

  try {
    await requestUser.deleteItemFromCart(productId);
    res.redirect("/cart");
  } catch (error) {
    console.log(error);
  }
};

const getOrders = async (req: Request, res: Response, _: NextFunction) => {
  const requestUser = req.user!;

  try {
    const orders = await Order.find({ "user.userId": requestUser?._id }).lean();
    const finalOrders = orders.map((order) => {
      return {
        ...order,
        products: order.products.map((product) => {
          return {
            ...product.product,
            quantity: product.quantity,
          };
        }),
      };
    });

    res.render("shop/orders", {
      docTitle: "Your Orders",
      path: "/orders",
      orders: finalOrders,
    });
  } catch (error) {
    console.log(error);
  }
};

const postOrder = async (req: Request, res: Response, _: NextFunction) => {
  const requestUser = req.user!;

  try {
    const getCart = await requestUser.populate("cart.items.productId");
    const products = getCart.cart?.items.map((i: any) => {
      const { userId, ...rest } = i.productId._doc;
      return { quantity: i.quantity, product: { ...rest } };
    });
    const totalPrice = getCart.cart?.items.reduce((acc: number, i: any) => {
      return acc + i.quantity * i.productId.price;
    }, 0);

    const order = new Order({
      user: {
        name: requestUser.name,
        userId: requestUser,
      },
      products: products,
      totalPrice,
    });

    await order.save();
    await requestUser.clearCart();

    res.redirect("/orders");
  } catch (error) {
    console.log(error);
  }
};

// const getCheckout = (_: Request, res: Response, __: NextFunction) => {
//   res.render("shop/checkout", {
//     docTitle: "Checkout",
//     path: "/checkout",
//   });
// };

export default {
  getProducts,
  getProduct,
  getIndex,
  getCart,
  postCart,
  postCartDeleteProduct,
  getOrders,
  postOrder,
  //   getCheckout,
};
