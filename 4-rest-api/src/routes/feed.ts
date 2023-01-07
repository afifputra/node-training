import { Router } from "express";
import { body } from "express-validator";

import FeedController from "../controllers/feed";

const router = Router();

// GET /feed/posts
router.get("/posts", FeedController.getPosts);

// POST /feed/post
router.post("/post", [body("title").trim().isLength({ min: 7 }), body("content").trim().isLength({ min: 5 })], FeedController.createPost);

export default router;
