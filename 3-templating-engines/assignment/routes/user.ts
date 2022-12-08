import { Router } from "express";

const router = Router();
const userData = require("./home");

router.get("/users", (req, res, next) => {
  const users = userData.users;
  console.log(users);
  res.render("users", {
    users,
    docTitle: "Users",
    path: "/users",
  });
});

module.exports = router;
