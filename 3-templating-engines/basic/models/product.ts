import db from "../utils/database";
const Cart = require("./cart");

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

  save() {}

  static deleteById(id: string) {}

  static fetchAll() {
    return db.execute("SELECT * FROM products");
  }

  static findById(id: string) {}
}

module.exports = Product;
