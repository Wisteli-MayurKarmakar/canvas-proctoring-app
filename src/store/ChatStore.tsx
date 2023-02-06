import moment from "moment";
import { io, Socket } from "socket.io-client";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { webSocketUrl } from "../APIs/apiservices";
import {
  ChatStore,
  ChatMessage,
  ClientToServerEvents,
  ServerToClientEvents,
} from "../AppTypes";

type RecievedMsg = {
  msgType: string;
  msg: ChatMessage;
};

export const useChatControllerStore = create<ChatStore>()(
  devtools(
    (set, get) => ({
      createConnection: (roomName: string, userName: string) => {
        let conn: Socket<ClientToServerEvents, ServerToClientEvents> = io(
          webSocketUrl as string,
          {
            autoConnect: false,
          }
        );
        set({
          socketInstance: conn,
        });
        if (!conn.connected) {
          conn.connect();
          conn.emit("validate", {
            user: userName,
            room: roomName,
            evt: "chat",
          });
        }

        conn.on("chat", (data: any) => {
          if (data.type === "chat") {
            let msg: RecievedMsg = JSON.parse(data.message);
            if (msg.msgType === "Assessment_Chat") {
              set({
                recievedMsg: [...get().recievedMsg, msg.msg],
              });
            }
          }
        });
      },
      studentDisconnected: false,
      instructorDisconnected: false,
      recievedMsg: [],
      sentMsg: [],
      socketInstance: null,
      sendMessage: (
        roomName: string,
        messageType: string,
        msgToSend: ChatMessage
      ) => {
        let conn: Socket<ClientToServerEvents, ServerToClientEvents> | null =
          get().socketInstance;
        if (conn) {
          conn.emit("chat", {
            evt: "chat",
            room: roomName,
            text: JSON.stringify({
              msgType: messageType,
              msg: {
                isStudent: msgToSend.isStudent,
                message: msgToSend.message,
                timestamp: moment().toISOString(),
              },
            }),
          });
          set({
            sentMsg: [...get().sentMsg, msgToSend],
          });
        }
      },
    }),
    {
      name: "ChatStore",
    }
  )
);
