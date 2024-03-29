import { Request } from "express";
import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";

import Post, { PostInput } from "../models/post";
import User, { UserInput } from "../models/user";

import { clearImage } from "../helpers/function";

const createUser = async ({ userInput }: { userInput: UserInput }, __: Request) => {
  const errors: { message: string }[] = [];
  const { email, name, password } = userInput;

  if (!validator.isEmail(email)) {
    errors.push({
      message: "E-Mail is invalid.",
    });
  }

  if (validator.isEmpty(password) || !validator.isLength(password, { min: 5 })) {
    errors.push({
      message: "Password too short!",
    });
  }

  if (errors.length > 0) {
    const error = new Error("Invalid input.");
    error.data = errors;
    error.code = 422;
    throw error;
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error = new Error("User exists already.");
    error.data = errors;
    error.code = 422;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = new User({
    email,
    name,
    password: hashedPassword,
  });

  const createdUser = (await user.save()).toJSON();

  return {
    ...createdUser,
  };
};

const login = async ({ email, password }: { email: string; password: string }, __: Request) => {
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("User not found.");
    error.code = 401;
    throw error;
  }

  const isEqual = await bcrypt.compare(password, user.password);

  if (!isEqual) {
    const error = new Error("Password is incorrect.");
    error.code = 401;
    throw error;
  }

  const token = jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
    },
    "rimurutempest",
    {
      expiresIn: "1h",
    }
  );

  return {
    token,
    userId: user._id.toString(),
  };
};

const getPosts = async ({ page }: { page: number }, req: Request) => {
  if (!req.isAuth) {
    const error = new Error("Not authenticated.");
    error.code = 401;
    throw error;
  }
  if (!page) page = 1;
  const perPage = 2;
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .skip((page - 1) * perPage)
    .limit(perPage)
    .populate("creator", "-password");
  const totalItems = await Post.find().countDocuments();
  const finalPosts = posts.map((post) => {
    return {
      ...post.toJSON(),
      _id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  });

  return {
    posts: finalPosts,
    totalPosts: totalItems,
  };
};

const getPost = async ({ id }: { id: string }, req: Request) => {
  if (!req.isAuth) {
    const error = new Error("Not authenticated.");
    error.code = 401;
    throw error;
  }

  const post = await Post.findById(id).populate("creator", "-password");

  if (!post) {
    const error = new Error("No post found!");
    error.code = 404;
    throw error;
  }

  const finalPost = {
    ...post.toJSON(),
    _id: post._id.toString(),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };

  return finalPost;
};

const createPost = async ({ postInput }: { postInput: PostInput }, req: Request) => {
  if (!req.isAuth) {
    const error = new Error("Not authenticated.");
    error.code = 401;
    throw error;
  }

  const { userId } = req;

  const errors: { message: string }[] = [];
  const { title, content, imageUrl } = postInput;

  if (validator.isEmpty(title) || !validator.isLength(title, { min: 5 })) {
    errors.push({
      message: "Title is invalid.",
    });
  }

  if (validator.isEmpty(content) || !validator.isLength(content, { min: 5 })) {
    errors.push({
      message: "Content is invalid.",
    });
  }

  if (errors.length > 0) {
    const error = new Error("Invalid input.");
    error.data = errors;
    error.code = 422;
    throw error;
  }

  const user = await User.findById(userId); // Get the user from the database

  if (!user) {
    const error = new Error("Invalid user.");
    error.code = 401;
    throw error;
  }

  const post = new Post({
    title,
    content,
    imageUrl,
    creator: userId,
  });

  const createdPost = await post.save(); // Save the post to the database

  user.posts.push(createdPost._id); // Add the post to the user's posts

  const userWithSomePost = await user.save(); // Save the user to the database

  const { password, ...restUser } = userWithSomePost.toJSON(); // Remove the password from the user

  const finalPost = {
    ...createdPost.toJSON(),
    _id: createdPost._id.toString(),
    createdAt: createdPost.createdAt.toISOString(),
    updatedAt: createdPost.updatedAt.toISOString(),
    creator: {
      ...restUser,
    },
  };

  return finalPost;
};

const updatePost = async ({ id, postInput }: { id: string; postInput: PostInput }, req: Request) => {
  console.log(postInput);
  if (!req.isAuth) {
    const error = new Error("Not authenticated.");
    error.code = 401;
    throw error;
  }

  const { userId } = req;

  const errors: { message: string }[] = [];

  const { title, content, imageUrl } = postInput;

  if (validator.isEmpty(title) || !validator.isLength(title, { min: 5 })) {
    errors.push({
      message: "Title is invalid.",
    });
  }

  if (validator.isEmpty(content) || !validator.isLength(content, { min: 5 })) {
    errors.push({
      message: "Content is invalid.",
    });
  }

  if (errors.length > 0) {
    const error = new Error("Invalid input.");
    error.data = errors;
    error.code = 422;
    throw error;
  }

  const post = await Post.findById(id).populate("creator", "-password");

  if (!post) {
    const error = new Error("No post found!");
    error.code = 404;
    throw error;
  }

  if (post.creator._id.toString() !== userId) {
    const error = new Error("Not authorized!");
    error.code = 403;
    throw error;
  }

  post.title = title;
  post.content = content;

  if (imageUrl !== "undefined") {
    post.imageUrl = imageUrl;
  }

  const updatedPost = await post.save();

  const finalPost = {
    ...updatedPost.toJSON(),
    _id: updatedPost._id.toString(),
    createdAt: updatedPost.createdAt.toISOString(),
    updatedAt: updatedPost.updatedAt.toISOString(),
  };

  return finalPost;
};

const deletePost = async ({ id }: { id: string }, req: Request) => {
  if (!req.isAuth) {
    const error = new Error("Not authenticated.");
    error.code = 401;
    throw error;
  }

  const post = await Post.findById(id);
  const { userId } = req;

  if (!post) {
    const error = new Error("No post found!");
    error.code = 404;
    throw error;
  }

  if (post.creator.toString() !== userId) {
    const error = new Error("Not authorized!");
    error.code = 403;
    throw error;
  }

  try {
    clearImage(post.imageUrl);

    await Post.findByIdAndRemove(id);

    await User.updateOne({ _id: userId }, { $pull: { posts: id } });

    return true;
  } catch (err) {
    const error = new Error("Something went wrong!");
    error.code = 500;
    throw error;
  }
};

const user = async (_: any, req: Request) => {
  if (!req.isAuth) {
    const error = new Error("Not authenticated.");
    error.code = 401;
    throw error;
  }

  const { userId } = req;

  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("No user found!");
    error.code = 404;
    throw error;
  }

  const { password, ...restUser } = user.toJSON();

  return {
    ...restUser,
  };
};

const updateStatus = async ({ status }: { status: string }, req: Request) => {
  if (!req.isAuth) {
    const error = new Error("Not authenticated.");
    error.code = 401;
    throw error;
  }

  const { userId } = req;

  try {
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("No user found!");
      error.code = 404;
      throw error;
    }

    user.status = status;

    await user.save();

    return {
      ...user.toJSON(),
      _id: user._id.toString(),
    };
  } catch (err) {
    const error = new Error("Something went wrong!");
    error.code = 500;
    throw error;
  }
};

const resolvers = {
  createUser,
  login,
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  user,
  updateStatus,
};

export default resolvers;
