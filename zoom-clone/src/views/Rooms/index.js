import React, { useEffect } from "react";
import { getRoomId } from "../../Api/getRoomId.js";
import { connection } from "../../connection/connection.js";
import "./styles.css";
function Room() {
  useEffect(() => {
    connection();
  }, []);

  return (
    <div>
      {/* this is the video grid div where user video will be visible */}
      <div id="video-grid"></div>
      <button onClick={getRoomId} title="join room">
        join rrom{" "}
      </button>
      <div />
    </div>
  );
}

export default Room;
