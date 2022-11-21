import { IncomingMessage, ServerResponse } from "http";

const http = require("http");

const rqListener = (req: IncomingMessage, res: ServerResponse) => {
  console.log(req);
  res.end("Hello World");
  process.exit();
};

const server = http.createServer(rqListener);

server.listen(3000);
