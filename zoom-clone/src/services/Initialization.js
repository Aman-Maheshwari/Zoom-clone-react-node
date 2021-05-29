import openSocket from "socket.io-client";
import Peer from "peerjs";

export const InitializeConnection = () => {
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
