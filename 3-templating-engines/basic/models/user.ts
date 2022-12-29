import { ObjectId } from "mongodb";
import { getDb } from "../utils/database";

interface UserInterface {
  name: string;
  email: string;
  cart?: any;
  _id?: string | ObjectId;
}

class User implements UserInterface {
  name: string;
  email: string;
  cart?: any;
  _id?: string | ObjectId;

  constructor(name: string, email: string, cart?: any, _id?: string | ObjectId) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = _id;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne({
      name: this.name,
      email: this.email,
      cart: this.cart,
    });
  }

  addToCart(product: any) {
    const cartProduct = this.cart.items.findIndex((cp: any) => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProduct >= 0) {
      newQuantity = this.cart.items[cartProduct].quantity + 1;
      updatedCartItems[cartProduct].quantity = newQuantity;
    } else {
      updatedCartItems.push({ productId: new ObjectId(product._id), quantity: newQuantity });
    }

    const updatedCart = { items: updatedCartItems };
    const db = getDb();

    return db.collection("users").updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } });
  }

  async getCart() {
    const db = getDb();
    const productIds = this.cart.items.map((item: any) => {
      return item.productId;
    });

    try {
      const products = await db
        .collection("products")
        .find({ _id: { $in: productIds } })
        .toArray();
      return products.map((product: any) => {
        return {
          ...product,
          quantity: this.cart.items.find((item: any) => {
            return item.productId.toString() === product._id.toString();
          }).quantity,
        };
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async findById(userId: string) {
    const db = getDb();
    try {
      const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
      return user;
    } catch (error) {
      console.log(error);
    }
  }
}

export { User, UserInterface };
