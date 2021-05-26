import React, { useEffect, useRef, useState } from "react";
import useSocketPeerInitialization from "../../services/Initialization.js";
import { useSocketServices } from "../../services/socket.js";
import openSocket from "socket.io-client";
import Peer from "peerjs";
import "./styles.css";

const InitializeConnection = () => {
  const initializeSocketConnection = () => {
    return openSocket.connect("http://localhost:3000", {
      secure: true,
      reconnection: true,
      rejectUnauthorized: false,
      reconnectionAttempts: 10,
      transports: ["websocket"],
    });
  };
  const initializePeerConnection = () => {
    return new Peer(null, {
      host: "/",
      port: "3030",
      path: "/peerjs",
    });
  };
  const socket = initializeSocketConnection();
  const peer = initializePeerConnection();

  return [socket, peer];
};

const getVideoAudioStream = () => {
  return navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
};

const connection = (roomId, id, socket, peer) => {
  let peers_list = {};
  const videoGrid = document.getElementById("video-grid");
  const myVideo = document.createElement("video");
  myVideo.setAttribute("id", "video");
  myVideo.muted = true;

  socket.on("user-disconnected", (userID) => {
    console.log("disconnectd success");
    peers_list[userID] && peers_list[userID].close();
  });
  getVideoAudioStream().then((stream) => {
    if (stream) {
      // myVideoStream = stream;
      addVideoStream(myVideo, stream, id);
      socket.on("user-connected", (userID) => {
        console.log("new user connected", userID);
        connectToNewUser(userID, stream);
      });
    }
  });

  peer.on("call", (call) => {
    console.log("inside peer call");
    getVideoAudioStream().then((stream) => {
      // console.log("inside answer call");
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream, call.metadata.id);
      });
    });
    //jiski stream aari hai usko band kiya
    call.on("close", () => {
      console.log("closing peers listeners here", call.metadata.id);
      // removeVideo(call.metadata.id);
    });

    call.on("error", () => {
      console.log("peer error ------");
      // removeVideo(call.metadata.id);
    });
  });

  const connectToNewUser = (userID, myStream) => {
    const call = peer.call(userID, myStream, { metadata: { id } });
    let peers_ = {};
    // peers_[userID] = call;
    // setPeers(peers, peers_);
    const video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
      console.log("getting stream", userVideoStream);
      addVideoStream(video, userVideoStream, userID);
    });
    call.on("close", () => {
      console.log("closing new user", userID);
      // this.removeVideo(call.metadata.id);
    });

    //jisko call kiya uska call object store karlo
    peers_list[userID] = call;
  };

  const addVideoStream = (video, stream, ID) => {
    let createObj = {
      ID,
      stream,
    };
    // if (videoContainer == undefined || !videoContainer[createObj.ID]) {
    //   let obj = { ...videoContainer, ...createObj };
    //   setVideoContainer(obj);
    // }
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
    videoGrid.append(video);
  };
};

const destroyConnection = (socket, peer, roomId, id) => {
  // const myMediaTracks = videoContainer[id]?.stream.getTracks();
  // myMediaTracks?.forEach((track) => {
  //   track.stop();
  // });
  socket.disconnect();
  peer.destroy();
};
const Room = (props) => {
  console.log("component");
  const roomID = props.match.params.id;
  const socketRef = useRef(null);
  const peerRef = useRef(null);
  const peerId = useRef(null);

  useEffect(() => {
    const [socket, peer] = InitializeConnection();
    startConnection(socket, peer);
    socketRef.current = socket;
    peerRef.current = peer;
  }, []);

  const startConnection = (currSocket, currPeer) => {
    currSocket.on("connect", () => {
      console.log("connected");
    });
    currPeer.on("open", (id) => {
      console.log("this is my id = ", id);
      currSocket.emit("join-room", roomID, id);
      peerId.current = id;
      connection(roomID, id, currSocket, currPeer);
    });
  };

  const disconnect = () => {
    destroyConnection(
      socketRef.current,
      peerRef.current,
      roomID,
      peerId.current
    );
  };

  return (
    <div>
      <div id="video-grid"></div>
      <button title="join room">room joined</button>
      <button title="destroyConnection" onClick={disconnect}>
        disconnecct
      </button>
      <div />
    </div>
  );
};

export default Room;
