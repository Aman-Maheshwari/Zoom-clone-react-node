import openSocket from "socket.io-client";

import Peer from "peerjs";

const useSocketPeerInitialization = () => {
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
    return new Peer("", {
      host: "/",
      port: "3030",
      path: "/peerjs",
    });
  };
  return [initializeSocketConnection(), initializePeerConnection()];
};

export default useSocketPeerInitialization;
