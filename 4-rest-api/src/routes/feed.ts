import { Router } from "express";
import { body } from "express-validator";

import FeedController from "../controllers/feed";

const router = Router();

// GET /feed/posts
router.get("/posts", FeedController.getPosts);

// GET /feed/post/:postId
router.get("/post/:postId", FeedController.getPost);

// POST /feed/post
router.post("/post", [body("title").trim().isLength({ min: 5 }), body("content").trim().isLength({ min: 5 })], FeedController.createPost);

// PUT /feed/post/:postId
router.put("/post/:postId", [body("title").trim().isLength({ min: 5 }), body("content").trim().isLength({ min: 5 })], FeedController.updatePost);

export default router;
