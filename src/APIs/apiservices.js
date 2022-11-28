import axios from "axios";
import { io } from "socket.io-client";

let env = process.env.NODE_ENV;
export let webSocketUrl =
  env === "development"
    ? "wss://examd.us:4921/"
    : "wss://examd.online:4921/";

export const getWebSocketUrl = () => {
  const socket = io(webSocketUrl, {
    autoConnect: false,
  });
  return socket;
};

export const getUserDetails = (authToken, guid, userId) => {
  axios
    .post(
      `https://examd.us/student/api/v1/getLtiStudentProfileDetails/${guid}/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    )
    .then((resp) => {
      return resp.data;
    })
    .catch((error) => {
      return null;
    });
};
