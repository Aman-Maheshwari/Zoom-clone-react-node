import openSocket from "socket.io-client";

import Peer from "peerjs";

export const useSocketServices = () => {
  console.log("indise 2112");

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

  const getVideoAudioStream = () => {
    return navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
  };
  const connection = (roomId) => {
    const videoGrid = document.getElementById("video-grid");
    const myVideo = document.createElement("video");
    myVideo.setAttribute("id", "video");
    myVideo.muted = true;
    let myVideoStream;

    getVideoAudioStream().then((stream) => {
      if (stream) {
        myVideoStream = stream;
        addVideoStream(myVideo, stream);
        socket.on("user-connected", (userID) => {
          console.log("new user connected", userID);
          connectToNewUser(userID, stream);
        });
        console.log("abouve");
      }
    });

    peer.on("call", (call) => {
      getVideoAudioStream().then((stream) => {
        console.log("inside answer call");
        call.answer(stream);
        const video = document.createElement("video");
        call.on("stream", (userVideoStream) => {
          addVideoStream(video, userVideoStream);
        });
      });
    });

    const connectToNewUser = (userID, myStream) => {
      console.log("insise calling");
      const call = peer.call(userID, myStream);
      console.log("called");
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        console.log("getting stream", userVideoStream);
        addVideoStream(video, userVideoStream);
      });
    };

    const addVideoStream = (video, stream) => {
      video.srcObject = stream;
      video.addEventListener("loadedmetadata", () => {
        video.play();
      });
      videoGrid.append(video);
    };
  };
  console.log("sockettttt = ", socket);
  console.log("peeeerrrr = ", peer);
  return [socket, connection, peer];
};
