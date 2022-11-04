import { message } from "antd";
import produce from "immer";
import moment from "moment";
import create from "zustand";
import { devtools } from "zustand/middleware";

type WebCamStore = {
  stream?: MediaStream;
  isWebCamActive: boolean;
  initWebCam: () => void;
  closeWebCamResouce: () => void;
  setStream: (stream: MediaStream) => void;
};

type StandardAccessiblityOptions = {
  phone: boolean;
  psycology: boolean;
  barilley: boolean;
  blind: boolean;
  deaf: boolean;
  handicapped: boolean;
  cc: boolean;
  singleLanguage: boolean;
  teleTypwriter: boolean;
};

type CustomAccessiblityOptions = {
  faceRecog: boolean;
  extraTime: boolean;
  needBreak: boolean;
  shortDisability: boolean;
  startDate?: string;
  endDate?: string;
};

type AccessibilityStore = {
  doc2?: any;
  doc1?: any;
  standardOptions: StandardAccessiblityOptions;
  customOptions: CustomAccessiblityOptions;
  standardOptionSelected?: string;
  customOptionSelected?: string;
  schoolHasDoc1: boolean;
  schoolHasDoc2: boolean;
  message: string;
  setStandardOptionSelecton: (optionName: string) => void;
  setSchoolHasDoc1: (flag: boolean) => void;
  setSchoolHasDoc2: (flag: boolean) => void;
  setCustomOptionSelected: (optionName: string) => void;
  setMessage: (message: string) => void;
  setDoc1: (doc: any) => void;
  setDoc2: (doc: any) => void;
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

export const useAccessiblityStore = create<AccessibilityStore>()(
  devtools(
    (set, get) => ({
      schoolHasDoc1: false,
      schoolHasDoc2: false,
      doc1: undefined,
      doc2: undefined,
      message: "",
      standardOptions: {
        phone: false,
        psycology: false,
        barilley: false,
        blind: false,
        deaf: false,
        handicapped: false,
        cc: false,
        singleLanguage: false,
        teleTypwriter: false,
      },
      customOptions: {
        faceRecog: false,
        extraTime: false,
        needBreak: false,
        shortDisability: false,
      },
      setMessage: (msg: string) => {
        set({
          message: msg,
        });
      },
      setDoc1: (doc: any) => {
        if (doc) {
          set({
            doc1: doc,
          });
        }
      },
      setDoc2: (doc: any) => {
        set({
          doc2: doc,
        });
      },
      setStandardOptionSelecton: (option: string) => {
        if (get().standardOptionSelected) {
          let optionSelected: string = get().standardOptionSelected as any;
          set({
            standardOptionSelected: option,
            standardOptions: {
              ...get().standardOptions,
              [option]: true,
              [optionSelected]: false,
            },
          });
        } else {
          set({
            standardOptionSelected: option,
            standardOptions: {
              ...get().standardOptions,
              [option]: true,
            },
          });
        }
      },
      setCustomOptionSelected: (option: string) => {
        if (get().customOptionSelected) {
          let optionSelected: string = get().customOptionSelected as any;
          set({
            customOptionSelected: option,
            customOptions: {
              ...get().customOptions,
              [option]: true,
              [optionSelected]: false,
            },
          });
        } else {
          set({
            customOptionSelected: option,
            customOptions: {
              ...get().customOptions,
              [option]: true,
            },
          });
        }
      },
      setSchoolHasDoc1: (flag: boolean) => {
        set({
          schoolHasDoc1: flag,
        });
      },
      setSchoolHasDoc2: (flag: boolean) => {
        set({
          schoolHasDoc2: flag,
        }); 
      },
    }),
    { name: "Accessibility Store" }
  )
);

export const useWebCamStore = create<WebCamStore>()(
  devtools(
    (set, get) => ({
      stream: undefined,
      isWebCamActive: false,
      initWebCam: async () => {
        set({
          stream: undefined,
          isWebCamActive: false,
        });
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
        if (get().isWebCamActive && get().stream) {
          get()
            .stream?.getTracks()
            .forEach((tracks) => {
              tracks.stop();
            });
          set({ stream: undefined, isWebCamActive: false });
        }
      },
      setStream: (mediaStream: any) => {
        if (!get().stream) {
          set({
            stream: mediaStream,
            isWebCamActive: mediaStream.active,
          });
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
      setQuizAuthObj: (data: any) =>
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
