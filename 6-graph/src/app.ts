import * as http from "http";
import Express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import multer from "multer";
import { v4 } from "uuid";
import { graphqlHTTP } from "express-graphql";

import graphqlSchema from "./graphql/schema";
import graphqlResolvers from "./graphql/resolvers";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }

  interface Error {
    data?: any;
    code?: number;
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
app.use(multer({ storage: fileStorage, fileFilter }).single("image"));
app.use("/dist/images", Express.static(path.join(__dirname, "..", "dist", "images")));

app.use(
  cors({
    origin: "*",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST"],
  })
);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
    customFormatErrorFn(err) {
      if (!err.originalError) {
        return err;
      }

      const data = err.originalError.data;
      const message = err.message || "An error occurred.";
      const code = err.originalError.code || 500;

      return {
        message,
        status: code,
        data,
      };
    },
  })
);

mongoose.set("strictQuery", true);

(async () => {
  try {
    await mongoose.connect("mongodb+srv://web-app:online123@cluster0.5fapyff.mongodb.net/messages?retryWrites=true&w=majority");

    server.listen(3003, () => {
      console.log("Server is running on port 3003");
    });
  } catch (error) {
    console.log(error);
  }
})();
