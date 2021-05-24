// import Peer from "peerjs";

// const getVideoAudioStream = () => {
//   return navigator.mediaDevices.getUserMedia({
//     video: true,
//     audio: true,
//   });
// };

// export const connection = (roomId) => {
//   const videoGrid = document.getElementById("video-grid");
//   const myVideo = document.createElement("video");
//   myVideo.setAttribute("id", "video");
//   myVideo.muted = true;
//   let myVideoStream;

//   getVideoAudioStream().then((stream) => {
//     if (stream) {
//       myVideoStream = stream;
//       addVideoStream(myVideo, stream);
//     }
//   });

//   const addVideoStream = (video, stream) => {
//     video.srcObject = stream;
//     video.addEventListener("loadedmetadata", () => {
//       video.play();
//     });
//     videoGrid.append(video);
//   };
// };

// export const initializePeerConnection = () => {
//   return new Peer("", {
//     host: "http://localhost:3000",
//     secure: true,
//   });
// };
