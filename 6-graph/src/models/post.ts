import { Schema, model } from "mongoose";
import { IUser } from "./user";

export interface IPost {
  _id: string;
  title: string;
  content: string;
  imageUrl: string;
  creator: string | IUser;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostInput {
  title: string;
  content: string;
  imageUrl: string;
}

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default model("Post", postSchema);
