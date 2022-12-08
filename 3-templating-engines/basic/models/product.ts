import fs from "fs";
import path from "path";

type Product = {
  title: string;
};

const pathRoot = path.join(path.dirname(require.main?.filename!), "../", "data", "products.json");

module.exports = class Product {
  title: string;

  constructor(inputTitle: string) {
    this.title = inputTitle;
  }

  save() {
    fs.readFile(pathRoot, (err, fileContent) => {
      let savedProducts: Product[] = [];

      if (!err) {
        savedProducts = JSON.parse(fileContent.toString());
      }

      savedProducts.push(this);

      fs.writeFile(pathRoot, JSON.stringify(savedProducts), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll() {
    fs.readFile(pathRoot, (err, fileContent) => {
      if (err) {
        return [];
      }
      const products: Product[] = JSON.parse(fileContent.toString());
      return products;
    });
  }
};
