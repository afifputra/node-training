import { Schema, model } from "mongoose";

export interface ProductInterface {
  _id?: Schema.Types.ObjectId;
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  userId: Schema.Types.ObjectId;
}

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default model("Product", productSchema);

// import { ObjectId } from "mongodb";
// import { getDb } from "../utils/database";

// interface ProductInterface {
//   _id?: string | ObjectId | null;
//   title: string;
//   price: number;
//   imageUrl: string;
//   description: string;
//   userId: ObjectId;
// }

// class Product implements ProductInterface {
//   constructor(public title: string, public price: number, public imageUrl: string, public description: string, public _id: string | ObjectId | null, public userId: ObjectId) {
//     this.price = +price;
//     this._id = _id ? new ObjectId(_id) : null;
//   }

//   async save() {
//     const db = getDb();
//     const { _id: idProduct, ...dataProduct } = this;
//     try {
//       if (idProduct) {
//         const result = await db.collection("products").updateOne(
//           { _id: idProduct },
//           {
//             $set: dataProduct,
//           }
//         );
//         return result;
//       } else {
//         const result = await db.collection("products").insertOne(dataProduct);
//         return result;
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   static async fetchAll() {
//     const db = getDb();
//     try {
//       const products = await db.collection("products").find().toArray();
//       return products;
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   static async findById(id: string) {
//     const db = getDb();
//     try {
//       // const product = await db.collection("products").findOne({ _id: new ObjectId(id) });
//       const product = await db
//         .collection("products")
//         .find({ _id: new ObjectId(id) })
//         .next();
//       return product;
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   static async deleteById(id: string) {
//     const db = getDb();
//     try {
//       const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) });
//       return result;
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }

// export { Product, ProductInterface };
