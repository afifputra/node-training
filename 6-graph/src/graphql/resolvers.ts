import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";

import Post from "../models/post";
import User from "../models/user";

const createUser = async (
  {
    userInput,
  }: {
    userInput: {
      email: string;
      password: string;
      name: string;
    };
  },
  __: any
) => {
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

const login = async (
  {
    email,
    password,
  }: {
    email: string;
    password: string;
  },
  __: any
) => {
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

const createPost = async (
  {
    postInput,
  }: {
    postInput: {
      title: string;
      content: string;
      imageUrl: string;
    };
  },
  req: any
) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    const error = new Error("Not authenticated.");
    error.code = 401;
    throw error;
  }

  const token = authHeader.split(" ")[1];

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, "rimurutempest") as { userId: string };
  } catch (error) {
    throw error;
  }

  if (!decodedToken) {
    const error = new Error("Not authenticated.");
    error.code = 401;
    throw error;
  }

  const userId = decodedToken.userId;

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

  const post = new Post({
    title,
    content,
    imageUrl,
    creator: userId,
  });

  const createdPost = (await (await post.save()).populate("creator", "name")).toJSON();

  return {
    ...createdPost,
    _id: createdPost._id.toString(),
    createdAt: createdPost.createdAt.toISOString(),
  };
};

const resolvers = {
  createUser,
  login,
  createPost,
};

export default resolvers;
