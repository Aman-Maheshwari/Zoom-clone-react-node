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

const connection = (roomId, id, socket, peer, videoContainer) => {
  let peers_list = {};
  const videoGrid = document.getElementById("video-grid");
  const myVideo = document.createElement("video");
  myVideo.muted = true;
  socket.on("user-disconnected", (userID) => {
    console.log("disconnectd success");
    console.log(peers_list[userID]);
    peers_list[userID] && peers_list[userID].close();
    removeVideo(userID, videoContainer);
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
      removeVideo(call.metadata.id, videoContainer);
    });

    call.on("error", () => {
      console.log("peer error ------");
      removeVideo(call.metadata.id, videoContainer);
    });
  });

  const connectToNewUser = (userID, myStream) => {
    const call = peer.call(userID, myStream, { metadata: { id } });
    // peers_[userID] = call;
    // setPeers(peers, peers_);
    const video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
      console.log("getting stream", userVideoStream);
      addVideoStream(video, userVideoStream, userID);
    });
    call.on("close", () => {
      console.log("closing new user", userID);
      removeVideo(userID, videoContainer);
    });
    call.on("error", () => {
      console.log("peer error ------");
      removeVideo(userID, videoContainer);
    });

    //jisko call kiya uska call object store karlo
    peers_list[userID] = call;
  };

  const addVideoStream = (video, stream, ID) => {
    let createObj = {
      ID,
      stream,
    };
    if (!videoContainer[createObj.ID]) {
      videoContainer[createObj.ID] = { ...createObj };

      video.setAttribute("id", ID);

      video.srcObject = stream;
      video.addEventListener("loadedmetadata", () => {
        video.play();
      });
      videoGrid.append(video);
    } else {
      console.log("Element = ", document.getElementById(createObj.id));
    }
  };
};

const removeVideo = (id, videoContainer) => {
  delete videoContainer[id];
  const video = document.getElementById(id);
  if (video) video.remove();
};

const destroyConnection = (socket, peer, roomId, id, videoContainer) => {
  console.log("destroy = ", videoContainer[id].stream.getTracks());
  const myMediaTracks = videoContainer[id]?.stream.getTracks();
  myMediaTracks?.forEach((track) => {
    track.stop();
  });
  socket.disconnect();
  removeVideo(id, videoContainer);
  peer.destroy();
};

const Room = (props) => {
  console.log("component");
  const roomID = props.match.params.id;
  const socketRef = useRef(null);
  const peerRef = useRef(null);
  const peerId = useRef(null);
  const videoContainer = useRef(null);

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
