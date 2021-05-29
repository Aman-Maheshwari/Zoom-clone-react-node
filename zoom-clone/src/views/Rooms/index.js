import React, { useEffect, useRef, useState } from "react";
// import useSocketPeerInitialization from "../../services/Initialization.js";
import {
  connection,
  destroyConnection,
  recordStreamStop,
  recordStreamStart,
} from "../../services/socket.js";
import "./styles.css";
import ReactPlayer from "react-player/youtube";

import { InitializeConnection } from "../../services/Initialization.js";

const Room = (props) => {
  console.log("component");
  const roomID = props.match.params.id;
  const socketRef = useRef(null);
  const peerRef = useRef(null);
  const peerId = useRef(null);
  const videoContainer = useRef(null);
  const dataRef = useRef(null);
  const recorderRef = useRef(null);

  useEffect(() => {
    const [socket, peer] = InitializeConnection();
    startConnection(socket, peer);
    socketRef.current = socket;
    peerRef.current = peer;
    videoContainer.current = {};
  }, []);

  const startConnection = (currSocket, currPeer) => {
    currSocket.on("connect", () => {
      console.log("connected");
    });
    currPeer.on("open", (id) => {
      console.log("this is my id = ", id);
      currSocket.emit("join-room", roomID, id);
      peerId.current = id;
      connection(roomID, id, currSocket, currPeer, videoContainer.current);
    });
  };

  const disconnect = () => {
    destroyConnection(
      socketRef.current,
      peerRef.current,
      roomID,
      peerId.current,
      videoContainer.current
    );
  };

  const startRecording = async () => {
    // const stream = await navigator.mediaDevices.getDisplayMedia({
    //   video: true,
    //   audio: true,
    // });
    // var options;
    // if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
    //   options = { mimeType: "video/webm; codecs=vp9" };
    // } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8")) {
    //   options = { mimeType: "video/webm; codecs=vp8" };
    // }
    // const recorder = new MediaRecorder(stream, options);
    // recorderRef.current = recorder;
    // const stopR = recordStreamStart(recorder);
    // console.log("stop = ", stream.getAudioTracks()[0]);
    // console.log(stream.getVideoTracks()[0]);
    recorderRef.current = await recordStreamStart();
  };

  const stopRecording = () => {
    recordStreamStop(recorderRef.current);
  };

  return (
    <div>
      <div id="video-grid"></div>
      {/* <video id="video-grid2" height="300" width="400" autoPlay>
        <source src="test.webm" type="video/webm" />
        not working
      </video> */}
      <div id="video-grid1"></div>
      {/* <ReactPlayer url={URL.createObjectURL(completeBlob)} /> */}

      <button title="join room">room joined</button>
      <button title="destroyConnection" onClick={disconnect}>
        disconnecct
      </button>
      <button title="Record" onClick={startRecording}>
        Record
      </button>
      <button title="Record" onClick={stopRecording}>
        SRecord
      </button>
      <div />
    </div>
  );
};

export default Room;
