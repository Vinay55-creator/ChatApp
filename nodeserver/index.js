const express = require("express");
const path = require("path");
const app = express();
const http = require("http");
const socketIo = require("socket.io"); // Import the socket.io module

const server = http.createServer(app);

// Serve static files
app.use(express.static(path.join(__dirname, "../")));

//Node server which handle socket io connection
const io = socketIo(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"], 
  },
});

const users = {};

io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });

  socket.on("disconnect", (message) => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  // Use server.listen instead of http.listen
  console.log(`Server running on port ${PORT}`);
});
