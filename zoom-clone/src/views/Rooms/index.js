import React, { useEffect, useState } from "react";
import { getRoomId } from "../../Api/getRoomId.js";
import {
  connection,
  initializeSocketConnection,
} from "../../connection/connection.js";
import "./styles.css";
let socket;

// const joinRoom = async (setRoomID) => {
//   const roomId = await getRoomId();
//   setRoomID(roomId.link);
//   console.log("roomID = ", roomId);
//   socket.emit("join-room", roomId.link);
// };

function Room(props) {
  const [isConnection, setIsConnection] = useState(false);
  const roomID = props.match.params.id;
  if (isConnection) {
    connection();
    socket.emit("join-room", roomID);
    socket.on("user-connected", () => {
      console.log("new user connected");
    });
  }
  /**
   * when the components loads initialize the socket connection and if socket gets connected start the stream
   */
  useEffect(() => {
    if (roomID !== undefined) {
      socket = initializeSocketConnection();
      socket.on("connect", () => {
        setIsConnection(true);
        console.log("connected");
      });
    }
  }, []);
  return (
    <div>
      {/* this is the video grid div where user video will be visible */}
      <div id="video-grid"></div>
      <button title="join room">room joined</button>
      <div />
    </div>
  );
}

export default Room;
