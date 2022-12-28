import { getDb } from "../utils/database";

interface ProductInterface {
  id?: string;
  title: string;
  price: number;
  imageUrl: string;
  description: string;
}

class Product implements ProductInterface {
  constructor(public title: string, public price: number, public imageUrl: string, public description: string) {}

  async save() {
    const db = getDb();
    try {
      const result = await db.collection("products").insertOne(this);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  static async fetchAll() {
    const db = getDb();
    try {
      const products = await db.collection("products").find().toArray();
      console.log(products);
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

// const Product = sequelize.define("product", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   title: Sequelize.STRING,
//   price: {
//     type: Sequelize.DOUBLE,
//     allowNull: false,
//   },
//   imageUrl: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   description: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
// });

export { Product, ProductInterface };
