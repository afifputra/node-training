import { ObjectId } from "mongodb";
import { getDb } from "../utils/database";
import { ProductInterface } from "./product";

interface Items {
  productId: string | ObjectId;
  quantity: number;
}

interface UserInterface {
  name: string;
  email: string;
  cart?: {
    items: Items[];
  };
  _id?: string | ObjectId;
}

class User implements UserInterface {
  name: string;
  email: string;
  cart?: {
    items: Items[];
  };
  _id?: string | ObjectId;

  constructor(name: string, email: string, cart?: { items: Items[] }, _id?: string | ObjectId) {
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

  addToCart(product: ProductInterface) {
    const cartProduct = this.cart!.items.findIndex((cp: Items) => {
      return cp.productId.toString() === product._id!.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart!.items];

    if (cartProduct >= 0) {
      newQuantity = this.cart!.items[cartProduct].quantity + 1;
      updatedCartItems[cartProduct].quantity = newQuantity;
    } else {
      updatedCartItems.push({ productId: new ObjectId(product._id ? product._id : ""), quantity: newQuantity });
    }

    const updatedCart = { items: updatedCartItems };
    const db = getDb();

    return db.collection("users").updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } });
  }

  async getCart() {
    const db = getDb();
    const cart = this.cart!;

    if (!cart) return [];

    const productIds = cart.items.map((item: Items) => {
      return item.productId;
    });

    try {
      const products = (await db
        .collection("products")
        .find({ _id: { $in: productIds } })
        .toArray()) as ProductInterface[];

      return products.map((product: ProductInterface) => {
        return {
          ...product,
          quantity: cart.items.find((item: Items) => {
            return item.productId.toString() === product._id!.toString();
          })!.quantity,
        };
      });
    } catch (error) {
      console.log(error);
    }
  }

  deleteItemFromCart(productId: ObjectId) {
    const db = getDb();
    const updatedCartItems = this.cart!.items.filter((item: Items) => {
      return item.productId.toString() !== productId.toString();
    });
    const updatedCart = { items: updatedCartItems };
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
