import { Router } from "express";

import FeedController from "../controllers/feed";

const router = Router();

router.get("/posts", FeedController.getPosts);

router.post("/post", FeedController.createPost);

export default router;
