import React, { useEffect } from "react";
// import "./App.css";

import axios from "axios";
import DummyPage from "./dummyPage";

import InfoModal from "./infoModal";
import Quizzes from "./quizzes";
import ProctoringExam from "./quizReport";
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
  let [studentId, setStudentId] = React.useState<any>(null);

  let [proctoringProps, setProctoringProps] = React.useState<Object | null>(
    null
  );
  // let proctoringProps= {userId: id as string, configId: userSettings.idLtiCanvasConfig as string}

  const userName = "ca6a42188e970ab77fab0e34";
  const password = "e5aa447e19ee4180b5ba1364";

  const getEndPoints = (): void => {
    axios
      .get("https://examd.us/cdn/urls/xproctor/1")
      .then((res: any) => {
        setEndPoints(res.data);
        authenticateUser(res.data.auth_url as string);
      })
      .catch((err) => {});
  };

  const authenticateUser = (url: string): void => {
    axios
      .post(url, {
        username: userName,
        password: password,
      })
      .then((res) => {
        setAuthData(res);
        // window.ExamdAutoProctorJS.authToken = res.data.access_token;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const setUserId = (): void => {
    let url_string = window.location.href;
    let url = new URL(url_string);
    let loadInstructorPage = url.searchParams.get("loadInstructorPage");
    // let userId = url.searchParams.get("userId");
    // let courseId = url.searchParams.get("courseId");
    // let toolConsumerGuid = url.searchParams.get("toolConsumerGuid");
    // let loginId = url.searchParams.get("loginId");
    // let studentId = url.searchParams.get("studentId");
    let quizId = url.searchParams.get("quizId");
    let newTab = url.searchParams.get("newTab");
    let isAuthed = url.searchParams.get("auth");

    //Test params
    let studentId = "1";
    let loginId = "ncghosh@gmail.com";
    let courseId = "16";
    let userId = "12";
    let toolConsumerGuid = "Examd";
    setId(userId);

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
    setToolConsumerGuid(toolConsumerGuid);
    // setId(loginId);
    // setId(getUuid(userId));
    // setId(getUuid('1470923eea43f6bcab4326fee7047884cf84f374'));
    setCourseId(courseId as string);

    console.log(
      `userId=${userId}, courseId=${courseId}, flag=${loadInstructorPage}, toolConsumerGuid=${toolConsumerGuid}, newTab=${newTab}, isNewTab=${isNewTab}, studentId=${studentId}`
    );

    if (loadInstructorPage === "Y") {
      setLoadFlag("Instructor");
    } else {
      // setLoadFlag("Student");
      setLoadFlag("Instructor");
    }
  };

  useEffect(() => {
    setUserId();
    getEndPoints();
  }, []);

  if (loadFlag === "Instructor" && authData && id && toolConsumerGuid) {
    return (
      <InstructorMenu
        auth={authData}
        emailAsId={id}
        id={id}
        courseId={courseId}
        toolConsumerGuid={toolConsumerGuid}
      />
    );
  } else if (
    loadFlag === "Student" &&
    authData &&
    id &&
    courseId &&
    toolConsumerGuid &&
    studentId
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
      />
    );
  } else {
    return <DummyPage />;
  }
}

export default App;
