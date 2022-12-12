import fs from "fs";
import path from "path";

interface Product {
  id: string;
  qty: number;
}

const pathRoot = path.join(path.dirname(require.main?.filename!), "../", "data", "cart.json");

class Cart {
  static addProduct(id: string, productPrice: number) {
    // Fetch the previous cart
    fs.readFile(pathRoot, (err, fileContent) => {
      let cart: {
        products: Product[];
        totalPrice: number;
      } = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent.toString());
      }

      // Analyze the cart => Find existing product
      const existingProductIndex: unknown = cart.products.findIndex((p) => p.id === id);
      const existingProduct: Product = cart.products[existingProductIndex as number];
      let updatedProduct;
      // Add new product/ increase quantity
      if (existingProductIndex !== -1) {
        updatedProduct = { ...(existingProduct as Product) };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex as number] = updatedProduct;
      } else {
        updatedProduct = { id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(pathRoot, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id: string, productPrice: number) {
    fs.readFile(pathRoot, (err, fileContent) => {
      if (err) {
        return;
      }

      const updatedCart = { ...JSON.parse(fileContent.toString()) };
      const product = updatedCart.products.find((p: Product) => p.id === id);
      if (!product) {
        return;
      }

      const productQty = product.qty;
      updatedCart.products = updatedCart.products.filter((p: Product) => p.id !== id);
      updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;

      fs.writeFile(pathRoot, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }
}

module.exports = Cart;
