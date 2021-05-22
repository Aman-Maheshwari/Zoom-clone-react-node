import openSocket from "socket.io-client";

const getVideoAudioStream = (video = true, audio = true) => {
  const myNavigator = navigator.mediaDevices.getUserMedia;
  return myNavigator({
    video: video
      ? {
          frameRate: 12,
          noiseSuppression: true,
          width: { min: 640, ideal: 1280, max: 1920 },
          height: { min: 480, ideal: 720, max: 1080 },
        }
      : false,
    audio: audio,
  });
};

export const connection = (roomId) => {
  const videoGrid = document.getElementById("video-grid");
  const myVideo = document.createElement("video");
  myVideo.setAttribute("id", "video");
  myVideo.muted = true;
  let myVideoStream;
  // getVideoAudioStream().then((stream) => {
  //   if (stream) {
  //     myVideoStream = stream;
  //     addVideoStream(myVideo, stream);
  //   }
  // });

  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: true,
    })
    .then((stream) => {
      myVideoStream = stream;
      addVideoStream(myVideo, stream);
    });
  // socket.emit("join-room", roomId);
  // socket.on("user-connected", () => {
  //   console.log("user connected");
  // });
  const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
    videoGrid.append(video);
  };
};

/**
 *
 * @returns socket.io-slient open connection instance
 */
export const initializeSocketConnection = () => {
  return openSocket.connect("http://localhost:3000", {
    secure: true,
    reconnection: true,
    rejectUnauthorized: false,
    reconnectionAttempts: 10,
    transports: ["websocket"],
  });
};
