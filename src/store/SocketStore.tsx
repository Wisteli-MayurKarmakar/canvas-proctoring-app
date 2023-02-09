import { io, Socket } from "socket.io-client";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { webSocketUrl } from "../APIs/apiservices";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  Assignment,
  ViolationMessage,
} from "../AppTypes";
import {
  useAssignmentStore,
  useCommonStudentDashboardStore,
} from "./StudentDashboardStore";
import { useAppStore } from "./AppSotre";

type DataToSend = {
  quizId: string;
  studentId: string;
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
  roomName: string;
  active: boolean;
  // messagesIncoming: IncomingMessage | null;
  // assgnStatRequesting: boolean;
  assignmentId: string;
  quizzesLive: string[];
  studentsLive: string[];
  // messagesOutgoing: string[] | null;
  socketInstance: Socket<ClientToServerEvents, ServerToClientEvents> | null;
  createConnection: (
    roomName: string,
    userName: string,
    messageType: string,
    dataToSend: DataToSend
  ) => void;
  sendAssgnStatus: (
    quizId: string,
    studentId: string,
    messageType: string,
    roomName: string
  ) => void;
  sendViolationMessages: (messageType: string, msg: ViolationMessage) => void;
};

export const useSocketStore = create<SocketStore>()(
  devtools(
    (set, get) => ({
      roomName: "",
      // messagesIncoming: null,
      // messagesOutgoing: null,
      assignmentId: "",
      quizzesLive: [],
      studentsLive: [],
      socketInstance: null,
      // assgnStatRequesting: false,
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
              quizId: dataToSend.quizId,
              studentId: dataToSend.studentId,
            },
          }),
        });

        conn.on("chat", (data: any) => {
          if (data.type === "chat") {
            let msg: {
              msgType: string;
              msg: {
                quizId: string;
                studentId: string;
              };
            } = JSON.parse(data.message);

            let loggedInUserType =
              useCommonStudentDashboardStore.getState()
                .loggedInUserEnrollmentType;

            if (loggedInUserType === "TeacherEnrollment") {
              if (msg.msgType === "ASSGN_PROC_START") {
                let activeQuizzes = [...get().quizzesLive];
                let activeStudents = [...get().studentsLive];
                activeQuizzes.push(msg.msg.quizId);
                activeStudents.push(msg.msg.studentId);
                // incomingMsgs[msg.msg.assignmentId] = {
                //   assignmentName: msg.msg.assignmentName,
                //   active: true,
                //   studentId: msg.msg.studentId,
                // };
                // let activeStudents = [...get().studentsActive];
                // if (get().assignmentId === msg.msg.assignmentId) {
                //   activeStudents.push(msg.msg.studentId);
                // }
                set({
                  quizzesLive: activeQuizzes,
                  studentsLive: activeStudents,
                });
              }
              if (msg.msgType === "ASSGN_PROC_END") {
                let studentId = msg.msg.studentId;
                let activeStudents = [...get().studentsLive];
                let idx = activeStudents.indexOf(studentId);
                activeStudents.splice(idx, 1);
                set({
                  studentsLive: activeStudents,
                });
                // let incomingMsgs: IncomingMessage = {
                //   ...get().messagesIncoming,
                // };
                // incomingMsgs[msg.msg.assignmentId] = {
                //   assignmentName: msg.msg.assignmentName,
                //   active: false,
                // };
                // let activeStudents = [...get().studentsActive];
                // let idx = activeStudents.indexOf(msg.msg.studentId);
                // if (idx !== -1) {
                //   activeStudents.splice(idx, 1);
                // }
                // set({
                //   messagesIncoming: incomingMsgs,
                //   studentsActive: activeStudents,
                // });
              }
            } else {
              if (msg.msgType === "ASSGN_STAT_REQ") {
                get().sendAssgnStatus(
                  dataToSend.quizId,
                  dataToSend.studentId,
                  "ASSGN_PROC_START",
                  roomName
                );
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
        quizId: string,
        studentId: string,
        messageType: string,
        roomName: string
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
                quizId: quizId,
                studentId: studentId,
              },
            }),
          });
        }
      },
      sendViolationMessages: (messageType: string, msg: ViolationMessage) => {
        let conn: Socket<ClientToServerEvents, ServerToClientEvents> | null =
          get().socketInstance;
        let roomName: string = get().roomName;
        if (conn && roomName) {
          conn.emit("chat", {
            evt: "chat",
            room: roomName,
            text: JSON.stringify({
              msgType: messageType,
              msg: msg,
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
