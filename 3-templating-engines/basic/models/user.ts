import { ObjectId } from "mongodb";
import { getDb } from "../utils/database";

interface UserInterface {
  id?: number;
  name: string;
  email: string;
}

class User implements UserInterface {
  name: string;
  email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
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

// const User = sequelize.define("user", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   name: Sequelize.STRING,
//   email: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
// });

export { User, UserInterface };
