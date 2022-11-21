import { IncomingMessage, ServerResponse } from "http";

const http = require("http");

const rqListener = (req: IncomingMessage, res: ServerResponse) => {
  console.log(req);
};

http.createServer();
