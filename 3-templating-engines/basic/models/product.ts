import fs from "fs";
import path from "path";

const pathRoot = path.join(path.dirname(require.main?.filename!), "../", "data", "products.json");

const getProductsFromFile = (callback: (products: { title: string }[]) => void) => {
  fs.readFile(pathRoot, (err, fileContent) => {
    if (err) {
      callback([]);
    } else {
      callback(JSON.parse(fileContent.toString()));
    }
  });
};

interface Product {
  id?: string;
  title: string;
  imageUrl: string;
  description: string;
  price: number;
}

class Product implements Product {
  constructor(title: string, imageUrl: string, description: string, price: number) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    this.id = Math.random().toString();
    getProductsFromFile((products: { title: string }[]) => {
      products.push(this);
      fs.writeFile(pathRoot, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static async fetchAll(callback: (products: unknown[]) => void) {
    getProductsFromFile(callback);
  }

  static findById(id: string, callback: (product: Product) => void) {
    getProductsFromFile((products: unknown[]) => {
      const allProducts = products as Product[];
      const product = allProducts.find((p) => p.id === id);
      callback(product as Product);
    });
  }
}

module.exports = Product;
