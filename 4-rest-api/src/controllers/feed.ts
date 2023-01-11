import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { clearImage } from "../helpers/function";

import Post from "../models/post";
import User from "../models/user";
import Socket from "../socket";
import { DocumentSetOptions } from "mongoose";

const getPosts: RequestHandler = async (req, res, __) => {
  const currentPage: number = req.query.page ? +req.query.page : 1;
  const perPage: number = 2;

  try {
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .populate("creator");

    res.status(200).json({
      message: "Fetched posts successfully.",
      posts,
      totalItems,
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
    const post = await Post.findById(postId).populate("creator");

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

  const io = Socket.getIO();
  const imageUrl = req.file.path.replace(/\\/g, "/");
  const { title, content } = req.body;

  const post = new Post({
    title,
    content,
    imageUrl,
    creator: req.userId ? req.userId : null,
  });
  const postDoc: DocumentSetOptions = post;

  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    await post.save();

    user.posts.push(post._id);

    await user.save();

    io.emit("posts", { action: "create", post: { ...postDoc._doc, creator: { _id: user._id, name: user.name } } });

    res.status(201).json({
      message: "Post created successfully!",
      post: post,
      creator: {
        _id: user._id,
        name: user.name,
      },
    });
  } catch (error) {
    const { message } = error as Error;
    return res.status(500).json({
      message: message || "Creating a post failed!",
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

  const io = Socket.getIO();
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

    if (post.creator.toString() !== req.userId) {
      return res.status(403).json({
        message: "Not authorized!",
      });
    }

    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }

    post.title = title;
    post.imageUrl = imageUrl;
    post.content = content;
    const result = await post.save();

    io.emit("posts", { action: "update", post: result });

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
  const io = Socket.getIO();
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Could not find post.",
      });
    }

    if (post.creator.toString() !== req.userId) {
      return res.status(403).json({
        message: "Not authorized!",
      });
    }

    clearImage(post.imageUrl);
    await Post.findByIdAndRemove(postId);
    await User.updateOne({ _id: req.userId }, { $pull: { posts: postId } }, { multi: true });

    io.emit("posts", { action: "delete", post: postId });

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
