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
    getProductsFromFile((products: { title: string }[]) => {
      products.push(this);
      fs.writeFile(pathRoot, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static async fetchAll(callback: (products: { title: string }[]) => void) {
    getProductsFromFile(callback);
  }
}

module.exports = Product;
