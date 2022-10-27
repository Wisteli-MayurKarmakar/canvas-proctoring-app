import produce from "immer";
import moment from "moment";
import create from "zustand";
import { devtools } from "zustand/middleware";

type WebCamStore = {
  stream?: MediaStream;
  isWebCamActive: boolean;
  initWebCam: () => void;
  closeWebCamResouce: () => void;
};

type StudentStore = {
  studentQuizAuthObject: {
    [key: string]: string | boolean;
  }[];
  currentTime: any;
  authStepsCount: number;
  setAuthStepsCount: (count: number) => void;
  setQuizAuthObj: (data: { [key: string]: string | boolean }) => void;
  setCurrentTime: () => void;
};

export const useWebCamStore = create<WebCamStore>()(
  devtools(
    (set, get) => ({
      stream: undefined,
      isWebCamActive: false,
      initWebCam: async () => {
        let streamInstance = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        if (streamInstance) {
          set({
            stream: streamInstance,
            isWebCamActive: streamInstance.active,
          });
        }
      },

      closeWebCamResouce: () => {
        if (get().isWebCamActive) {
          get()
            .stream?.getTracks()
            .forEach((tracks) => {
              tracks.stop();
            });
          set({ stream: undefined, isWebCamActive: false });
        }
      },
    }),
    { name: "WebCamStore" }
  )
);

export const useStudentStore = create<StudentStore>()(
  devtools(
    (set) => ({
      studentQuizAuthObject: [],
      currentTime: new Date(),
      authStepsCount: 0,
      setQuizAuthObj: (data) =>
        set(
          produce((draft) => {
            let index: number = -1;
            draft.studentQuizAuthObject.forEach((item: any, pos: number) => {
              if (item.quizId === data.quizId) {
                index = pos;
                return;
              }
            });
            if (index > -1) {
              draft.studentQuizAuthObject[index] = data;
            } else {
              draft.studentQuizAuthObject.push(data);
            }
          })
        ),
      setCurrentTime: () =>
        set(
          produce((draft) => {
            draft.currentTime = moment();
          })
        ),
      setAuthStepsCount: (count: number) => {
        set(
          produce((draft) => {
            draft.authStepsCount = count;
          })
        );
      },
    }),
    { name: "StudentStore" }
  )
);
