import express from "express";
import http from "http";

const app = express();

app.use((req, res, next) => {
  console.log("In the middleware!");
  next(); // Allows the request to continue to the next middleware in line
});

app.use((req, res, next) => {
  console.log("In another the middleware!");
});

const server = http.createServer(app);

server.listen(3001);
