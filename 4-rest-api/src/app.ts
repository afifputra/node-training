import * as http from "http";
import Express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import multer from "multer";
import { v4 } from "uuid";
import socket from "./socket";
import helmet from "helmet";

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
const server = http.createServer(app);

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
app.use(helmet());
app.use(multer({ storage: fileStorage, fileFilter }).single("image"));
app.use("/dist/images", Express.static(path.join(__dirname, "..", "dist", "images")));

app.use(
  cors({
    origin: "*",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

app.use("/feed", FeedRoutes);
app.use("/auth", UserRoutes);

mongoose.set("strictQuery", true);

(async () => {
  try {
    await mongoose.connect(`mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.5fapyff.mongodb.net/${process.env.COLLECTION}?retryWrites=true&w=majority`);

    socket.init(server);

    server.listen(process.env.PORT || 3000, () => {
      // console.log("Server is running on port 3003");
    });
  } catch (error) {
    // console.log(error);
  }
})();
