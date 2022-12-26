import produce from "immer";
import moment, { Moment } from "moment";
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
  mobility: boolean;
  cognitiveChallange: boolean;
  brailleNeeded: boolean;
  lowVision: boolean;
  hearingImpaired: boolean;
  hhndSignal: boolean;
  ccNeeded: boolean;
  auditoryChallange: boolean;
  tty: boolean;
};

type CustomAccessiblityOptions = {
  facerecognitionIssue: boolean;
  needAbreak: boolean;
  shorttermDisability: boolean;
  idByPass: boolean;
  roomScanIssue: boolean;
  dualMonitorNeeded: boolean;
};

type AccessibilityConfig = {
  accessibilityId: string;
  approveCustom: boolean;
  approveStandard: boolean;
  auditoryChallange: boolean;
  brailleNeeded: boolean;
  ccNeeded: boolean;
  cognitiveChallange: boolean;
  documentCustomref: string;
  documentstandardRef: string;
  endDate: string;
  extratimeRequired: boolean;
  facerecognitionIssue: true;
  hearingImpaired: boolean;
  hhndSignal: boolean;
  humanAssistant: boolean;
  instituteId: number;
  lowVision: boolean;
  minExtra: number;
  mobility: boolean;
  needAbreak: boolean;
  schoolCustom: boolean;
  schoolStandard: boolean;
  shorttermDisability: boolean;
  startDate: string;
  studentId: number;
  studentMessage: string;
  instructorMessage?: string;
  tty: boolean;
};

type AccessibilityStore = {
  doc2?: any;
  doc1?: any;
  schoolStandard: boolean;
  schoolCustom: boolean;
  humanAssistant: boolean;
  standardOptions: StandardAccessiblityOptions;
  approveStandard: boolean;
  approveCustom?: boolean;
  customOptions: CustomAccessiblityOptions;
  standardOptionSelected?: string;
  minExtra: number;
  customOptionSelected?: string;
  messageStudent: string;
  messageInstructor: string;
  startDate: string;
  endDate: string;
  setStandardOptionSelecton: (optionName: string) => void;
  setCustomOptionSelected: (optionName: string) => void;
  setStudentMessage: (message: string) => void;
  setInstructorMessage: (message: string) => void;
  setDoc1: (doc: any) => void;
  setDoc2: (doc: any) => void;
  setHumanAssistantNeeded: () => void;
  setExtraTimeValue: (value: number) => void;
  setStartDate: (date: Moment) => void;
  setEndDate: (date: Moment) => void;
  setApproveStandard: (flag: boolean) => void;
  setApproveCustom: (flag: boolean) => void;
  setAccessibilityConfigurations: (data: AccessibilityConfig) => void;
  setSchoolStandard: (flag: boolean) => void;
  setSchoolCustom: (flag: boolean) => void;
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
      schoolCustom: false,
      schoolStandard: false,
      humanAssistant: false,
      approveStandard: false,
      messageStudent: "",
      messageInstructor: "",
      startDate: moment().toISOString(),
      endDate: moment().toISOString(),
      minExtra: 0,
      standardOptions: {
        mobility: false,
        cognitiveChallange: false,
        brailleNeeded: false,
        lowVision: false,
        hearingImpaired: false,
        hhndSignal: false,
        ccNeeded: false,
        auditoryChallange: false,
        tty: false,
      },
      customOptions: {
        facerecognitionIssue: false,
        needAbreak: false,
        shorttermDisability: false,
        idByPass: false,
        roomScanIssue: false,
        dualMonitorNeeded: false,
      },
      setSchoolCustom: (flag: boolean) => {
        set({
          schoolCustom: flag,
        });
      },
      setSchoolStandard: (flag: boolean) => {
        set({
          schoolStandard: flag,
        });
      },
      setStudentMessage: (msg: string) => {
        set({
          messageStudent: msg,
        });
      },
      setInstructorMessage: (msg: string) => {
        set({
          messageInstructor: msg,
        });
      },
      setStartDate: (date: Moment) => {
        set({
          startDate: date.toISOString(),
        });
      },
      setEndDate: (date: Moment) => {
        set({
          endDate: date.toISOString(),
        });
      },
      setApproveCustom: (flag: boolean) => {
        set({
          approveCustom: flag,
        });
      },
      setApproveStandard: (flag: boolean) => {
        set({
          approveStandard: flag,
        });
      },
      setExtraTimeValue: (value: number) => {
        set({ minExtra: value });
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
      setHumanAssistantNeeded: () => {
        set((state) => ({ humanAssistant: !state.humanAssistant }));
      },
      setStandardOptionSelecton: (option: string) => {
        let standardOptions: StandardAccessiblityOptions = {
          ...get().standardOptions,
        };
        Object.keys(standardOptions).forEach((key: string) => {
          standardOptions[key as keyof StandardAccessiblityOptions] = false;
        });
        standardOptions[option as keyof StandardAccessiblityOptions] = true;
        set({
          standardOptionSelected: option,
          standardOptions: {
            ...standardOptions,
          },
        });
      },
      setCustomOptionSelected: (option: string) => {
        let customOptions: CustomAccessiblityOptions = {
          ...get().customOptions,
        };
        Object.keys(customOptions).forEach((key: string) => {
          customOptions[key as keyof CustomAccessiblityOptions] = false;
        });
        customOptions[option as keyof CustomAccessiblityOptions] = true;
        set({
          customOptionSelected: option,
          customOptions: {
            ...customOptions,
          },
        });
      },
      setAccessibilityConfigurations: (data: AccessibilityConfig) => {
        if (data) {
          let otherOptions: any = {
            schoolHasDoc1: false,
            schoolHasDoc2: false,
            schoolStandard: data.schoolStandard,
            schoolCustom: data.schoolCustom,
            humanAssistant: data.humanAssistant,
            approveCustom: data.approveCustom,
            approveStandard: data.approveStandard,
            messageStudent: data.studentMessage,
            messageInstructor:
              "instructorMessage" in data
                ? (data.instructorMessage as any)
                : "",
            startDate: data.startDate,
            endDate: data.endDate,
            minExtra: data.minExtra,
          };
          let standardOptions: any = {
            mobility: data.mobility,
            cognitiveChallange: data.cognitiveChallange,
            brailleNeeded: data.brailleNeeded,
            lowVision: data.brailleNeeded,
            hearingImpaired: data.hearingImpaired,
            hhndSignal: data.hhndSignal,
            ccNeeded: data.ccNeeded,
            auditoryChallange: data.auditoryChallange,
            tty: data.tty,
          };
          let customOptions: any = {
            facerecognitionIssue: data.facerecognitionIssue,
            needAbreak: data.needAbreak,
            shorttermDisability: data.shorttermDisability,
            idByPass: false,
            roomScanIssue: false,
            dualMonitorNeeded: false,
          };
          Object.keys(standardOptions).forEach((key: any) => {
            if (standardOptions[key]) {
              set({
                standardOptionSelected: key,
              });
            }
          });

          Object.keys(customOptions).forEach((key: any) => {
            if (customOptions[key]) {
              set({
                customOptionSelected: key,
              });
            }
          });
          set({
            customOptions: { ...customOptions },
            standardOptions: { ...standardOptions },
            ...otherOptions,
          });
        }
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
      currentTime: moment(),
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
