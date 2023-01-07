import Express from "express";
import mongoose from "mongoose";

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

mongoose.set("strictQuery", true);

(async () => {
  try {
    await mongoose.connect("mongodb+srv://web-app:online123@cluster0.5fapyff.mongodb.net/messages?retryWrites=true&w=majority");

    app.listen(3003);

    console.log("Server is running on port 3003");
  } catch (error) {
    console.log(error);
  }
})();
