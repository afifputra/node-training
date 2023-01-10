import { Router } from "express";
import { body } from "express-validator";

import FeedController from "../controllers/feed";
import isAuth from "../middleware/is-auth";

const router = Router();

// GET /feed/posts
router.get("/posts", isAuth, FeedController.getPosts);

// GET /feed/post/:postId
router.get("/post/:postId", FeedController.getPost);

// POST /feed/post
router.post("/post", [body("title").trim().isLength({ min: 5 }), body("content").trim().isLength({ min: 5 })], FeedController.createPost);

// PUT /feed/post/:postId
router.put("/post/:postId", [body("title").trim().isLength({ min: 5 }), body("content").trim().isLength({ min: 5 })], FeedController.updatePost);

// DELETE /feed/post/:postId
router.delete("/post/:postId", FeedController.deletePost);

export default router;
