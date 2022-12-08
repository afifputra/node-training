import fs from "fs";
import path from "path";

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

  static async fetchAll(callback: (products: Product[]) => void) {
    fs.readFile(pathRoot, (err, fileContent) => {
      if (err) {
        callback([]);
      }
      callback(JSON.parse(fileContent.toString()));
    });
  }
};
