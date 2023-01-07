import { RequestHandler } from "express";

const getPosts: RequestHandler = (_, res, __) => {
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "First Post",
        content: "This is the first post!",
        imageUrl: "images/duck.jpg",
        creator: {
          name: "Maximilian",
        },
        createdAt: new Date(),
      },
    ],
  });
};

const createPost: RequestHandler = (req, res, __) => {
  const { title, content } = req.body;

  res.status(201).json({
    message: "Post created successfully!",
    post: {
      _id: new Date().toISOString(),
      title,
      content,
    },
  });
};

export default {
  getPosts,
  createPost,
};
