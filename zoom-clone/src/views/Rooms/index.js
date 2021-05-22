import React, { useEffect } from "react";
import { getRoomId } from "../../Api/getRoomId.js";
import {
  connection,
  initializeSocketConnection,
} from "../../connection/connection.js";
import "./styles.css";
let socket;

const joinRoom = async () => {
  const roomId = await getRoomId();
  console.log("roomID = ", roomId);
  socket.emit("join-room", roomId.link);
  socket.on("connect", () => {
    console.log("connected");
  });
};

function Room() {
  let roomID;

  /**
   * when the components loads initialize the socket connection and if socket gets connected start the stream
   */
  useEffect(() => {
    socket = initializeSocketConnection();
    connection();
  }, []);
  useEffect(() => {}, [roomID]);

  return (
    <div>
      {/* this is the video grid div where user video will be visible */}
      <div id="video-grid"></div>
      <button onClick={joinRoom} title="join room">
        join rrom{" "}
      </button>
      <div />
    </div>
  );
}

export default Room;
