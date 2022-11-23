import { IncomingMessage, ServerResponse } from "http";

const requestHandler = (req: IncomingMessage, res: ServerResponse) => {
  const { url, method } = req;

  if (url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Projects - 1</title></head>");
    res.write('<body><form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">Send</button></form></body>');
    res.write("</html>");
    return res.end();
  }

  if (url === "/users") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Users</title></head>");
    res.write("<body><ul><li>User 1</li><li>User 2</li></ul></body>");
    res.write("</html>");
    return res.end();
  }

  if (url === "/create-user") {
    const body: Buffer[] = [];

    req.on("data", (chunk: Buffer) => {
      body.push(chunk);
    });

    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const username = parsedBody.split("=")[1];
      console.log(username);
    });

    res.statusCode = 302;
    res.setHeader("Location", "/");
    return res.end();
  }
};

module.exports = requestHandler;
