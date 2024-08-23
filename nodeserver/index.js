const express = require("express");
const path = require("path");
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, "../")));

//Node server which handle socket io connection
const io = require("socket.io")(8080, {
  cors: {
    origin: "http://127.0.0.1:5500", // Allow this origin to connect
    methods: ["GET", "POST"], // Allow these methods
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
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
