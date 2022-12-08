import { Router } from "express";

const router = Router();

const users: {
  username: string;
}[] = [];

// GET => /
router.get("/", (req, res, next) => {
  res.render("home", {
    docTitle: "Home",
    path: "/",
  });
});

// POST => /
router.post("/", (req, res, next) => {
  const username: string = req.body.username;
  users.push({ username });
  res.redirect("/users");
});

module.exports = { router, users };
