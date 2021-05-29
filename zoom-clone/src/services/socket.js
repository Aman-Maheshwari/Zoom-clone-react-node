import React from "react";

import ReactPlayer from "react-player/youtube";

const getVideoAudioStream = () => {
  return navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
};
export const connection = (roomId, id, socket, peer, videoContainer) => {
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
      window.globalStream = stream;
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

export const destroyConnection = (socket, peer, roomId, id, videoContainer) => {
  console.log("destroy = ", videoContainer[id].stream.getTracks());
  const myMediaTracks = videoContainer[id]?.stream.getTracks();
  myMediaTracks?.forEach((track) => {
    track.stop();
  });
  socket.disconnect();
  removeVideo(id, videoContainer);
  peer.destroy();
};
/****************************************************************************************************************************/

export const recordStreamStart = async () => {
  let audioTrack, videoTrack, stream;
  /**
   * to get audio and video track, Note audio:true works only with windows chrome so general way is taken
   */
  try {
    const displayStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });
    [videoTrack] = displayStream.getVideoTracks();
    const audioStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    [audioTrack] = audioStream.getAudioTracks();
    stream = new MediaStream([videoTrack, audioTrack]);
    console.log(stream.getAudioTracks().length);
  } catch (error) {
    console.log(error);
  }

  var options;
  if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
    options = { mimeType: "video/webm; codecs=vp9" };
  } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8")) {
    options = { mimeType: "video/webm; codecs=vp8" };
  }

  /**
   * start recording
   */
  const recorder = await new MediaRecorder(stream, options);
  recorder.start();

  const chunks = [];
  recorder.ondataavailable = (e) => {
    chunks.push(e.data);
  };

  /**
   *
   *event listener for stopping
   */
  recorder.onstop = (e) => {
    const completeBlob = new Blob(chunks, { type: "video/*" });
    const recordedVideo = document.createElement("video");
    recordedVideo.src = null;
    recordedVideo.srcObject = null;
    recordedVideo.src = window.URL.createObjectURL(completeBlob);
    recordedVideo.controls = true;
    recordedVideo.play();
    document.getElementById("video-grid1").append(recordedVideo);
    stream.getTracks().forEach((track) => track.stop());
  };
  stream.getVideoTracks()[0].onended = () => {
    recorder.stop();
    stream.removeTrack(stream.getAudioTracks()[0]);
    console.log("udio track length = ", stream.getAudioTracks().length);
  };

  return recorder;
};

/**
 *
 * to stop recording
 */
export const recordStreamStop = (recorder) => {
  recorder.stop();
};
