import axios from "axios";
import React, { useEffect } from "react";
import $ from "jquery";
import { useStudentStore } from "./store/globalStore";
import { userAuthenticationStore } from "./store/autheticationStore";
import { useAssignmentStore } from "./store/StudentDashboardStore";
import { useAppStore } from "./store/AppSotre";
import Layout from "./StudentDashboard/Dashboard/Layout/Layout";

import {
  fetchCanvasEnrollmentsByCourseId,
  saveLtiStudentProfile,
  getLtiCanvasConfigByAssignment,
  getCanvasAssignmentDetails,
} from "./apiConfigs";

interface Props {
  courseId: string;
  authToken: string;
  student: any;
  pass: string;
  id: string;
  toolConsumerGuid: string;
  assignmentId: string;
  isNewTab: boolean;
  isAuthed: boolean;
  studentId: string;
  accountId: string;
  invokeUrl: string;
}

const Quzzies: React.FC<Props> = (props) => {
  let [assignments, setAssignments] = React.useState<Object[] | null>(null);
  let [quizConfig, setQuizConfig] = React.useState<any>(null);
  let [selectedAssignment, setSelectedAssignment] = React.useState<any>(null);
  let [quizObj, setQuizObj] = React.useState<Object | any>({});
  let [modalComponent, setModalComponent] = React.useState<any>(null);
  let [showOptionModal, setOptionModal] = React.useState<boolean>(false);
  let [modalTitle, setModalTitle] = React.useState<any>(null);
  let [showScheduler, setShowScheduler] = React.useState<boolean>(false);
  let [studentAuthed, setStudentAuthed] = React.useState<boolean>(false);
  let [showAuthModal, setShowAuthModal] = React.useState<boolean>(false);
  let [sebDownloadLink, setDownloadLink] = React.useState<string>(
    "https://storage.googleapis.com/exsebstore/SEB_3.3.2.413_SetupBundle.exe"
  );
  let [closeStream, setCloseStream] = React.useState<boolean>(false);
  let [disableDeSelect, setDisableDeSelect] = React.useState<boolean>(false);
  let [showLDBDwnldOption, setShowLDBDwnldOption] =
    React.useState<boolean>(false);
  let [showHelpModal, setShowHelpModal] = React.useState<boolean>(false);
  let [showUpdateProfileModal, setShowUpdateProfileModal] =
    React.useState<boolean>(false);
  let setQuizAuthObj = useStudentStore((state) => state.setQuizAuthObj);
  let studentQuizAuthObject = useStudentStore(
    (state) => state.studentQuizAuthObject
  );
  const urlParamsData = useAppStore((state) => state.urlParamsData);
  const tokenData = useAppStore((state) => state.tokenData);
  const setAllAssignments = useAssignmentStore((state) => state.setAssignments);
  const setSelectedAssgn = useAssignmentStore(
    (state) => state.setSelectedAssignment
  );
  const setStudentAuthStatus = useAssignmentStore(
    (state) => state.setStudentAuthed
  );
  const setAssignmentsConfigurtion = useAssignmentStore(
    (state) => state.setAssignmentConfiguration
  );
  let [isAssignmentProctored, setIsAssignmentProctored] =
    React.useState<boolean>(false);

  const updateUsersDetails = async () => {
    let students: Object[] = [];
    let response: any = await axios.get(
      `${fetchCanvasEnrollmentsByCourseId}${urlParamsData.courseId}/${urlParamsData.studentId}/${tokenData.lmsAccessToken}/${tokenData.instituteId}`
    );

    response.data.forEach((item: any) => {
      let userObj: any = {
        idLtiStudentProfile: "",
        guid: props.toolConsumerGuid,
        idUser: "",
        firstName: "",
        lastName: "",
        email: "",
        status: 0,
        createUser: "",
        createDate: new Date().getTime(),
        modifyUser: "",
        modifyDate: "",
      };
      let name = item.user.name.split(" ");
      userObj["idUser"] = item.user.id;
      userObj["firstName"] = name[0];
      userObj["lastName"] = name.length === 2 ? name[1] : "";
      userObj["createUser"] = item.user.name;
      students.push(userObj);
    });

    let stuSaveResponse = await axios.post(saveLtiStudentProfile, students, {
      headers: {
        Authorization: `Bearer ${props.authToken}`,
      },
    });
  };

  useEffect(() => {
    updateUsersDetails();
  }, [
    urlParamsData.courseId,
    urlParamsData.studentId,
    tokenData.lmsAccessToken,
    tokenData.instituteId,
  ]);

  useEffect(() => {
    localStorage.removeItem("tabClose");
    $(document).bind("keyup keydown", function (e) {
      if (e.ctrlKey && e.keyCode == 80) {
        return false;
      }
    });

    if (urlParamsData.isAuthed) {
      setStudentAuthed(true);
    }

    axios
      .get(
        `${getCanvasAssignmentDetails}/${tokenData.instituteId}/${urlParamsData.guid}/${urlParamsData.courseId}/${tokenData.lmsAccessToken}`
      )
      .then((res) => {
        if (res.data.length === 0) {
          return;
        }
        let temp: any = {};
        let assignments: any = null;
        if (urlParamsData.assignmentId) {
          let x = { [urlParamsData.assignmentId]: true };
          setQuizObj(x);
          let assignment = res.data.find((item: any) => {
            if ("name" in item) {
              return item.id === parseInt(urlParamsData.assignmentId as any);
            }
          });
          setAllAssignments([assignment]);
          setAssignments(assignment);
          setSelectedAssgn({
            ...assignment,
          });
          if (urlParamsData.isAuthed) {
            setStudentAuthStatus();
          }
        } else {
          assignments = res.data.filter((item: any) => {
            if ("name" in item) {
              temp[item.id] = false;
              return item;
            }
          });
          setAllAssignments(assignments);
          setAssignments(assignments);
          setQuizObj(temp);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    if (urlParamsData.assignmentId !== "") {
      getQuizConfigs(urlParamsData.assignmentId as string);
    }

    if (urlParamsData.newTab) {
      setDisableDeSelect(true);
    }

    if (
      navigator.platform.includes("Mac") ||
      navigator.platform.includes("mac")
    ) {
      setDownloadLink(
        "https://storage.googleapis.com/exsebstore/SafeExamBrowser-3.0.dmg"
      );
    }
    return () => {
      if (urlParamsData.newTab) {
        localStorage.removeItem("quiz");
      }
    };
  }, []);

  const getQuizConfigs = async (assignmentId: string) => {
    try {
      let response = await axios.get(
        `${getLtiCanvasConfigByAssignment}/${assignmentId}`
      );

      if (response.data) {
        setAssignmentsConfigurtion(response.data);
        if (
          response.data.recordAudio ||
          response.data.recordScreen ||
          response.data.recordWebcam
        ) {
          setIsAssignmentProctored(true);
        }
        setQuizConfig(response.data);
        if (response.data.lockdownBrowser) {
          setShowLDBDwnldOption(true);
          setIsAssignmentProctored(true);
        } else {
          setShowLDBDwnldOption(false);
        }
      }
    } catch (err) {
      setIsAssignmentProctored(false);
    }
  };

  useEffect(() => {
    if (selectedAssignment) {
      let authObj = [...studentQuizAuthObject];
      authObj.forEach((item) => {
        if (item.quizId === selectedAssignment.id) {
          if (item.studentAuthState) {
            setStudentAuthed(true);
          } else {
            setStudentAuthed(false);
          }
        }
      });
    }
  }, [studentQuizAuthObject]);

  const checkStoreForRecord = (quiz: {
    [key: string]: string | number;
  }): boolean => {
    let authObj = [...studentQuizAuthObject];
    let res: boolean = false;
    authObj.forEach((item) => {
      if (item.quizId === quiz.id) {
        if (item.studentAuthState) {
          setStudentAuthed(true);
        } else {
          setStudentAuthed(false);
        }
        res = true;
        return;
      }
    });
    return res;
  };

  if (assignments) {
    return <Layout />;
  } else {
    return (
      <div className="flex flex-row h-screen w-full gap-4 items-center justify-center">
        {urlParamsData.newTab ? (
          <p className="text-center text-lg">
            Setting up proctoring. Please wait...
          </p>
        ) : (
          <p className="text-center text-lg">Fetching assignments...</p>
        )}
        <div role="status">
          <svg
            className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-green-500 "
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
};

export default Quzzies;
