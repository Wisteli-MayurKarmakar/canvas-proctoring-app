import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import VideoAndScreenRec from "./videoAndScreenRec";
import $ from "jquery";
import SystemCheck from "./StudentDashboard/Tabs/SystemCheck";
import PrivacyPolicy from "./StudentDashboard/Tabs/PrivacyPolicy";
import ImageMatchAuthentication from "./StudentDashboard/AuthenticationScreens/ImageMatchAuthentication";
import Help from "./StudentDashboard/Tabs/Help";
import UpdateProfile from "./StudentDashboard/Menu/UpdateProfile";
import { Button, Modal, Tooltip } from "antd";
import StudentHelpDocument from "./StudentDashboard/Modals/StudentHelpDocument";
import { useStudentStore } from "./store/globalStore";
import AuthenticationModal from "./StudentDashboard/Modals/AuthenticationModal";
import { css } from "@emotion/react";
//@ts-ignore
import AddToCalendarHOC from "react-add-to-calendar-hoc";

interface Props {
  courseId: string;
  authToken: string;
  username: string;
  pass: string;
  procData: any;
  id: string;
  toolConsumerGuid: string;
  quizId: string;
  isNewTab: boolean;
  isAuthed: boolean;
  studentId: string;
  accountId: string;
}

const Quzzies: React.FC<Props> = (props) => {
  let [quizzes, setQuizzes] = React.useState<Object[] | null>(null);
  let [quizConfig, setQuizConfig] = React.useState<any>(null);
  let [selectedQuiz, setSelectedQuiz] = React.useState<any>(null);
  let [quizObj, setQuizObj] = React.useState<Object | any>({});
  let [modalComponent, setModalComponent] = React.useState<any>(null);
  let [showOptionModal, setOptionModal] = React.useState<boolean>(false);
  let [modalTitle, setModalTitle] = React.useState<any>(null);
  let [studentAuthed, setStudentAuthed] = React.useState<boolean>(false);
  let [showStudentHelpDoc, setShowStudentHelpDoc] =
    React.useState<boolean>(false);
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
  const AddToCalendar = AddToCalendarHOC(Button);

  const startDatetime = moment().utc().add(2, "days");
  const endDatetime = startDatetime.clone().add(2, "hours");
  const duration = moment.duration(endDatetime.diff(startDatetime)).asHours();

  let eventS = {
    description:
      "Description of event. Going to have a lot of fun doing things that we scheduled ahead of time.",
    duration,
    endDatetime: endDatetime.format("YYYYMMDDTHHmmssZ"),
    location: "NYC",
    startDatetime: startDatetime.format("YYYYMMDDTHHmmssZ"),
    title: "Super Fun Event",
  };

  const componentStyles = css`
    width: 100%;
    margin: 0 auto;
    text-align: center;
    padding: 0 0 30px;
    @media (min-width: 768px) {
      width: 50%;
    }
  `;
  const linkStyles = css`
    text-decoration: none;
    display: block;
    color: #e42d2d;
    font-size: 18px;
    text-align: center;
    padding: 6px;
  `;

  let items = [
    { outlook: "Outlook" },
    { outlookcom: "Outlook.com" },
    { apple: "Apple Calendar" },
    { yahoo: "Yahoo" },
    { google: "Google" },
  ];

  let [isQuizProctored, setIsQuizProctored] = React.useState<boolean>(false);

  const updateUsersDetails = async () => {
    let students: Object[] = [];
    let response: any = await axios.get(
      `https://examd.us/student/api/v1/fetchCanvasEnrollmentsByCourseId/${props.courseId}/${props.studentId}`,
      {
        headers: {
          Authorization: `Bearer ${props.authToken}`,
        },
      }
    );

    response.data.forEach((item: any) => {
      let userObj: any = {
        idLtiStudentProfile: "",
        guid: props.toolConsumerGuid,
        idUser: "",
        firstName: "",
        lastName: "",
        email: "",
        // idFileIndex1: "",
        // idFileIndex2: "",
        // idFileName1: "",
        // idFileName2: "",
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

    // students.forEach((student: any) => {
    //   if (student.idUser === props.studentId && !studProfileId) {
    //     setStudProfileId(student.idLtiStudentProfile);
    //   }
    // });

    let stuSaveResponse = await axios.post(
      `https://examd.us/student/api/v1/saveLtiStudentProfile`,
      students,
      {
        headers: {
          Authorization: `Bearer ${props.authToken}`,
        },
      }
    );
  };

  useEffect(() => {
    $(document).bind("keyup keydown", function (e) {
      if (e.ctrlKey && e.keyCode == 80) {
        return false;
      }
    });

    if (props.isAuthed) {
      setStudentAuthed(true);
    }

    axios
      .get(
        `https://examd-dev.uc.r.appspot.com/student/api/v1/fetchCanvasQuizzesByCourseId/${props.courseId}`,
        {
          headers: {
            Authorization: `Bearer ${props.authToken}`,
          },
        }
      )
      .then((res) => {
        let temp: any = {};
        res.data.forEach((item: any) => {
          temp[item.id] = false;
        });
        setQuizzes(res.data);
        setQuizObj(temp);
        if (props.quizId) {
          let x = { [props.quizId]: true };
          setQuizObj(x);
          setSelectedQuiz(
            res.data.find((item: any) => item.id === props.quizId)
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
    if (props.isNewTab) {
      getQuizConfigs(props.quizId);
    }
    updateUsersDetails();
    if (props.isNewTab) {
      setDisableDeSelect(true);
    }
    let nav: any = navigator;
    if (nav.userAgentData.platform !== "Windows") {
      setDownloadLink(
        "https://storage.googleapis.com/exsebstore/SafeExamBrowser-3.0.dmg"
      );
    }
  }, []);

  const getQuizConfigs = async (quizId: string) => {
    let response = await axios.get(
      `https://examd-dev.uc.r.appspot.com/student/api/v1/getLtiCanvasConfigByGuidCourseIdQuizId?guid=${[
        props.toolConsumerGuid,
      ]}&courseId=${props.courseId}&quizId=${quizId}`,
      {
        headers: {
          Authorization: `Bearer ${props.authToken}`,
        },
      }
    );

    if (response.data) {
      if (
        response.data.recordAudio ||
        response.data.recordScreen ||
        response.data.recordWebcam
      ) {
        setIsQuizProctored(true);
      }
      setQuizConfig(response.data);
      if (response.data.lockdownBrowser) {
        setShowLDBDwnldOption(true);
        setIsQuizProctored(true);
      } else {
        setShowLDBDwnldOption(false);
      }
    }
  };

  useEffect(() => {
    let authObj = [...studentQuizAuthObject];
    authObj.forEach((item) => {
      if (item.quizId === selectedQuiz.id) {
        if (item.studentAuthState) {
          setStudentAuthed(true);
        } else {
          setStudentAuthed(false);
        }
      }
    });
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

  const handleSelectQuiz = (quizz: Object | any) => {
    let res: boolean = checkStoreForRecord(quizz);
    if (!res) {
      let quiz: {
        [key: string]: string | boolean;
      } = {
        quizId: quizz.id,
        studentAuthState: false,
      };
      setQuizAuthObj(quiz);
    }
    setQuizConfig(null);
    setIsQuizProctored(false);
    setShowLDBDwnldOption(false);
    getQuizConfigs(quizz.id);

    let qObj: any = { ...quizObj };

    Object.keys(qObj).forEach((key: any) => {
      qObj[key] = false;
    });

    qObj[quizz.id] = true;
    setQuizObj(qObj);
    setSelectedQuiz(quizz);
  };

  const handleShowHelpModal = () => {
    setShowHelpModal(true);
  };

  const handleOpenUpdateProfile = (flag: boolean) => {
    if (flag) {
      setOptionModal(false);
      setShowUpdateProfileModal(true);
    }
  };

  const showSideOptionModal = (componentName: any) => {
    switch (componentName) {
      case "SystemCheck":
        setModalTitle("System Check");
        setOptionModal(true);
        setModalComponent(
          <SystemCheck
            quizId={null}
            courseId={null}
            stuId={null}
            stuName={null}
            systemCheckStatus={() => {}}
            getSocketConnection={() => {}}
          />
        );
        break;
      case "PrivacyPolicy":
        setModalTitle("Privacy Policy");
        setOptionModal(true);
        setModalComponent(
          <PrivacyPolicy isChecked={() => {}} showAgree={false} />
        );
        break;
      case "Authentication":
        setModalTitle("Authentication");
        setOptionModal(true);
        setModalComponent(
          <ImageMatchAuthentication
            studentId={props.studentId}
            courseId={props.courseId}
            closeStream={closeStream}
            authToken={props.authToken}
            guid={props.toolConsumerGuid}
            openUpdateProfile={handleOpenUpdateProfile}
          />
        );
        break;
      default:
        break;
    }
  };

  const handleDeSelectQuiz = () => {
    let qObj: any = { ...quizObj };

    Object.keys(qObj).forEach((key: any) => {
      qObj[key] = false;
    });

    setQuizObj(qObj);
    setSelectedQuiz(null);
    setQuizConfig(null);
  };

  const handleModalClose = () => {
    setModalComponent(null);
    setOptionModal(false);
    // window.location.reload();
  };

  if (quizzes) {
    return (
      // <div className="flex flex-col justify-evenly pt-4">
      <div className="grid h-screen place-items-center">
        <div className="flex flex-row h-full w-full gap-4 px-2 justify-center items-center">
          <div className="flex flex-col h-full w-3/12 gap-10 justify-center">
            <div className="flex space-x-2 justify-center">
              <button
                type="button"
                onClick={() => showSideOptionModal("SystemCheck")}
                className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight  rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              >
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;System
                Check&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </button>
            </div>
            <div className="flex space-x-2 justify-center">
              <button
                type="button"
                onClick={() => showSideOptionModal("Authentication")}
                className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight  rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              >
                Authentication Test
              </button>
            </div>
            <div className="flex space-x-2 justify-center">
              <button
                type="button"
                onClick={() => showSideOptionModal("PrivacyPolicy")}
                className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight  rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              >
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Privacy
                Policy&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </button>
            </div>
            <div className="flex space-x-2 justify-center">
              <button
                type="button"
                onClick={() => {
                  setShowUpdateProfileModal(true);
                }}
                className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight  rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              >
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Update
                Profile&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </button>
            </div>
          </div>
          <div
            className="relative -ml-0.4 top-2 w-0.5 bg-gray-600"
            style={{ height: "20rem" }}
          ></div>
          <div className="flex flex-col h-full justify-center gap-4 text-center text-lg">
            <div className="flex justify-start">
              <AddToCalendar
                className={css`
                  width: 100%;
                  margin: 0 auto;
                  text-align: center;
                  padding: 0 0 30px;
                  @media (min-width: 768px) {
                    width: 50%;
                  }
                `}
                linkProps={{
                  className: linkStyles,
                }}
                event={eventS}
              />
            </div>
            <div className="flex flex-col w-full sm:gap-4 md:gap-4 justify-end">
              <div className="flex flex-row h-full w-full items-center justify-end gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-question-circle-fill fill-blue-400 w-6 h-6"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247zm2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z" />
                </svg>
                <p className="font-bold pr-40 text-lg">Need Help?</p>
              </div>
              <div className="flex flex-row gap-1 w-full pt-1 justify-end">
                <p
                  className="cursor-pointer text-base font-semibold text-center pr-16 relative bottom-4 left-10"
                  onClick={() => setShowStudentHelpDoc(true)}
                >
                  Document
                </p>
                <div className="relative w-0.5 bg-gray-600 h-6 bottom-4"></div>
                <p className="text-base cursor-not-allowed text-gray-400 font-semibold text-center pr-16 relative bottom-4 left-4">
                  Video
                </p>
                <div className="relative w-0.5 bg-gray-600 h-6 bottom-4 right-8"></div>
                <p
                  className="cursor-pointer text-base font-semibold text-center pr-8 relative bottom-4 right-2"
                  onClick={() => handleShowHelpModal()}
                >
                  Email/ Phone
                </p>
              </div>
            </div>
            {showLDBDwnldOption && selectedQuiz && (
              <div
                className="flex justify-center text-sm p-2 text-blue-700 rounded-lg bg-yellow-200 dark:text-blue-800"
                role="alert"
              >
                <p className="flex h-full items-center lg:text-lg sm:text-base md:text-base font-semibold  text-black">
                  {selectedQuiz.title} can only be taken in a lockdown browser.
                  If not available download from &nbsp;
                  <a
                    href={sebDownloadLink}
                    target="_blank"
                    className="text-blue-400"
                  >
                    here.
                  </a>
                </p>
              </div>
            )}
            {quizConfig && !isQuizProctored && (
              <div className="flex justify-center bg-yellow-200 p-2 rounded-lg">
                <p className="flex h-full items-center lg:text-lg sm:text-base md:text-base font-semibold text-black">
                  This quiz is not proctored, please go to the quiz page and
                  take the quiz.
                </p>
              </div>
            )}
            {!selectedQuiz ? (
              <div className="w-2/5 self-center">
                <div
                  className="flex justify-center p-4 text-sm text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-200 dark:text-blue-800"
                  role="alert"
                >
                  <svg
                    aria-hidden="true"
                    className="flex-shrink-0 inline w-8 h-8 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Info</span>
                  <div>
                    <span className="text-lg font-medium">
                      Please Select a Quiz
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-row justify-center gap-4">
                {isQuizProctored ? (
                  <div
                    className="flex p-4 mb-4 text-medium text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-200 dark:text-blue-800"
                    role="alert"
                  >
                    <svg
                      aria-hidden="true"
                      className="flex-shrink-0 inline w-8 h-8 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="sr-only">Info</span>
                    <div>
                      <span className="font-lg">
                        Quiz selected: {selectedQuiz.title}. Please tap{" "}
                        {!studentAuthed ? (
                          <b>Authenticate button</b>
                        ) : (
                          <b>Start Proctoring button</b>
                        )}{" "}
                        to continue.
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex p-4 mb-4 text-medium text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-200 dark:text-blue-800"
                    role="alert"
                  >
                    <svg
                      aria-hidden="true"
                      className="flex-shrink-0 inline w-8 h-8 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="sr-only">Info</span>
                    <div>
                      <span className="font-lg">
                        Quiz selected: {selectedQuiz.title}.
                      </span>
                    </div>
                  </div>
                )}
                {isQuizProctored && (
                  <div className="flex space-x-0 mb-4 h-10 items-center pt-4 justify-center">
                    <button
                      type="button"
                      disabled={disableDeSelect}
                      onClick={handleDeSelectQuiz}
                      className={`inline-block ${
                        disableDeSelect
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
                      } px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out`}
                    >
                      De-Select
                    </button>
                  </div>
                )}
              </div>
            )}
            <div className="flex flex-row flex-wrap gap-8">
              {quizzes.map((quiz: any, index: number) => {
                if (
                  moment(quiz.all_dates.due_at).isBefore(moment()) ||
                  Object.keys(quiz.all_dates).length === 0
                ) {
                  return (
                    <Tooltip
                      key={index}
                      placement="top"
                      title={"Due date expired"}
                    >
                      <div
                        // href="#"

                        style={{
                          cursor: "not-allowed",
                        }}
                        key={index}
                        onClick={(e: any) => e.preventDefault()}
                        className={`block p-6 max-w-sm bg-white rounded-lg border ${
                          quizObj[quiz.id]
                            ? "border-blue-600 border-4"
                            : "border-gray-200 border-2"
                        } hover:bg-gray-100 dark:${
                          quizObj[quiz.id]
                            ? "border-blue-600"
                            : "border-gray-700"
                        } dark:hover:bg-gray-300`}
                      >
                        <h1>{quiz.title}</h1>
                        <p>Type: {quiz.quiz_type}</p>
                      </div>
                    </Tooltip>
                  );
                }
                return (
                  <div
                    // href="#"

                    style={{
                      cursor: "pointer",
                    }}
                    key={index}
                    onClick={() => handleSelectQuiz(quiz)}
                    className={`block p-6 max-w-sm bg-white rounded-lg border ${
                      quizObj[quiz.id]
                        ? "border-blue-600 border-4"
                        : "border-gray-200 border-2"
                    } hover:bg-gray-100 dark:${
                      quizObj[quiz.id] ? "border-blue-600" : "border-gray-700"
                    } dark:hover:bg-gray-300`}
                  >
                    <h1>{quiz.title}</h1>
                    <p>Type: {quiz.quiz_type}</p>
                  </div>
                );
              })}
            </div>
            {!studentAuthed && selectedQuiz && quizConfig && isQuizProctored && (
              <div className="flex items-center justify-center">
                <div className="flex space-x-2 justify-center">
                  <button
                    type="button"
                    onClick={() => setShowAuthModal(true)}
                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                  >
                    Authecate
                  </button>
                </div>
              </div>
            )}
            {studentAuthed && (
              <VideoAndScreenRec
                quiz={selectedQuiz}
                username={props.username}
                pass={props.pass}
                procData={props.procData}
                token={props.authToken}
                id={props.id}
                isNewTab={props.isNewTab}
                courseId={props.courseId}
                toolConsumerGuid={props.toolConsumerGuid}
                isAuthed={props.isAuthed}
                studentId={props.studentId}
                quizConfig={quizConfig}
                accountId={props.accountId}
              />
            )}
            {showAuthModal && (
              <AuthenticationModal
                view={true}
                quizTitle={selectedQuiz.title}
                close={() => setShowAuthModal(false)}
                quizId={selectedQuiz.id}
                quizConfig={quizConfig}
                userId={props.id}
                studentId={props.studentId}
                courseId={props.courseId}
                guid={props.toolConsumerGuid}
                authToken={props.authToken}
                userName={props.username}
                authComplete={() => true}
              />
            )}
          </div>
          {modalComponent && showOptionModal && (
            <Modal
              title={modalTitle}
              visible={showOptionModal}
              width={"90pc"}
              bodyStyle={{
                maxHeight: "50%",
                height: 600,
                overflowY: "scroll",
              }}
              onCancel={() => {
                handleModalClose();
              }}
              footer={[
                modalTitle === "Help" ? (
                  <Button key="submit" loading={true}>
                    Submit
                  </Button>
                ) : (
                  <Button
                    key="close"
                    onClick={() => {
                      handleModalClose();
                    }}
                  >
                    Close
                  </Button>
                ),
              ]}
              maskClosable={false}
            >
              {modalComponent}
            </Modal>
          )}
          {showHelpModal && (
            <Help
              visible={showHelpModal}
              onCancel={() => setShowHelpModal(false)}
              authToken={props.authToken}
            />
          )}
          {showUpdateProfileModal && (
            <UpdateProfile
              show={showUpdateProfileModal}
              close={() => setShowUpdateProfileModal(false)}
              authToken={props.authToken}
              guid={props.toolConsumerGuid}
              userId={props.studentId}
            />
          )}
          {showStudentHelpDoc && (
            <StudentHelpDocument
              show={showStudentHelpDoc}
              close={() => setShowStudentHelpDoc(false)}
            />
          )}
        </div>
      </div>
      // </div>
    );
  } else {
    return (
      <div className="flex gap-8 absolute top-2/4 left-2/4">
        <p className="text-center">Fetching quizzes...</p>
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
