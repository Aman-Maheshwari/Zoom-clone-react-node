/**
 *
 * @returns socket.io-slient open connection instance
 */
const useSocketServices = (socket, peer) => {
  const getVideoAudioStream = () => {
    return navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
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
      }
    });

    peer.on("open", (id) => {
      console.log("here ");
      socket.emit("join-room", roomId, id);
    });

    socket.on("user-connected", (userID) => {
      console.log("new user connected", userID);
    });

    const addVideoStream = (video, stream) => {
      video.srcObject = stream;
      video.addEventListener("loadedmetadata", () => {
        video.play();
      });
      videoGrid.append(video);
    };
  };
  //   console.log("socket = ", socket);
  return connection;
};

export default useSocketServices;
