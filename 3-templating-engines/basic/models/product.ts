import fs from "fs";
import path from "path";

const pathRoot = path.join(path.dirname(require.main?.filename!), "../", "data", "products.json");

type ProductConstructor = {
  id?: string;
  title: string;
  imageUrl: string;
  description: string;
  price: number;
};

const getProductsFromFile = (callback: (products: ProductConstructor[]) => void) => {
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
  constructor(id: string, title: string, imageUrl: string, description: string, price: number) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products: ProductConstructor[]) => {
      if (this.id) {
        const existingProductIndex = products.findIndex((prod: ProductConstructor) => prod.id === this.id);
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(pathRoot, JSON.stringify(updatedProducts), (err) => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(pathRoot, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  }

  static deleteById(id: string) {
    getProductsFromFile((products: ProductConstructor[]) => {
      const product = products.find((p) => p.id === id);
      const updatedProducts = products.filter((p) => p.id !== id);
      fs.writeFile(pathRoot, JSON.stringify(updatedProducts), (err) => {
        if (!err) {
          console.log("Product deleted");
        }
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
