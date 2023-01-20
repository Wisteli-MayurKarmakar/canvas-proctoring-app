import axios from "axios";
import create from "zustand";
import { devtools } from "zustand/middleware";
import {
  fetchCanvasCourseDetailsByCourseId,
  getLtiAccessByGuid,
} from "../apiConfigs";
import { AccessDetails, CourseDetails } from "../AppTypes";
const getUuid = require("uuid-by-string");

type AuthenticationData = {
  instituteId: string | null;
  invokeUrl: string | null;
  launchUrl: string | null;
  lmsAccessToken: string | null;
  lmsAccessurl: string | null;
  lmsName: string | null;
  status: number | null;
};

type URLParamsData = {
  courseId: string | null;
  userId: string | null;
  studentId: string | null;
  accountId: string | null;
  guid: string | null;
  invokeUrl: string | null;
  isAuthed: boolean;
  assignmentId: string | null;
  newTab: boolean;
  loginId: string | null;
  quizId: string | null;
};

type AppStore = {
  loadPage?: string;
  urlParamsData: URLParamsData;
  tokenData: AuthenticationData;
  courseDetails: CourseDetails;
  canAccessApp: boolean;
  userAccessDetails?: AccessDetails;
  isNotAllowed: boolean;
  isAdmin: boolean;
  accessRecords?: AccessDetails[];
  setTokenData: (data: AuthenticationData) => void;
  setUrlParamsData: (data: URLParamsData) => void;
};

const getCourseDetails = async (
  token: string,
  instituteId: string
): Promise<CourseDetails | null> => {
  const { courseId } = useAppStore.getState().urlParamsData;
  // const { lmsAccessToken, instituteId } = useAppStore.getState().tokenData;
  let response = await axios.get(
    `${fetchCanvasCourseDetailsByCourseId}/${courseId}/${token}/${instituteId}`
  );
  if (response.status === 200) {
    return response.data[0];
  }
  return null;
};

export const getAccessRecordsByGuid = async (
  guid: string
): Promise<AccessDetails[]> => {
  try {
    let response = await axios.get(`${getLtiAccessByGuid}/${guid}`);

    if (response.status === 200) {
      return response.data;
    }
  } catch (err) {
    return [];
  }
  return [];
};

export const useAppStore = create<AppStore>()(
  devtools(
    (set) => ({
      canAccessApp: false,
      urlParamsData: {
        courseId: null,
        quizId: null,
        userId: null,
        studentId: null,
        accountId: null,
        guid: null,
        invokeUrl: null,
        isAuthed: false,
        assignmentId: null,
        newTab: false,
        loginId: null,
      },
      courseDetails: {
        account_id: "",
        id: "",
        name: "",
        start_at: "",
        uuid: "",
      },
      isAdmin: false,
      isNotAllowed: false,
      tokenData: {
        instituteId: null,
        invokeUrl: null,
        launchUrl: null,
        lmsAccessToken: null,
        lmsAccessurl: null,
        lmsName: null,
        status: null,
      },
      setTokenData: async (data: AuthenticationData) => {
        set({
          tokenData: { ...data },
        });
        let courseDetails: CourseDetails | null = await getCourseDetails(
          data.lmsAccessToken as string,
          data.instituteId as string
        );
        if (courseDetails) {
          set({
            courseDetails: courseDetails,
          });
        }
      },
      setUrlParamsData: async (data: any) => {
        if (data.userId) {
          let useUUID: string = getUuid(data.userId);
          data.userId = useUUID;
          set({
            urlParamsData: {
              courseId: data.courseId,
              quizId: data.quizId,
              userId: data.userId,
              studentId: data.studentId,
              accountId: data.accountId,
              guid: data.guid,
              invokeUrl: data.invokeUrl,
              isAuthed: data.isAuthed,
              assignmentId: data.assignmentId,
              newTab: data.newTab,
              loginId: data.loginId,
            },
          });

          let response = await getAccessRecordsByGuid(data.guid);
          response.forEach((item: AccessDetails) => {
            if (item.userId === data.studentId) {
              let notAllowed: boolean = false;
              if (
                !item.aiQuiz &&
                !item.aiWithReport &&
                !item.lockdownBrowser &&
                !item.liveProctor &&
                !item.liveLaunch
              ) {
                notAllowed = true;
              }
              if (item.accessType === "ADMIN") {
                set({
                  isAdmin: true,
                  userAccessDetails: item,
                  isNotAllowed: notAllowed,
                  canAccessApp: true,
                });
              } else {
                set({
                  isAdmin: false,
                  userAccessDetails: item,
                  isNotAllowed: notAllowed,
                  canAccessApp: item.aiQuiz === "Y" ? true : false,
                });
              }
            }
          });
          set({
            accessRecords: response,
          });
        }
      },
    }),
    { name: "AppStore" }
  )
);
