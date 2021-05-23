const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const app = express();
app.use(cors());
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  console.log("serer");
  res.send("server");
});
app.get("/join", (req, res) => {
  res.send({ link: uuidv4() });
});

app.get("/room/:id", (req, res) => {
  console.log("res", req.params.id);
  res.send;
});
io.on("connection", (socket) => {
  socket.on("join-room", (roomId) => {
    console.log("roomId = ", roomId);
    socket.join(roomId);
    socket.to(roomId).emit("user-connected");
  });
});
server.listen(3000);
