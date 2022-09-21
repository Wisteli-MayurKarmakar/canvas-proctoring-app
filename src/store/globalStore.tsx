import produce from "immer";
import create from "zustand";
import { devtools } from "zustand/middleware";

type WebCamStore = {
  stream?: MediaStream;
  setStream: (stream: MediaStream) => void;
};

type StudentStore = {
  studentQuizAuthObject: {
    [key: string]: string | boolean;
  }[];
  setQuizAuthObj: (data: { [key: string]: string | boolean }) => void;
};

export const useWebCamStore = create<WebCamStore>()(
  devtools(
    (set) => ({
      stream: undefined,
      setStream: (streamSource) => set({ stream: streamSource }),
    }),
    { name: "useWebCamStore" }
  )
);

export const useStudentStore = create<StudentStore>()(
  devtools(
    (set) => ({
      studentQuizAuthObject: [],
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
    }),
    { name: "StudentStore" }
  )
);
