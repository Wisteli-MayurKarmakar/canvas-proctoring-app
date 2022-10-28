import create from "zustand";
import { devtools } from "zustand/middleware";
const getUuid = require("uuid-by-string");

type AuthenticationData = {
  instituteId?: string;
  invokeUrl?: string;
  launchUrl?: string;
  lmsAccessToken?: string;
  lmsAccessurl?: string;
  lmsName?: string;
  status?: number;
};

type URLParamsData = {
  courseId?: string;
  userId?: string;
  studentId?: string;
  accountId?: string;
  guid?: string;
  invokeUrl?: string;
  isAuthed?: boolean;
  assignmentId?: string;
  newTab?: boolean;
  loginId?: string;
};

type AppStore = {
  loadPage?: string;
  urlParamsData: {
    courseId?: string;
    quizId?: string;
    userId?: string;
    studentId?: string;
    accountId?: string;
    guid?: string;
    invokeUrl?: string;
    isAuthed?: boolean;
    assignmentId?: string;
    newTab?: boolean;
    loginId?: string;
  };
  tokenData: {
    instituteId?: string;
    invokeUrl?: string;
    launchUrl?: string;
    lmsAccessToken?: string;
    lmsAccessurl?: string;
    lmsName?: string;
    status?: number;
    access_token?: string;
  };
  setTokenData: (data: AuthenticationData) => void;
  setUrlParamsData: (data: URLParamsData) => void;
};

export const useAppStore = create<AppStore>()(
  devtools(
    (set) => ({
      urlParamsData: {},
      tokenData: {},
      setTokenData: (data) => {
        set({
          tokenData: { ...data },
        });
      },
      setUrlParamsData: (data) => {
        if (data.userId) {
          let useUUID: string = getUuid(data.userId);
          data.userId = useUUID;
          set({
            urlParamsData: { ...data },
          });
        }
      },
    }),
    { name: "AppStore" }
  )
);
