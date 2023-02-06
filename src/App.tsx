import React, { useEffect, lazy, Suspense } from "react";
import axios from "axios";
import DummyPage from "./dummyPage";
import "antd/dist/antd.css"
// import Quizzes from "./quizzes";
// import InstructorMenu from "./instructorMenu";
import { useAppStore } from "./store/AppSotre";
import { useCommonStudentDashboardStore } from "./store/StudentDashboardStore";

import {
  fetchCanvasEnrollmentsByCourseId,
  getCanvasTokenUrl,
} from "./apiConfigs";
import UnauthorizedAccessPage from "./CommonUtilites/UnauthorizedAccessPage";

const getUuid = require("uuid-by-string");

declare global {
  interface Window {
    $?: any;
    ExamdAutoProctorJS: any;
  }
}

function App() {
  let [authed, setAuthed] = React.useState<boolean>(false);
  let [assignmentId, setAssignmentId] = React.useState<any>(null);
  let [isNewTab, setIsNewTab] = React.useState<any>(false);
  let [student, setStudent] = React.useState<any>(null);
  const { urlParamsData, tokenData } = useAppStore((state) => state);
  const studentDashboardStore = useCommonStudentDashboardStore(
    (state) => state
  );
  const InstructorDashboard = lazy(() => import("./instructorMenu"));
  const StudentDashboard = lazy(() => import("./quizzes"));
  const { setLoggedInUserEnrollmentType, setEnrollments } =
    useCommonStudentDashboardStore((state) => state);
  const { setUrlParamsData, setTokenData, canAccessApp, getAccessRecords } =
    useAppStore((state) => state);

  let userName = "ca6a42188e970ab77fab0e34";
  let password = "e5aa447e19ee4180b5ba1364";

  if (process.env.NODE_ENV === "production") {
    userName = "surabhi";
    password = "Surabhi@890";
  }

  const setUserRoleById = async () => {
    let role: string = "student";
    let response: any = await axios.get(
      `${fetchCanvasEnrollmentsByCourseId}${urlParamsData.courseId}/${urlParamsData.studentId}/${tokenData.lmsAccessToken}/${tokenData.instituteId}`
    );
    if (response.status === 200) {
      if (response.data.length > 0) {
        let data = response.data[0];
        setStudent(data);
        setEnrollments(data);
        role = data.role;
        setLoggedInUserEnrollmentType(role);
      }
    }
  };

  useEffect(() => {
    if (
      tokenData.lmsAccessToken &&
      tokenData.instituteId &&
      urlParamsData.studentId &&
      urlParamsData.courseId
    ) {
      setUserRoleById();
    }
  }, [tokenData, urlParamsData]);

  const setUserId = async () => {
    let url_string = window.location.href;
    let url = new URL(url_string);
    let userId = url.searchParams.get("userId");
    let courseId = url.searchParams.get("courseId");
    let toolConsumerGuid = url.searchParams.get("toolConsumerGuid");
    let loginId = url.searchParams.get("loginId");
    let studentId = url.searchParams.get("studentId");
    let invokeUrl = url.searchParams.get("invokeUrl");
    let assignmentId: string | null = url.searchParams.get("assignmentId");
    let accId = url.searchParams.get("accoundId");
    let newTab = url.searchParams.get("newTab");
    let isAuthed = url.searchParams.get("auth");
    let guid: string = "";

    if (!accId) {
      accId = "1";
    }

    if (isAuthed === "1") {
      setAuthed(true);
    }

    if (assignmentId) {
      setAssignmentId(assignmentId);
    }

    if (newTab === "true") {
      setIsNewTab(true);
    }

    if (invokeUrl) {
      guid = new URL(invokeUrl).origin.split("//")[1];
    }
    let data = {
      courseId: !courseId ? null : courseId,
      userId: !userId ? null : userId,
      studentId: !studentId ? null : studentId,
      accountId: !accId ? null : accId,
      guid: guid,
      invokeUrl: !invokeUrl ? null : invokeUrl,
      isAuthed: !isAuthed ? false : true,
      assignmentId:
        assignmentId === "null" || assignmentId === "object"
          ? null
          : assignmentId,
      newTab: !newTab ? false : true,
      loginId: !loginId ? null : loginId,
    };

    setUrlParamsData({
      ...data,
    } as any);

    console.log(
      `userId=${userId}, courseId=${courseId}, toolConsumerGuid=${toolConsumerGuid}, studentId=${studentId}, assignmentId=${assignmentId}, invokeUrl=${invokeUrl}`
    );
  };

  useEffect(() => {
    if (urlParamsData.guid && urlParamsData.studentId) {
      getAccessRecords(urlParamsData.guid, urlParamsData.studentId);
    }
  }, [urlParamsData.guid, urlParamsData.guid]);

  const getCanvasToken = async () => {
    if (!urlParamsData.invokeUrl) {
      return;
    }

    let url = new URL(urlParamsData.invokeUrl);
    let invokeUrlOrigin: string = url.origin;

    let data = new FormData();
    data.append("invokeUrl", invokeUrlOrigin);
    let response = await axios.post(getCanvasTokenUrl, data);

    if (response.status === 200) {
      let authData: { [key: string]: string } = { ...response.data };
      authData["access_token"] = response.data.lmsToken;
      authData["lmsAccessToken"] = response.data.lmsToken;
      response.data = { ...authData };
      setTokenData(response.data);
    }
  };

  useEffect(() => {
    getCanvasToken();
    setUserId();
  }, [urlParamsData.invokeUrl]);

  if (
    tokenData &&
    urlParamsData.userId &&
    urlParamsData.courseId &&
    urlParamsData.guid &&
    urlParamsData.studentId &&
    urlParamsData.accountId &&
    urlParamsData.invokeUrl &&
    tokenData.lmsAccessToken
  ) {
    return (
      <Suspense fallback={<DummyPage />}>
        {studentDashboardStore.loggedInUserEnrollmentType ===
        "TeacherEnrollment" ? (
          canAccessApp ? (
            <InstructorDashboard
              auth={tokenData}
              emailAsId={urlParamsData.userId}
              id={urlParamsData.userId}
              courseId={urlParamsData.courseId}
              toolConsumerGuid={urlParamsData.guid}
              studentId={urlParamsData.studentId}
              invokeUrl={urlParamsData.invokeUrl}
              accountId={urlParamsData.accountId}
            />
          ) : (
            <UnauthorizedAccessPage />
          )
        ) : (
          studentDashboardStore.loggedInUserEnrollmentType ===
            "StudentEnrollment" && (
            <StudentDashboard
              courseId={urlParamsData.courseId}
              authToken={tokenData.lmsAccessToken}
              student={student}
              assignmentId={assignmentId}
              pass={password}
              id={urlParamsData.userId}
              isNewTab={isNewTab}
              toolConsumerGuid={urlParamsData.guid}
              isAuthed={authed}
              studentId={urlParamsData.studentId}
              accountId={urlParamsData.accountId}
              invokeUrl={urlParamsData.invokeUrl}
            />
          )
        )}
      </Suspense>
    );
    // if (
    //   studentDashboardStore.loggedInUserEnrollmentType === "TeacherEnrollment"
    // ) {
    //   if (canAccessApp) {
    //     return (
    //       <InstructorMenu
    //         auth={tokenData}
    //         emailAsId={urlParamsData.userId}
    //         id={urlParamsData.userId}
    //         courseId={urlParamsData.courseId}
    //         toolConsumerGuid={urlParamsData.guid}
    //         studentId={urlParamsData.studentId}
    //         invokeUrl={urlParamsData.invokeUrl}
    //         accountId={urlParamsData.accountId}
    //       />
    //     );
    //   }
    //   return <UnauthorizedAccessPage />;
    // }
    // if (
    //   studentDashboardStore.loggedInUserEnrollmentType === "StudentEnrollment"
    // ) {
    //   return (
    //     <Quizzes
    //       courseId={urlParamsData.courseId}
    //       authToken={tokenData.lmsAccessToken}
    //       student={student}
    //       assignmentId={assignmentId}
    //       pass={password}
    //       id={urlParamsData.userId}
    //       isNewTab={isNewTab}
    //       toolConsumerGuid={urlParamsData.guid}
    //       isAuthed={authed}
    //       studentId={urlParamsData.studentId}
    //       accountId={urlParamsData.accountId}
    //       invokeUrl={urlParamsData.invokeUrl}
    //     />
    //   );
    // }
  }
  return <DummyPage />;
}

export default App;
