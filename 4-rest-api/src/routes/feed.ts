import { Router } from "express";

import FeedController from "../controllers/feed";

const router = Router();

router.get("/posts", FeedController.getPosts);

export default router;
