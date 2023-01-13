import axios from "axios";
import { io } from "socket.io-client";

export const webSocketUrl = process.env.REACT_APP_SOCKET_URL;

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
