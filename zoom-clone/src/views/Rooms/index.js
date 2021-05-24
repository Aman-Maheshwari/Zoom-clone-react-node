import React, { useEffect } from "react";
import useSocketPeerInitialization from "../../services/Initialization.js";
import useSocketServices from "../../services/socket.js";

import "./styles.css";

const Room = (props) => {
  const roomID = props.match.params.id;
  const [socket, peer] = useSocketPeerInitialization();
  const connection = useSocketServices(socket, peer);
  useEffect(() => {
    if (roomID !== undefined) {
      startConnection();
    }
  }, []);
  const startConnection = () => {
    socket.on("connect", () => {
      connection(roomID);
      console.log("connected");
    });
  };

  return (
    <div>
      <div id="video-grid"></div>
      <button title="join room">room joined</button>
      <div />
    </div>
  );
};

export default Room;
