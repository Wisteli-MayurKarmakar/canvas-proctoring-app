import axios from "axios";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { fetchCanvasCourseDetailsByCourseId } from "../apiConfigs";
import { CourseDetails } from "../AppTypes";
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
  setTokenData: (data: AuthenticationData) => void;
  setUrlParamsData: (data: URLParamsData) => void;
};

const getCourseDetails = async (token: string, instituteId: string): Promise<CourseDetails | null> => {
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

export const useAppStore = create<AppStore>()(
  devtools(
    (set) => ({
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
        let courseDetails: CourseDetails | null = await getCourseDetails(data.lmsAccessToken as string, data.instituteId as string);
        if (courseDetails) {
          set({
            courseDetails: courseDetails,
          });
        }
      },
      setUrlParamsData: (data: any) => {
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
        }
      },
    }),
    { name: "AppStore" }
  )
);
