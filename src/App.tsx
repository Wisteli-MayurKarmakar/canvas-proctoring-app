import React, { useEffect } from "react";
// import "./App.css";

import axios from "axios";
import DummyPage from "./dummyPage";

import Quizzes from "./quizzes";
import InstructorMenu from "./instructorMenu";
// import emailjs from "@emailjs/browser";

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
  const [quizId, setQuizId] = React.useState<any>(null);
  const [isNewTab, setIsNewTab] = React.useState<any>(false);
  let [loginId, setLoginId] = React.useState<any>(null);
  let [studentId, setStudentId] = React.useState<any>(null);
  let [accountId, setAccountId] = React.useState<any>(null);
  let [student, setStudent] = React.useState<any>(null);
  let [proctoringProps, setProctoringProps] = React.useState<Object | null>(
    null
  );

  let userName = "ca6a42188e970ab77fab0e34";
  let password = "e5aa447e19ee4180b5ba1364";

  if (process.env.NODE_ENV === "production") {
    userName = "surabhi";
    password = "Surabhi@890";
  }

  // const getEndPoints = async () => {
  //   let response = await axios.get(getEndPointsUrl);
  //   if (response.data) {
  //     setEndPoints(response.data);
  //     authenticateUser(response.data.auth_url as string);
  //   }
  // };

  // const authenticateUser = async (url: string) => {
  //   let response = await axios.post(url, {
  //     username: userName,
  //     password: password,
  //   });

  //   if (response.data) {
  //     setAuthData(response);
  //   }
  // };

  const setUserRoleById = async (studId: string) => {
    let role: string = "student";
    try {
      let response: any = await axios.get(
        `${fetchCanvasEnrollmentsByCourseId}${courseId}/${studId}/${authData.data.access_token}`
      );
      if (response.status === 200) {
        if (response.data.length > 0) {
          let data = response.data[0];
          setStudent(data);
          role = data.role;
          if (role === "StudentEnrollment") {
            setLoadFlag("N");
            // setLoadFlag("Y");
          } else {
            setLoadFlag("Y");
          }
        }
      } else {
        console.log("here");
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
    // let quizId = url.searchParams.get("quizId");
    let newTab = url.searchParams.get("newTab");
    let isAuthed = url.searchParams.get("auth");

    // Test params
    let studentId = "1";

    // Instructor -> set student 42; student -> set student 1/ 41
    let loginId = "ncghosh@gmail.com";
    // let courseId = "23";
    let quizId = "35";
    let courseId = "16";
    let userId = "1";
    let toolConsumerGuid = "Examd";

    if (!accId) {
      accId = "1";
    }

    if (studentId) {
      setStudentId(studentId);
    }

    if (isAuthed === "1") {
      setAuthed(true);
    }

    if (quizId) {
      setQuizId(quizId);
    }

    if (newTab === "true") {
      setIsNewTab(true);
    }

    setId(userId);
    setAccountId(accId);
    setToolConsumerGuid(toolConsumerGuid);
    setLoginId(loginId);
    // setId(getUuid(userId));
    setId(getUuid("1470923eea43f6bcab4326fee7047884cf84f374"));
    setCourseId(courseId as string);

    console.log(
      `userId=${userId}, courseId=${courseId}, auth=${
        authData ? "true" : "false"
      }, toolConsumerGuid=${toolConsumerGuid}, studentId=${studentId}, courseId=${courseId}`
    );
  };

  const getCanvasToken = async () => {
    let origin: string = window.location.origin;

    if (origin === "http://192.64.80.61:3000") {
      origin += "/";
    } else if (origin === "http://localhost:3000") {
      origin = "https://canvas.examd.online";
    }

    let data = new FormData();
    data.append("invokeUrl", origin);
    let response = await axios.post(getCanvasTokenUrl, data);

    if (response.status === 200) {
      let authData: { [key: string]: string } = { ...response.data };
      authData["access_token"] = response.data.lmsAccessToken;
      response.data = { ...authData };
      setAuthData(response);
    }
  };

  useEffect(() => {
    // getEndPoints();
    getCanvasToken();
    setUserId();
  }, []);

  if (loadFlag === "Y" && authData && id && toolConsumerGuid && studentId) {
    return (
      <InstructorMenu
        auth={authData}
        emailAsId={id}
        id={id}
        courseId={courseId}
        toolConsumerGuid={toolConsumerGuid}
        studentId={studentId}
      />
    );
  } else if (
    loadFlag === "N" &&
    authData &&
    id &&
    courseId &&
    toolConsumerGuid &&
    studentId &&
    accountId
  ) {
    return (
      <Quizzes
        courseId={courseId}
        authToken={authData.data.access_token}
        student={student}
        quizId={quizId}
        pass={password}
        id={id}
        isNewTab={isNewTab}
        toolConsumerGuid={toolConsumerGuid}
        procData={proctoringProps}
        isAuthed={authed}
        studentId={studentId}
        accountId={accountId}
      />
    );
  } else {
    return <DummyPage />;
  }
}

export default App;
