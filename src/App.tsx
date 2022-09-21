import React, { useEffect } from "react";
// import "./App.css";

import axios from "axios";
import DummyPage from "./dummyPage";

import Quizzes from "./quizzes";
import InstructorMenu from "./instructorMenu";

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

  let [proctoringProps, setProctoringProps] = React.useState<Object | null>(
    null
  );
  // let proctoringProps= {userId: id as string, configId: userSettings.idLtiCanvasConfig as string}

  const userName = "ca6a42188e970ab77fab0e34";
  const password = "e5aa447e19ee4180b5ba1364";

  const getEndPoints = async () => {
    let response = await axios.get("https://examd.us/cdn/urls/xproctor/1");
    if (response.data) {
      setEndPoints(response.data);
      authenticateUser(response.data.auth_url as string);
    }
  };

  const authenticateUser = async (url: string) => {
    let response = await axios.post(url, {
      username: userName,
      password: password,
    });
    // .then((res) => {
    //   window.ExamdAutoProctorJS.authToken = res.data.access_token;
    // })
    // .catch((err) => {
    //   console.log(err);
    // });

    if (response.data) {
      setAuthData(response);
    }
  };

  const setUserRoleById = async (studId: string) => {
    let role: string = "student";

    let response: any = await axios.get(
      `https://examd-dev.uc.r.appspot.com/student/api/v1/fetchCanvasEnrollmentsByCourseId/${courseId}/${studId}`,
      {
        headers: {
          Authorization: `Bearer ${authData.data.access_token}`,
        },
      }
    );

    if (response.data.length > 0) {
      let data = response.data[0];
      role = data.role;
      if (role === "StudentEnrollment") {
        setLoadFlag("N");
        // setLoadFlag("Y");
      } else {
        setLoadFlag("Y");
      }
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
    let quizId = url.searchParams.get("quizId");
    let newTab = url.searchParams.get("newTab");
    let isAuthed = url.searchParams.get("auth");

    //Test params
    let studentId = "41";

    //Instructor -> set student 42; student -> set student 1/ 41
    let loginId = "ncghosh@gmail.com";
    let courseId = "23";
    let userId = "12";
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
    setId(getUuid(userId));
    // setId(getUuid("1470923eea43f6bcab4326fee7047884cf84f374"));
    setCourseId(courseId as string);

    console.log(
      `userId=${userId}, courseId=${courseId}, auth=${
        authData ? "true" : "false"
      }, toolConsumerGuid=${toolConsumerGuid}, studentId=${studentId}, courseId=${courseId}`
    );
  };

  useEffect(() => {
    getEndPoints();
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
        username={userName}
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
