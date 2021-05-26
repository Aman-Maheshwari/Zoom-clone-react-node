const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const { ExpressPeerServer } = require("peer");

const app = express();
const app1 = express();

app.use(cors());

app1.use(cors());

const server = require("http").Server(app);
const server1 = require("http").Server(app1);

const peerServer = ExpressPeerServer(server1, {
  debug: true,
});

const io = require("socket.io")(server);
app1.use("/peerjs", peerServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  console.log("serer");
  res.send("server");
});
app.get("/join", (req, res) => {
  res.send({ link: uuidv4() });
});

app.get("/*", (req, res) => {
  res.send("No data Found");
});
io.on("connection", (socket) => {
  let roomID, userID_;
  socket.on("join-room", (roomId, userID) => {
    console.log("roomId = ", roomId);
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userID);
    roomID = roomId;
    userID_ = userID;
  });

  socket.on("closing-connection", (roomId, userID) => {
    console.log("closing", roomId, " ", userID);
    // console.log("socket = ", socket);
    socket.to(roomId).emit("user-disconnected", userID);
    console.log("emitted");
  });

  socket.on("disconnect", () => {
    console.log("disconnecting");
    socket.to(roomID).emit("user-disconnected", userID_);
  });
});
server.listen(3000, () => {
  console.log("server live also");
});
server1.listen(3030, () => {
  console.log("server live");
});
