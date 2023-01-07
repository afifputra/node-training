import { Router } from "express";

import FeedController from "../controllers/feed";

const router = Router();

// GET /feed/posts
router.get("/posts", FeedController.getPosts);

// POST /feed/post
router.post("/post", FeedController.createPost);

export default router;
