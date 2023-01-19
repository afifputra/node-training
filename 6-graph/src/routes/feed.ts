import { Router } from "express";
import { body } from "express-validator";

import FeedController from "../controllers/feed";
import isAuth from "../middleware/auth";

const router = Router();

const postValidator = [body("title").trim().isLength({ min: 5 }), body("content").trim().isLength({ min: 5 })];

// GET /feed/posts
router.get("/posts", isAuth, FeedController.getPosts);

// GET /feed/post/:postId
router.get("/post/:postId", isAuth, FeedController.getPost);

// POST /feed/post
router.post("/post", isAuth, postValidator, FeedController.createPost);

// PUT /feed/post/:postId
router.put("/post/:postId", isAuth, postValidator, FeedController.updatePost);

// DELETE /feed/post/:postId
router.delete("/post/:postId", isAuth, FeedController.deletePost);

export default router;
