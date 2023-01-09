import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { clearImage } from "../helpers/function";

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

  if (!req.file) {
    return res.status(422).json({
      message: "No image provided.",
    });
  }

  const imageUrl = req.file.path.replace(/\\/g, "/");
  const { title, content } = req.body;

  const post = new Post({
    title,
    content,
    imageUrl,
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

const updatePost: RequestHandler<{ postId: string }> = async (req, res, _) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed, entered data is incorrect.",
      errors: errors.array(),
    });
  }

  const { postId } = req.params;
  const { title, content } = req.body;
  let imageUrl = req.body.image;

  if (req.file) {
    imageUrl = req.file.path.replace(/\\/g, "/");
  }

  if (!imageUrl) {
    return res.status(422).json({
      message: "No file picked.",
    });
  }

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Could not find post.",
      });
    }

    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }

    post.title = title;
    post.imageUrl = imageUrl;
    post.content = content;
    const result = await post.save();

    res.status(200).json({
      message: "Post updated!",
      post: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Couldn't update post.",
    });
  }
};

const deletePost: RequestHandler<{ postId: string }> = async (req, res, _) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Could not find post.",
      });
    }

    clearImage(post.imageUrl);
    await Post.findByIdAndRemove(postId);

    res.status(200).json({
      message: "Deleted post.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Deleting post failed!",
    });
  }
};

export default {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
};
