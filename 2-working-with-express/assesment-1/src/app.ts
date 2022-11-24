import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port: number = Number(process?.env?.PORT) || 3000;

app.use("/users", (req: Request, res: Response, next) => {
  console.log("Second Middleware");
  res.send("<h1>Users</h1>");
});

app.use("/", (req: Request, res: Response, next) => {
  console.log("First Middleware");
  res.send("<h1>Hello World</h1>");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
