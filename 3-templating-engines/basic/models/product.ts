import { ObjectId } from "mongodb";
import { getDb } from "../utils/database";

interface ProductInterface {
  _id?: string | ObjectId | null;
  title: string;
  price: number;
  imageUrl: string;
  description: string;
  userId: string;
}

class Product implements ProductInterface {
  constructor(public title: string, public price: number, public imageUrl: string, public description: string, public _id: string | ObjectId | null, public userId: string) {
    this._id = _id ? new ObjectId(_id) : null;
  }

  async save() {
    const db = getDb();
    try {
      if (this._id) {
        const result = await db.collection("products").updateOne(
          { _id: this._id },
          {
            $set: {
              title: this.title,
              price: this.price,
              imageUrl: this.imageUrl,
              description: this.description,
              userId: this.userId,
            },
          }
        );
        return result;
      } else {
        const result = await db.collection("products").insertOne({
          title: this.title,
          price: this.price,
          imageUrl: this.imageUrl,
          description: this.description,
          userId: this.userId,
        });
        return result;
      }
    } catch (error) {
      console.log(error);
    }
  }

  static async fetchAll() {
    const db = getDb();
    try {
      const products = await db.collection("products").find().toArray();
      return products;
    } catch (error) {
      console.log(error);
    }
  }

  static async findById(id: string) {
    const db = getDb();
    try {
      // const product = await db.collection("products").findOne({ _id: new ObjectId(id) });
      const product = await db
        .collection("products")
        .find({ _id: new ObjectId(id) })
        .next();
      return product;
    } catch (error) {
      console.log(error);
    }
  }

  static async deleteById(id: string) {
    const db = getDb();
    try {
      const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) });
      return result;
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
