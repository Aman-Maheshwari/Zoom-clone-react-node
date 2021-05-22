const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  console.log("serer");
  res.send("server");
});
app.get("/join", (req, res) => {
  res.send({ link: uuidv4() });
});

app.get("/:room", (req, res) => {
  res.send;
});
app.listen(3000, () => {
  console.log("server  started");
});
