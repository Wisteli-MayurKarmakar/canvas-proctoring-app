import { io } from "socket.io-client";
let webSocketUrl = "https://examd.us:4921/";

export const getWebSocketUrl = () => {
  const socket = io(webSocketUrl, {
    autoConnect: false,
  });
  return socket;
};