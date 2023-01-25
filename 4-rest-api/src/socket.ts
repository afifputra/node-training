import * as socketIo from "socket.io";
import * as http from "http";

let io: socketIo.Server;

const init = (httpServer: http.Server) => {
  io = new socketIo.Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: socketIo.Socket) => {
    // console.log("Client connected");
    socket.on("disconnect", () => {
      // console.log("Client disconnected");
    });

    socket.on("logout", (data) => {
      // console.log("logout", data);
      socket.broadcast.emit("logout", data);
    });
  });
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized.");
  }
  return io;
};

export default {
  init,
  getIO,
};
