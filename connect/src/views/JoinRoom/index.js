import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { getRoomId } from "../../Api/getRoomId.js";

const joinRoom = async (setRoomID) => {
  const roomId = await getRoomId();
  setRoomID(roomId.link);
};
function JoinRoom() {
  const [roomID, setRoomID] = useState();
  const xyz = () => {
    joinRoom(setRoomID);
  };

  return (
    <div>
      {/* this is the video grid div where user video will be visible */}
      <div id="video-grid"></div>
      {roomID ? (
        <Redirect to={`/room/${roomID}`} />
      ) : (
        <button onClick={xyz} title="join room">
          join rrom{" "}
        </button>
      )}
      <div />
    </div>
  );
}

export default JoinRoom;
