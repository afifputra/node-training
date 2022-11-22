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
  } else if (url === "/message" && method === "POST") {
    const body: any[] = [];

    req.on("data", (chunk: any) => {
      body.push(chunk);
    });

    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];
      fs.writeFileSync("message.txt", message);
    });
  }

  // res.setHeader("Content-Type", "application/json");
  // res.write(JSON.stringify({ message: "Hello World" }));
  // res.end();
};

const server = http.createServer(rqListener);

server.listen(3000);
