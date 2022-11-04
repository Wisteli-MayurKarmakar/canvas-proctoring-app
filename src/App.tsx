import React, { useEffect } from "react";
import axios from "axios";
import DummyPage from "./dummyPage";
import Quizzes from "./quizzes";
import InstructorMenu from "./instructorMenu";
import { userAuthenticationStore } from "./store/autheticationStore";
import { useAppStore } from "./store/AppSotre";
import { useCommonStudentDashboardStore } from "./store/StudentDashboardStore";

import {
  getEndPoints as getEndPointsUrl,
  fetchCanvasEnrollmentsByCourseId,
  getCanvasTokenUrl,
} from "./apiConfigs";

const getUuid = require("uuid-by-string");

declare global {
  interface Window {
    $?: any;
    ExamdAutoProctorJS: any;
  }
}

function App() {
  let [id, setId] = React.useState<any>(null);
  let [courseId, setCourseId] = React.useState<any>(null);
  let [loadFlag, setLoadFlag] = React.useState<any>(null);
  let [authed, setAuthed] = React.useState<boolean>(false);
  let [authData, setAuthData] = React.useState<any>(null);
  let [endPoints, setEndPoints] = React.useState<any>(null);
  let [toolConsumerGuid, setToolConsumerGuid] = React.useState<any>(null);
  let [assignmentId, setAssignmentId] = React.useState<any>(null);
  let [isNewTab, setIsNewTab] = React.useState<any>(false);
  let [loginId, setLoginId] = React.useState<any>(null);
  let [studentId, setStudentId] = React.useState<any>(null);
  let [accountId, setAccountId] = React.useState<any>(null);
  let [student, setStudent] = React.useState<any>(null);
  let [invokeUrl, setInvokeUrl] = React.useState<any>(null);
  let [proctoringProps, setProctoringProps] = React.useState<Object | null>(
    null
  );
  const setEnrollments = useCommonStudentDashboardStore(
    (state) => state.setEnrollments
  );
  const setUrlParamsData = useAppStore((state) => state.setUrlParamsData);
  const setAuthenticationData = userAuthenticationStore(
    (state) => state.setAuthenticationData
  );
  const setTokenData = useAppStore((state) => state.setTokenData);

  let userName = "ca6a42188e970ab77fab0e34";
  let password = "e5aa447e19ee4180b5ba1364";

  if (process.env.NODE_ENV === "production") {
    userName = "surabhi";
    password = "Surabhi@890";
  }

  const setUserRoleById = async (studId: string) => {
    let role: string = "student";
    try {
      let response: any = await axios.get(
        `${fetchCanvasEnrollmentsByCourseId}${courseId}/${studId}/${authData.data.access_token}/${authData.data.instituteId}`
      );
      if (response.status === 200) {
        if (response.data.length > 0) {
          let data = response.data[0];
          setStudent(data);
          setEnrollments(data);
          role = data.role;
          if (role === "StudentEnrollment") {
            setLoadFlag("N");
            // setLoadFlag("Y");
          } else {
            // setLoadFlag("N");
            setLoadFlag("Y");
          }
        }
      } else {
        setLoadFlag("N");
      }
    } catch (err) {
      setLoadFlag("N");
    }
  };

  useEffect(() => {
    if (authData && studentId) {
      setUserRoleById(studentId);
    }
  }, [authData, studentId, courseId]);

  const setUserId = async () => {
    let url_string = window.location.href;
    let url = new URL(url_string);
    // let userId = url.searchParams.get("userId");
    // let courseId = url.searchParams.get("courseId");
    // let toolConsumerGuid = url.searchParams.get("toolConsumerGuid");
    // let loginId = url.searchParams.get("loginId");
    // let studentId = url.searchParams.get("studentId");
    let accId = url.searchParams.get("accoundId");
    let assignmentId = url.searchParams.get("assignmentId");
    let newTab = url.searchParams.get("newTab");
    let isAuthed = url.searchParams.get("auth");
    // let invokeUrl = url.searchParams.get("invokeUrl");

    // Test params
    let studentId = "1";

    // Instructor -> set student 42; student -> set student 1/ 41
    let loginId = "ncghosh@gmail.com";
    // let courseId = "23";
    // let quizId = "67";
    let courseId = "24";
    let userId = "1";
    let toolConsumerGuid = "Examd";
    let invokeUrl: string =
      "https://canvas.examd.online/courses/16/external_content/success/external_tool_redirect";

    if (!accId) {
      accId = "1";
    }

    if (studentId) {
      setStudentId(studentId);
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

    let data = {
      courseId: courseId,
      userId: userId,
      studentId: studentId,
      accountId: accId,
      guid: toolConsumerGuid,
      invokeUrl: invokeUrl,
      isAuthed: isAuthed ? true : false,
      assignmentId: assignmentId,
      newTab: newTab ? true : false,
      loginId: loginId,
    };

    setUrlParamsData({
      ...data,
    } as any);

    console.log(
      `userId=${userId}, courseId=${courseId}, auth=${
        authData ? "true" : "false"
      }, toolConsumerGuid=${toolConsumerGuid}, studentId=${studentId}, assignmentId=${assignmentId}, invokeUrl=${invokeUrl}`
    );

    setInvokeUrl(invokeUrl);
    setId(userId);
    setAccountId(accId);
    setToolConsumerGuid(toolConsumerGuid);
    setLoginId(loginId);
    setId(getUuid(userId));
    // setId(getUuid("1470923eea43f6bcab4326fee7047884cf84f374"));
    setCourseId(courseId as string);
  };

  const getCanvasToken = async () => {
    if (!invokeUrl) {
      return;
    }

    let url = new URL(invokeUrl);
    let invokeUrlOrigin: string = url.origin;

    let data = new FormData();
    data.append("invokeUrl", invokeUrlOrigin);
    let response = await axios.post(getCanvasTokenUrl, data);

    if (response.status === 200) {
      let authData: { [key: string]: string } = { ...response.data };
      authData["access_token"] = response.data.lmsAccessToken;
      response.data = { ...authData };
      setAuthData(response);
      setAuthenticationData(response.data);
      setTokenData(response.data);
    }
  };

  useEffect(() => {
    getCanvasToken();
    setUserId();
  }, [invokeUrl]);

  if (
    loadFlag === "Y" &&
    authData &&
    id &&
    toolConsumerGuid &&
    studentId &&
    invokeUrl &&
    accountId
  ) {
    return (
      <InstructorMenu
        auth={authData}
        emailAsId={id}
        id={id}
        courseId={courseId}
        toolConsumerGuid={toolConsumerGuid}
        studentId={studentId}
        invokeUrl={invokeUrl}
        accountId={accountId}
      />
    );
  } else if (
    loadFlag === "N" &&
    authData &&
    id &&
    courseId &&
    toolConsumerGuid &&
    studentId &&
    accountId &&
    invokeUrl
  ) {
    return (
      <Quizzes
        courseId={courseId}
        authToken={authData.data.access_token}
        student={student}
        assignmentId={assignmentId}
        pass={password}
        id={id}
        isNewTab={isNewTab}
        toolConsumerGuid={toolConsumerGuid}
        procData={proctoringProps}
        isAuthed={authed}
        studentId={studentId}
        accountId={accountId}
        invokeUrl={invokeUrl}
      />
    );
  } else {
    return <DummyPage />;
  }
}

export default App;
