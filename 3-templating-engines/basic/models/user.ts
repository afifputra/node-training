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
    // const cartProduct = this.cart.items.findIndex((cp: any) => {
    //   return cp._id === product.id;
    // });
    const updatedCart = { items: [{ productId: new ObjectId(product._id), quantity: 1 }] };
    const db = getDb();

    return db.collection("users").updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } });
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
