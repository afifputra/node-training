import Express from "express";
import mongoose from "mongoose";
import path from "path";
import multer from "multer";
import { v4 } from "uuid";

import FeedRoutes from "./routes/feed";
import UserRoutes from "./routes/auth";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const app = Express();

const fileStorage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "dist/images");
  },
  filename: (_, file, cb) => {
    cb(null, `${v4()}-${file.originalname}`);
  },
});

const fileFilter = (_: Express.Request, file: globalThis.Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(Express.json());
app.use(multer({ storage: fileStorage, fileFilter }).single("image"));
app.use("/dist/images", Express.static(path.join(__dirname, "..", "dist", "images")));

app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", FeedRoutes);
app.use("/auth", UserRoutes);

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
