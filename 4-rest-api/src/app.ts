import Express from "express";

import FeedRouter from "./routes/feed";

const app = Express();

app.use(Express.json());

app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", FeedRouter);

app.listen(3003, () => {
  console.log("Server started on port 3003");
});
