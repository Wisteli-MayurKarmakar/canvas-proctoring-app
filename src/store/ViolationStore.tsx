import create from "zustand";
import { devtools } from "zustand/middleware";
import {
  AssessmentViolationStore,
  ClientToServerEvents,
  ServerToClientEvents,
  ViolationMessage,
} from "../AppTypes";
import { Socket, io } from "socket.io-client";
import { webSocketUrl } from "../APIs/apiservices";
import { useAppStore } from "./AppSotre";
import { useAssignmentStore } from "./StudentDashboardStore";

const conn: Socket<ClientToServerEvents, ServerToClientEvents> = io(
  webSocketUrl as string,
  {
    autoConnect: false,
  }
);

const connectSocket = (roomName: string, userName: string) => {
  if (!conn.connected) {
    conn.connect();
    conn.emit("validate", {
      user: userName,
      room: roomName,
      evt: "chat",
    });
  }
};

const sendViolations = (roomName: string, message: ViolationMessage) => {
  if (conn) {
    conn.emit("chat", {
      evt: "chat",
      room: roomName,
      text: JSON.stringify({
        msgType: "VIOLATION_MSG",
        msg: message,
      }),
    });
  }
};

export const useViolationStore = create<AssessmentViolationStore>()(
  devtools(
    (set, get) => ({
      count: 0,
      roomName: "",
      userName: "",
      studentId: "",
      setStudentId: (studentId: string) => {
        const { urlParamsData } = useAppStore.getState();
        const { selectedAssignmentConfigurations } =
          useAssignmentStore.getState();

        const roomName: string = `vl_${urlParamsData.courseId}_${urlParamsData.studentId}_${selectedAssignmentConfigurations?.idInstructor}_${selectedAssignmentConfigurations?.quizId}`;
        const userName: string = urlParamsData.studentId as string;

        connectSocket(roomName, userName);
        set({
          studentId: studentId,
          roomName: roomName,
          userName: userName,
        });
      },
      setMessages: (messages: ViolationMessage) => {
        const roomName = get().roomName;
        sendViolations(roomName, messages);
        set({
          messages: messages,
          count: get().count + 1,
        });
      },
    }),
    {
      name: "useViolationStore",
    }
  )
);
