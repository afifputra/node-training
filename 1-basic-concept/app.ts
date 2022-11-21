import { IncomingMessage, ServerResponse } from "http";

const http = require("http");

const rqListener = (req: IncomingMessage, res: ServerResponse) => {
  console.log(req.url, req.method, req.headers);
  res.end("Hello World");
};

const server = http.createServer(rqListener);

server.listen(3000);
