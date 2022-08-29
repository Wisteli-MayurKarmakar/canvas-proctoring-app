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
import { Button, message, Modal } from "antd";

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
}

const Quzzies: React.FC<Props> = (props) => {
  let [quizzes, setQuizzes] = React.useState<Object[] | null>(null);
  let [selectedQuiz, setSelectedQuiz] = React.useState<any>(null);
  let [quizObj, setQuizObj] = React.useState<Object | any>({});
  let [modalComponent, setModalComponent] = React.useState<any>(null);
  let [showOptionModal, setOptionModal] = React.useState<boolean>(false);
  let [modalTitle, setModalTitle] = React.useState<any>(null);
  let [closeStream, setCloseStream] = React.useState<boolean>(false);
  let [showHelpModal, setShowHelpModal] = React.useState<boolean>(false);
  let [showUpdateProfileModal, setShowUpdateProfileModal] =
    React.useState<boolean>(false);

  const updateUsersDetails = async () => {
    let students: Object[] = [];
    let response: any = await axios.get(
      `https://examd.us/student/api/v1/fetchCanvasEnrollmentsByCourseId/${props.courseId}`,
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
    updateUsersDetails();
  }, []);

  const startQuizz = (quizz: Object | any) => {
    if (
      moment(quizz.all_dates.due_at).isBefore(moment()) ||
      Object.keys(quizz.all_dates).length === 0
    ) {
      return;
    }
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
  }

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

  const handleModalClose = () => {
    setModalComponent(null);
    setOptionModal(false);
    window.location.reload();
  };

  if (quizzes) {
    return (
      <div className="flex flex-row h-full w-full mt-5 container mx-auto justify-center items-center">
        <div className="flex flex-col h-full w-4/12 gap-10">
          <div className="flex space-x-2 justify-center">
            <button
              type="button"
              onClick={() => showSideOptionModal("SystemCheck")}
              className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight  rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            >
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;System Check &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </button>
          </div>
          <div className="flex space-x-2 justify-center">
            <button
              type="button"
              onClick={() => showSideOptionModal("Authentication")}
              className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight  rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            >
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Authentication Test&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </button>
          </div>
          <div className="flex space-x-2 justify-center">
            <button
              type="button"
              onClick={() => showSideOptionModal("PrivacyPolicy")}
              className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight  rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            >
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Privacy Policy&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Update Profile&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </button>
          </div>
          <div className="flex space-x-2 justify-center">
            <button
              type="button"
              disabled={true}
              onClick={() => {
                setShowUpdateProfileModal(true);
              }}
              className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium cursor-not-allowed text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            >
              &nbsp;&nbsp;Download Lockdown Browser&nbsp;&nbsp;
            </button>
          </div>
          <div className="flex space-x-2 justify-center">
            <button
              type="button"
              disabled={true}
              onClick={() => {
                setShowUpdateProfileModal(true);
              }}
              className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium cursor-not-allowed text-xs leading-tight  rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            >
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Help Document&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </button>
          </div>
          <div className="flex space-x-2 justify-center">
            <button
              type="button"
              disabled={true}
              onClick={() => {
                setShowUpdateProfileModal(true);
              }}
              className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium cursor-not-allowed text-xs leading-tight  rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            >
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Help Video&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </button>
          </div>
          <div className="flex space-x-2 justify-center">
            <button
              type="button"
              onClick={handleShowHelpModal}
              className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight  rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            >
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Email/ Phone
              Help&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </button>
          </div>
        </div>
        <div
          className="relative -ml-0.4 top-2 w-0.5 bg-gray-600"
          style={{ height: "30rem" }}
        ></div>
        <div className="flex flex-col gap-5 justify-center items-center h-screen mx-auto mt-5 text-center container text-lg ">
          <div className="flex flex-row gap-10">
            {quizzes.map((quiz: any, index) => {
              return (
                <div
                  // href="#"

                  style={{
                    cursor:
                      moment(quiz.all_dates.due_at).isBefore(moment()) ||
                      Object.keys(quiz.all_dates).length === 0
                        ? "not-allowed"
                        : "pointer",
                  }}
                  key={index}
                  onClick={() => startQuizz(quiz)}
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
          />
        </div>
        {modalComponent && showOptionModal && (
          <Modal
            title={modalTitle}
            visible={showOptionModal}
            width={"90pc"}
            bodyStyle={{ maxHeight: "50%", height: 600, overflowY: "scroll" }}
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
      </div>
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
