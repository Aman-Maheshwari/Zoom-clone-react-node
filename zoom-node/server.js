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
  socket.on("join-room", (obj) => {
    const {
      id,
      roomID: { roomID },
    } = obj;
    console.log("roomId = ", roomID, id);
    socket.join(roomID);
    socket.to(roomID).emit("user-connected", id);
    socket.on("disconnect", () => {
      socket.to(roomID).emit("user-disconnected", id);
    });
  });
});
server.listen(3000, () => {
  console.log("server live also");
});
server1.listen(3030, () => {
  console.log("server live");
});
