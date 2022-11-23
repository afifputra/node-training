import express from "express";

const app = express();

app.use("/add-product", (req, res, next) => {
  console.log("In another the middleware!");
  res.send('<h1>The "Add Product" Page!</h1>');
});

app.use("/", (req, res, next) => {
  console.log("In another the middleware!");
  res.send("<h1>Hello from Express!</h1>");
});

app.listen(3001);
