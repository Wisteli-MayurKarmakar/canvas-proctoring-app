import { io, Socket } from "socket.io-client";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { webSocketUrl } from "../APIs/apiservices";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  Assignment,
} from "../AppTypes";
import {
  useAssignmentStore,
  useCommonStudentDashboardStore,
} from "./StudentDashboardStore";

type DataToSend = {
  assingmentName: string;
  assignmentId: string;
};

type AssignmentDetails = {
  assignmentName: string;
  active: boolean;
  studentId?: string;
};

interface IncomingMessage {
  [key: string]: AssignmentDetails;
}

type SocketStore = {
  roomName: string | null;
  active: boolean;
  messagesIncoming: IncomingMessage | null;
  assgnStatRequesting: boolean;
  messagesOutgoing: string[] | null;
  socketInstance: Socket<ClientToServerEvents, ServerToClientEvents> | null;
  createConnection: (
    roomName: string,
    userName: string,
    messageType: string,
    dataToSend: DataToSend
  ) => void;
  sendAssgnStatus: (
    assignmentId: string,
    assignmentName: string,
    messageType: string
  ) => void;
};

export const useSocketStore = create<SocketStore>()(
  devtools(
    (set, get) => ({
      roomName: null,
      messagesIncoming: null,
      messagesOutgoing: null,
      socketInstance: null,
      assgnStatRequesting: false,
      active: false,
      createConnection: (
        roomName: string,
        userName: string,
        messageType: string,
        dataToSend: DataToSend
      ) => {
        let conn: Socket<ClientToServerEvents, ServerToClientEvents> = io(
          webSocketUrl as string,
          {
            autoConnect: false,
          }
        );
        if (!conn.connected) {
          conn.connect();
          conn.emit("validate", {
            user: userName,
            room: roomName,
            evt: "chat",
          });
        }
        conn.emit("chat", {
          evt: "chat",
          room: roomName,
          text: JSON.stringify({
            msgType: messageType,
            msg: {
              assignmentId: dataToSend.assignmentId,
              assignmentName: dataToSend.assingmentName,
            },
          }),
        });

        conn.on("chat", (data: any) => {
          if (data.type === "chat") {
            let msg: {
              msgType: string;
              msg: { assignmentId: string; assignmentName: string, studentId: string};
            } = JSON.parse(data.message);

            let loggedInUserType =
              useCommonStudentDashboardStore.getState()
                .loggedInUserEnrollmentType;

            if (loggedInUserType === "TeacherEnrollment") {
              if (msg.msgType === "ASSGN_PROC_START") {
                let incomingMsgs: IncomingMessage = {
                  ...get().messagesIncoming,
                };
                incomingMsgs[msg.msg.assignmentId] = {
                  assignmentName: msg.msg.assignmentName,
                  active: true,
                  studentId: msg.msg.studentId
                };
                set({
                  messagesIncoming: incomingMsgs,
                });
              }
              if (msg.msgType === "ASSGN_PROC_END") {
                let incomingMsgs: IncomingMessage = {
                  ...get().messagesIncoming,
                };
                incomingMsgs[msg.msg.assignmentId] = {
                  assignmentName: msg.msg.assignmentName,
                  active: false,
                };
                set({
                  messagesIncoming: incomingMsgs,
                });
              }
            } else {
              if (msg.msgType === "ASSGN_STAT_REQ") {
                let assignment: Assignment = useAssignmentStore.getState()
                  .selectedAssignment as any;
                if (msg.msg.assignmentId === assignment.id.toString()) {
                  set({
                    assgnStatRequesting: true,
                  });
                }
              }
            }
          }
        });
        set({
          roomName: roomName,
          socketInstance: conn,
        });
      },
      sendAssgnStatus: (
        assignmentId: string,
        assignmentName: string,
        messageType: string
      ) => {
        let conn: Socket<ClientToServerEvents, ServerToClientEvents> | null =
          get().socketInstance;
        let roomName: string | null = get().roomName;
        if (conn && roomName) {
          conn.emit("chat", {
            evt: "chat",
            room: roomName,
            text: JSON.stringify({
              msgType: messageType,
              msg: {
                assignmentId: assignmentId,
                assignmentName: assignmentName,
                studentId: useCommonStudentDashboardStore.getState().enrollments?.user.id
              },
            }),
          });
        }
      },
    }),
    {
      name: "Socket Store",
    }
  )
);
