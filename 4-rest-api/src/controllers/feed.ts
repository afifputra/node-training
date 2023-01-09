import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import Post from "../models/post";

const getPosts: RequestHandler = async (_, res, __) => {
  try {
    const posts = await Post.find();

    res.status(200).json({
      posts,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Fetching posts failed!",
    });
  }
};

const getPost: RequestHandler<{ postId: string }> = async (req, res, __) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Could not find post.",
      });
    }

    res.status(200).json({
      post,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Fetching post failed!",
    });
  }
};

const createPost: RequestHandler = async (req, res, _) => {
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
    return res.status(500).json({
      message: "Creating a post failed!",
    });
  }
};

export default {
  getPosts,
  getPost,
  createPost,
};
