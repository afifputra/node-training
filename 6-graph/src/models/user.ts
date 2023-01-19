import { Schema, model } from "mongoose";

export interface IUser {
  _id: string;
  email: string;
  name: string;
  posts: string[];
  status: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInput {
  email: string;
  name: string;
  password: string;
}

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "I'm new!",
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  { timestamps: true }
);

export default model("User", userSchema);
