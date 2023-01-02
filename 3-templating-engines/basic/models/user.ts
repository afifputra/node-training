import { Schema, model } from "mongoose";
import Product, { ProductInterface } from "./product";

interface Items {
  productId: Schema.Types.ObjectId;
  quantity: number;
}
export interface UserInterface {
  _id?: Schema.Types.ObjectId;
  name: string;
  email: string;
  cart?: {
    items: Items[];
  };
  addToCart: (product: ProductInterface) => Promise<void>;
  getCart: () => Promise<ProductInterface[]>;
}

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product: ProductInterface) {
  const cartProductIndex: number = this.cart!.items.findIndex((cp: Items) => {
    return cp.productId.toString() === product._id!.toString();
  });
  let newQuantity = 1;
  const updatedCartItems: Items[] = [...this.cart!.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart!.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({ productId: product._id!, quantity: newQuantity });
  }

  const updatedCart = { items: updatedCartItems };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.getCart = async function () {
  const cart = this.cart!;

  const productIds = cart.items.map((items: Items) => {
    return items.productId;
  });

  const products = (await Product.find({ _id: { $in: productIds } }).lean()) as ProductInterface[];

  return products.map((product: ProductInterface) => {
    return {
      ...product,
      quantity: cart.items.find((item: Items) => {
        return item.productId.toString() === product._id!.toString();
      })!.quantity,
    };
  });
};

export default model("User", userSchema);

// import { ObjectId } from "mongodb";
// import { getDb } from "../utils/database";
// import { ProductInterface } from "./product";

// interface Items {
//   productId: string | ObjectId;
//   quantity: number;
// }

// interface UserInterface {
//   name: string;
//   email: string;
//   cart?: {
//     items: Items[];
//   };
//   _id?: string | ObjectId;
// }

// class User implements UserInterface {
//   name: string;
//   email: string;
//   cart?: {
//     items: Items[];
//   };
//   _id?: string | ObjectId;

//   constructor(name: string, email: string, cart?: { items: Items[] }, _id?: string | ObjectId) {
//     this.name = name;
//     this.email = email;
//     this.cart = cart;
//     this._id = _id;
//   }

//   save() {
//     const db = getDb();
//     return db.collection("users").insertOne({
//       name: this.name,
//       email: this.email,
//       cart: this.cart,
//     });
//   }

//   addToCart(product: ProductInterface) {
//     const cartProduct = this.cart!.items.findIndex((cp: Items) => {
//       return cp.productId.toString() === product._id!.toString();
//     });
//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart!.items];

//     if (cartProduct >= 0) {
//       newQuantity = this.cart!.items[cartProduct].quantity + 1;
//       updatedCartItems[cartProduct].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({ productId: new ObjectId(product._id ? product._id : ""), quantity: newQuantity });
//     }

//     const updatedCart = { items: updatedCartItems };
//     const db = getDb();

//     return db.collection("users").updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } });
//   }

//   async getCart() {
//     const db = getDb();
//     const cart = this.cart!;

//     if (!cart) return [];

//     const productIds = cart.items.map((item: Items) => {
//       return item.productId;
//     });

//     try {
//       const products = (await db
//         .collection("products")
//         .find({ _id: { $in: productIds } })
//         .toArray()) as ProductInterface[];

//       if (!products) return [];

//       return products.map((product: ProductInterface) => {
//         const { userId, ...rest } = product;
//         return {
//           ...rest,
//           quantity: cart.items.find((item: Items) => {
//             return item.productId.toString() === product._id!.toString();
//           })!.quantity,
//         };
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   deleteItemFromCart(productId: ObjectId) {
//     const db = getDb();
//     const updatedCartItems = this.cart!.items.filter((item: Items) => {
//       return item.productId.toString() !== productId.toString();
//     });
//     const updatedCart = { items: updatedCartItems };
//     return db.collection("users").updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } });
//   }

//   async getOrders() {
//     const db = getDb();
//     try {
//       const orders = await db
//         .collection("orders")
//         .find({ "user._id": new ObjectId(this._id) })
//         .toArray();

//       return orders;
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async addOrder() {
//     const db = getDb();

//     try {
//       const cart = await this.getCart();
//       const order = {
//         items: cart,
//         user: {
//           _id: new ObjectId(this._id),
//           name: this.name,
//         },
//       };

//       await db.collection("orders").insertOne(order);

//       this.cart = { items: [] };

//       return db.collection("users").updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: { items: [] } } });
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   static async findById(userId: string) {
//     const db = getDb();
//     try {
//       const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
//       return user;
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }

// export { User, UserInterface };
