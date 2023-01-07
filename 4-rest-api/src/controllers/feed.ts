import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import Post from "../models/post";

const getPosts: RequestHandler = (_, res, __) => {
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "First Post",
        content: "This is the first post!",
        imageUrl: "images/duck.jpg",
        creator: {
          name: "Afif",
        },
        createdAt: new Date(),
      },
    ],
  });
};

const createPost: RequestHandler = async (req, res, __) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed, entered data is incorrect.",
      errors: errors.array(),
    });
  }

  const { title, content } = req.body;

  const post = new Post({
    title,
    content,
    imageUrl: "images/duck.jpg",
    creator: {
      name: "Afif",
    },
  });

  try {
    await post.save();
    res.status(201).json({
      message: "Post created successfully!",
      post,
    });
  } catch (error) {
    console.log(error);
  }
};

export default {
  getPosts,
  createPost,
};
