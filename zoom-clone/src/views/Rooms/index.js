import React, { useEffect, useState, useRef } from "react";
import useScript from "../../Hooks/loadScript.js";
import useSocketPeerInitialization from "../../services/Initialization.js";
import { useSocketServices } from "../../services/socket.js";

import { createSocketConnectionInstance } from "../../services/test.js";

import "./styles.css";

const Room = (props) => {
  const roomID = props.match.params.id;
  let socketInstance = useRef(null);
  useEffect(() => {
    console.log("roon id  = ", roomID);
    startConnection();
  }, []);
  const startConnection = () => {
    socketInstance.current = createSocketConnectionInstance(roomID);
  };

  // setTimeout(() => {
  //   setP("t");
  // }, 3000);
  // useEffect(() => {
  //   startConnection();

  //   return () => {
  //     console.log("heyy fiurh");
  //     // socket.disconnect();
  //   };
  // }, []);

  // const startConnection = () => {
  //   socket.on("connect", () => {
  //     console.log("connected");
  //   });
  //   socket.on("disconnect", () => {
  //     console.log("socket disconnected --");
  //   });
  //   socket.on("error", (err) => {
  //     console.log("socket error --", err);
  //   });

  //   /**
  //    * as soon as you join the room you emit a event from socket 'join-room' to all the users in the room
  //    */
  //   if (peerId === null) {
  //     peer.on("open", (id) => {
  //       console.log("here id = ", id);
  //       socket.emit("join-room", roomID, id);
  //       setPeerId(id);
  //       connection(roomID, id);
  //     });
  //   }
  // };
  // const [socket, connection, peer] = useSocketServices();

  return (
    <div>
      <div id="video-grid"></div>
      <button title="join room">room joined</button>
      <div />
      <div>
        <button title="disconnect">disconnect</button>
      </div>
    </div>
  );
};

export default Room;
