import { RequestHandler } from "express";
import { validationResult } from "express-validator";

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

const createPost: RequestHandler = (req, res, __) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed, entered data is incorrect.",
      errors: errors.array(),
    });
  }

  const { title, content } = req.body;

  res.status(201).json({
    message: "Post created successfully!",
    post: {
      _id: new Date().toISOString(),
      title,
      content,
      creator: {
        name: "Afif",
      },
      createdAt: new Date(),
    },
  });
};

export default {
  getPosts,
  createPost,
};
