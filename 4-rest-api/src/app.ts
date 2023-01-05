import Express from "express";

import FeedRouter from "./routes/feed";

const app = Express();

app.use(Express.json());

app.use("/feed", FeedRouter);

app.listen(3003, () => {
  console.log("Server started on port 3003");
});
