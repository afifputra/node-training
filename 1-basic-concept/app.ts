import { IncomingMessage, ServerResponse } from "http";

const fs = require("fs");
const http = require("http");

const rqListener = (req: IncomingMessage, res: ServerResponse) => {
  const { url, method } = req;

  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>Enter Message</title></head>");
    res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
    res.write("</html>");
    return res.end();
  }

  if (url === "/message" && method === "POST") {
    const body: string[] = [];

    req.on("data", (chunk: Buffer) => {
      const parsedChunk = chunk.toString();
      body.push(parsedChunk);
    });

    req.on("end", () => {
      const parsedBody = body.join("");
      const message = parsedBody.split("=")[1];
      fs.writeFileSync("message.txt", message);
    });

    res.statusCode = 302;
    res.setHeader("Location", "/");
    return res.end();
  }

  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>My First Page</title></head>");
  res.write("<body><h1>Hello from my Node.js Server!</h1></body>");
  res.write("</html>");
  res.end();
};

const server = http.createServer(rqListener);

server.listen(3000);
