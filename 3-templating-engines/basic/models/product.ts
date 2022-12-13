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

  save() {
    return db.execute(`INSERT INTO products (title, price, image_url, description) VALUES (?, ?, ?, ?)`, [this.title, this.price, this.imageUrl, this.description]);
  }

  static deleteById(id: string) {}

  static fetchAll() {
    return db.execute("SELECT * FROM products");
  }

  static findById(id: string) {
    return db.execute("SELECT * FROM products WHERE products.id = ?", [id]);
  }
}

module.exports = Product;
