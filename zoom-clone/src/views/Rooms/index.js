import React, { useEffect } from "react";
import useSocketPeerInitialization from "../../services/Initialization.js";
import { useSocketServices } from "../../services/socket.js";

import "./styles.css";

const Room = (props) => {
  console.log("component");
  const roomID = props.match.params.id;
  useEffect(() => {
    console.log("inside 123");
    startConnection();
  }, []);
  const startConnection = () => {
    socket.on("connect", () => {
      console.log("connected");
    });
    peer.on("open", (id) => {
      console.log("here id = ", id);
      socket.emit("join-room", roomID, id);
      connection(roomID);
    });
  };
  const [socket, connection, peer] = useSocketServices();

  return (
    <div>
      <div id="video-grid"></div>
      <button title="join room">room joined</button>
      <div />
    </div>
  );
};

export default Room;
