import openSocket from "socket.io-client";

import Peer from "peerjs";

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
    debug: 3,
  });
};
let peers = {};
let socketInstance = null;
class useSocketServices {
  roomID;
  videoContainer = {};
  isSocketConnected = false;
  isPeersConnected = false;

  constructor(roomID) {
    //you came and initialize the Events
    this.roomID = roomID;

    //you get the connection for socket and peer
    this.peer = initializePeerConnection();
    console.log("peer = ", this.peer);
    this.socket = initializeSocketConnection();
    if (this.socket) this.isSocketConnected = true;
    if (this.myPeer) this.isPeersConnected = true;
    this.initializePeersEvents();
    this.initializeSocketEvents();
    console.log("inside constructor");
  }

  initializeSocketEvents = () => {
    this.socket.on("connect", () => {
      console.log("socket connected");
    });
    this.socket.on("user-disconnected", (userID) => {
      console.log("user disconnected-- closing peers");

      /**
       * when you disconnect the socket
       * userID is the peerID of the the userDisconnected
       */

      /**
       * Not understanding this part because peers object will have call obj. of the connection that have called him
       */
      peers[userID] && peers[userID].close();
      /**
       * you remove your video from the screen
       */
      this.removeVideo(userID);
    });

    /**
     * this will work if the socket is disconnected from the server side
     */
    this.socket.on("disconnect", () => {
      console.log("socket disconnected --");
    });
    this.socket.on("error", (err) => {
      console.log("socket error --", err);
    });
  };
  initializePeersEvents = () => {
    /**
     * when you are ready with open peer connection then you emit to server'join-room'
     * server(socket) puts you in the room and emit to all the other connection that a new user has been added
     */
    this.peer.on("open", (id) => {
      console.log("peers established and joined room");
      this.socket.emit("join-room", { id, roomID: this.roomID });

      /**
       * you check for media stream and create your video to be visible on your screen and setPeerListeners
       */
      this.setNavigatorToStream();
    });
    this.peer.on("error", (err) => {
      console.log("peer connection error", err);
      this.peer.reconnect();
    });
  };

  getVideoAudioStream = () => {
    return navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
  };

  setNavigatorToStream = () => {
    this.getVideoAudioStream().then((stream) => {
      if (stream) {
        this.streaming = true;
        /**
         * gives you your own video and this is your own id, therefore you make a video element with your own id and stream
         */
        this.createVideo({ id: this.myID, stream });

        //when the server told all the connection in the room that a new user has joind the room, all the peer call you and you answer their call with your stream
        this.setPeersListeners(stream);
        /**whenever there is a new user admitted, i.e when server emit
         * 'user-connected' this should run.
         * so basically you register the event handler when you start you
         * connection so that you can listen for any further new connection
         */
        this.newUserConnection(stream);
      }
    });
  };

  createVideo = (createObj) => {
    /**
     * createObj = {id: this.myID, stream}
     */
    /**
     * initially when this object is empty you add the id(your and of all the peer who were before you (if any) as wand when they called you and you responded to there call), then whenever a new user gets in after you, you add the corresponding id in the obj. videoContainer
     */
    if (!this.videoContainer[createObj.id]) {
      this.videoContainer[createObj.id] = {
        ...createObj,
      };
      /**
       * gets the div tage that you have created
       */
      const roomContainer = document.getElementById("video-grid");
      const videoContainer = document.createElement("div");
      const video = document.createElement("video");
      video.srcObject = this.videoContainer[createObj.id].stream;
      video.id = createObj.id;
      video.autoplay = true;
      if (this.myID === createObj.id) video.muted = true;
      videoContainer.appendChild(video);
      roomContainer.append(videoContainer);
    } else {
      // @ts-ignore
      /**
       * if the object is not empty and also your peerID is present in the block
       */
      const element = document.getElementById(createObj.id);
      element.srcObject = createObj.stream;
    }
  };

  /**
   *
   * @param {*} stream
   * when the server told all the connection in the room that a new user has joindthe room, all the peer call you and you answer their call with your stream
   */
  setPeersListeners = (stream) => {
    console.log("calling 111", this.peer);
    this.peer.on("call", (call) => {
      //answer the call with your stream

      console.log("answered");

      call.answer(stream);
      /**
       * when connection gets established then you also receive userStream
       */
      call.on("stream", (userVideoStream) => {
        console.log("user stream data", userVideoStream);
        /**
         * then you have to create a video element for the receiving stream and the id corresponds to the peer id who is calling you
         */
        this.createVideo({ id: call.metadata.id, stream: userVideoStream });
      });
      // call.on('close', () => {
      //     console.log('closing peers listeners', call.metadata.id);
      //     this.removeVideo(call.metadata.id);
      // });
      // call.on('error', () => {
      //     console.log('peer error ------');
      //     this.removeVideo(call.metadata.id);
      // });

      /**
       * peers object stores the call object (returned when you as a new connection joins the room and all the existing connection calls you)
       * of the user calling you...
       * that means the metadata is from the peer calling you
       * peers[user id calling you] = call object corresponding to that peer connection for the user
       */
      peers[call.metadata.id] = call;
    });
  };
  /**
   *
   * @param {your stream} stream
   * this function register the event action for 'user-connected' that is when ever user gets connected this is fired
   */
  newUserConnection = (stream) => {
    this.socket.on("user-connected", (userData) => {
      /**
       * userData is {userID and roomID}
       */
      console.log("New User Connected", userData);

      this.connectToNewUser(userData, stream);
    });
  };

  /**
   *
   * @param {*} userData
   * @param {*} stream
   *
   * you call the new user with you stream and receive the answer as user streams
   */
  connectToNewUser = (userData, stream) => {
    const userID = userData;
    const call = this.peer.call(userID, stream, {
      metadata: { id: this.myID },
    });
    console.log("call = ", call);
    call.on("stream", (userVideoStream) => {
      //now you have to make a video element for user stream that is the user that has just joined or say answered your call
      this.createVideo({ id: userID, stream: userVideoStream, userData });
    });
    // call.on('close', () => {
    //     console.log('closing new user', userID);
    //     this.removeVideo(userID);
    // });
    // call.on('error', () => {
    //     console.log('peer error ------')
    //     this.removeVideo(userID);
    // })
    // peers[userID] = call;
  };

  removeVideo = (id) => {
    delete this.videoContainer[id];
    const video = document.getElementById(id);
    if (video) video.remove();
  };
  destoryConnection = () => {
    /**
     * createObj = {id: this.myID, stream}
     * and videoContainer = [createObj1,createObj2,createObj3, ...]
     * takes all the tracks corresponding to your peerid and stop them,
     *
     * basically stopping you webcam from streaming that is stopping getUserMedia().stream
     */
    const myMediaTracks = this.videoContainer[this.myID]?.stream.getTracks();
    myMediaTracks?.forEach((track) => {
      track.stop();
    });

    /**
     * emits event 'disconnect' which is listened on the server where in the server broadcast to the entire room that the user has closed the socket connection and is disconnecting
     */
    socketInstance?.socket.disconnect();

    // Close the connection to the peer server(i.e it will stop sending its stream to the other peers) and terminate all existing connections(and also will stop receiving stream from any existing connection)
    this.peer.destroy();
  };
}

export function createSocketConnectionInstance(roomID) {
  return (socketInstance = new useSocketServices(roomID));
}
