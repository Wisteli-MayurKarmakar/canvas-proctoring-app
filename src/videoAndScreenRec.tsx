import { message, Modal, Popconfirm } from "antd";
import axios from "axios";
import React, { FunctionComponent, useEffect } from "react";
import AuthenticationModal from "./StudentDashboard/Modals/AuthenticationModal";
import $ from "jquery";
import { getWebSocketUrl } from "./APIs/apiservices";
import ProctoringInfoModal from "./CommonUtilites/ProctoringInfoModal";

declare global {
  interface Window {
    $?: any;
    ExamdAutoProctorJS: any;
  }
}

interface Props {
  quiz: Object | any;
  username: string;
  pass: string;
  procData: any;
  token: string;
  id: string;
  toolConsumerGuid: string;
  courseId: string;
  isNewTab: boolean;
  isAuthed: boolean;
  studentId: string;
}

const VideoAndScreenRec: FunctionComponent<Props> = (props): JSX.Element => {
  let [assignedId, setAssignedId] = React.useState<string | null>(null);
  let [quizTitle, setQuizTitle] = React.useState<string | null>(null);
  let [quizId, setQuizId] = React.useState<string | null>(null);
  let [alertUser, setAlertUser] = React.useState<boolean>(false);
  let [alertMessage, setAlertMessage] = React.useState<string | null>(null);
  let [showAuthModal, setShowAuthModal] = React.useState<boolean>(false);
  let [showCloseProcPrompt, setShowCloseProcPrompt] =
    React.useState<boolean>(false);
  // let [video, setVideo] = React.useState<string>("0");
  // let [screen, setScreen] = React.useState<string>("0");
  const [examStarted, setExamStarted] = React.useState<boolean>(false);
  let [stuAuthenticated, setStuAuthenticated] = React.useState<boolean>(false);
  let [showProctoringAlert, setShowProctoringAlert] =
    React.useState<boolean>(false);
  const [openNewTabPropmpt, setOpenNewTabPrompt] =
    React.useState<boolean>(false);
  const [quizConfig, setQuizConfig] = React.useState<any>(null);
  let interval: any = null;
  const socket = getWebSocketUrl();
  const socket2 = getWebSocketUrl();
  let [room, setRoom] = React.useState<string | null>(null);
  const user = "chat_" + props.studentId;
  var peerConnection: any = null;
  var stream: any = null;
  var offer: any = null;
  const TURN_SERVER_URL = "turn:examd.us:3478?transport=tcp";
  const TURN_SERVER_USERNAME = "webRtcUser";
  const TURN_SERVER_CREDENTIAL = "C0pp$r567";
  const PC_CONFIG = {
    iceServers: [
      {
        urls: TURN_SERVER_URL,
        username: TURN_SERVER_USERNAME,
        credential: TURN_SERVER_CREDENTIAL,
      },
      // {
      //   urls: ["stun:stun1.1.google.com:19302", "stun:stun2.1.google.com:19302"],
      // }
    ],
  };

  const setConfigByQuizCourseGuid = async () => {
    if (props.quiz) {
      let response = await axios.get(
        `https://examd-dev.uc.r.appspot.com/student/api/v1/getLtiCanvasConfigByGuidCourseIdQuizId?guid=${[
          props.toolConsumerGuid,
        ]}&courseId=${props.courseId}&quizId=${props.quiz.id}`,
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        }
      );

      if (response.data) {
        setQuizConfig(response.data);
      } else {
        message.error(
          "This Quiz is not Proctored. Please go to the Quiz Page and Continue."
        );
      }
      return;
    }
  };

  const handleAuthComplete = (): void => {
    // setShowAuthModal(false);
    setStuAuthenticated(true);
    // startProctoring();
    handleOpenQuizInNewTab();
  };

  useEffect(() => {
    setConfigByQuizCourseGuid();
    if (props.quiz) {
      setQuizTitle(props.quiz.title);
      setQuizId(props.quiz.id);
    }
  }, [props]);

  const saveLTIPrctoringRef = (videoId: string): void => {
    axios.post(
      "https://examd-dev.uc.r.appspot.com/student/api/v1/saveLtiVideoRef",
      {
        idLtiVideoRef: videoId,
        idUser: props.studentId,
        idInstructor: "",
        idReference: videoId,
        idExam: props.quiz.id,
        status: 1,
        courseId: props.courseId,
        toolConsumerInstanceGuid: props.toolConsumerGuid,
        examDate: new Date(props.quiz.all_dates.due_at).toISOString(),
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.token}`,
        },
      }
    );
  };

  //set alert state to false after 10 seconds of interval

  useEffect(() => {
    if (alertUser) {
      interval = setInterval(() => {
        setAlertUser(false);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [alertUser]);

  const handleStartExam = (): void => {
    if (!props.quiz) {
      return;
    }
    if (stuAuthenticated || props.isAuthed) {
      startProctoring();
    } else {
      // alert("Please perform authentication first");
      setShowAuthModal(true);
      return;
    }
  };

  const sendMsgViaSocket = (msgType: any, data: any) => {
    let payload = {
      msgType: msgType,
      msg: data,
    };
    socket.emit("chat", {
      evt: "chat",
      room: "rm_" + props.courseId + "_" + props.quiz.id + "rtc",
      text: JSON.stringify(payload),
    });
  };

  const startProctoring = async () => {
    if (!props.isNewTab && !stuAuthenticated) {
      setOpenNewTabPrompt(true);
      return;
    }

    if (!props.isNewTab && stuAuthenticated) {
      handleOpenQuizInNewTab();
      return;
    }

    if (props.quiz === null) {
      message.warn("Please select a quiz");
      return;
    }
    setExamStarted(true);
    setAlertUser(true);
    setShowProctoringAlert(true);

    await window.ExamdAutoProctorJS.initLibrary()
      .then((resp: any) => {
        console.log(resp);
        setAssignedId(resp.assignedId);
      })
      .catch((error: any) => {
        console.log(error);
      });

    // Chile's API user/ pass for DEV
    window.ExamdAutoProctorJS.setCredentials(props.username, props.pass);

    // Default Audio Video devices
    await window.ExamdAutoProctorJS.getDefaultAudioVideoSync()
      .then((resp: any) => {})
      .catch((error: any) => {});

    // Open Audio Video devices channels
    // let videoCap = video === "1" ? true : false;
    // let screenCap = screen === "1" ? true : false;

    // if (quizConfig) {
    //   videoCap = quizConfig.recordWebcam;
    //   screenCap = quizConfig.recordScreen;
    // }

    await window.ExamdAutoProctorJS.openChannels(
      true,
      true,
      true,
      false,
      (msg: any) => {},
      (msg: any) => {
        console.log("log message", msg);
      }
    );

    // Starts VDO + Audio recording
    try {
      await window.ExamdAutoProctorJS.startVideoRecording();

    } catch (e) {
      console.log("Error starting video recording");
    }

    try {
      await window.ExamdAutoProctorJS.startScreenRecording();
    } catch (e) {
      console.log("Error starting screen recording");
    }
    // Starts Screen recording
    let vidEle: any = $("#xvideo");
    //capture stream from vidEle
    stream = vidEle.get(0).captureStream();
    if (vidEle) {
      stream.getTracks().forEach((track: any) => {});
    }
    console.log(window.ExamdAutoProctorJS.randomExamId);
    saveLTIPrctoringRef(window.ExamdAutoProctorJS.randomExamId);
  };

  const handleEndExam = async () => {
    setShowCloseProcPrompt(true);

    // window.close();
  };

  const handleStuAuthStatus = (data: any): void => {
    if (data.status === "AUTHED") {
      if (data.stuId === props.id) {
        setStuAuthenticated(true);
      }
    }
  };

  const createPeerConnection = async () => {
    if (!peerConnection) {
      peerConnection = new RTCPeerConnection(PC_CONFIG);
    }
    let localStream: any = null;
    if (stream) {
      stream.getTracks().forEach((track: any) => {
        peerConnection.addTrack(track, stream);
      });
    } else {
      let vidEle: any = $("#xvideo");
      console.log("vid: " + vidEle);
      //capture stream from vidEle
      stream = vidEle.get(0).captureStream();
      stream.getTracks().forEach((track: any) => {
        peerConnection.addTrack(track, stream);
      });
    }

    peerConnection.onicecandidate = async (event: any) => {
      if (event.candidate) {
        sendMsgViaSocket("candidate", event.candidate);
      }
    };
  };

  const addCandidate = async (candidate: any) => {
    if (peerConnection) {
      await peerConnection.addIceCandidate(candidate);
    }
  };

  const createAnswer = async (offer: any) => {
    await createPeerConnection();

    await peerConnection.setRemoteDescription(offer);
    let answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    sendMsgViaSocket("answer", answer);
  };

  const connectSocket = (): void => {
    if (!socket.connected) {
      socket.connect();
      socket.emit("validate", {
        evt: "chat",
        room: room,
        user: user,
      });
    }

    sendMsgViaSocket("QUIZ_STARTED", {
      stuId: props.id,
      quizId: props.quiz.id,
      courseId: props.courseId,
    });

    socket.on("chat", (data: any) => {
      if (data.type === "chat") {
        let msg = JSON.parse(data.message);
        if (msg.msgType === "offer") {
          offer = msg.msg;
          createAnswer(msg.msg);
        }
        if (msg.msgType === "candidate") {
          addCandidate(msg.msg);
        }
      }
    });
  };

  useEffect(() => {
    if (room) {
      connectSocket();
    }
  }, [room]);

  useEffect(() => {
    if (props.quiz) {
      setRoom("rm_" + props.courseId + "_" + props.quiz.id + "rtc");
    }
  }, [props.quiz]);

  useEffect(() => {
    if (props.isNewTab) {
      startProctoring();
    }
  }, []);

  const handleOpenQuizInNewTab = () => {
    window.open(
      `https://examd.us/lti/config/index.html?userId=${props.id}&courseId=${props.courseId}&toolConsumerGuid=${props.toolConsumerGuid}&quizId=${props.quiz.id}&newTab=true&auth=1&studentId=${props.studentId}`,
      "_blank"
    );
    // window.open(
    //   `http://localhost:3000/lti/config?userId=${props.id}&courseId=${
    //     props.courseId
    //   }&toolConsumerGuid=${props.toolConsumerGuid}&quizId=${
    //     props.quiz.id
    //   }&newTab=true&auth=1&studentId=${props.studentId}&video=${
    //     quizConfig.recordWebcam ? "1" : "0"
    //   }&screen=${quizConfig.recordScreen ? "1" : "0"}`
    // );
    setOpenNewTabPrompt(false);
  };

  const handleOk = (): void => {
    setExamStarted(false);
    setAlertUser(true);
    setAlertMessage("Your exam has ended");
    window.ExamdAutoProctorJS.stopRecording();
    window.close();
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div id="xmedia" className="flex flex-row"></div>
      <div className="container text-center flex justify-center gap-8 h-full items-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded mt-4"
          onClick={handleStartExam}
          disabled={!props.quiz}
          style={{ cursor: props.quiz ? "pointer" : "not-allowed" }}
        >
          Start Proctoring
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded mt-4"
          onClick={handleEndExam}
          disabled={examStarted ? false : true}
          style={{ cursor: examStarted ? "pointer" : "not-allowed" }}
        >
          End Proctoring
        </button>
      </div>
      {showProctoringAlert && (
        <ProctoringInfoModal
          visible={showProctoringAlert}
          close={() => setShowProctoringAlert(false)}
        />
      )}
      {openNewTabPropmpt && (
        <Modal
          visible={true}
          footer={null}
          destroyOnClose={true}
          maskClosable={false}
          onCancel={() => setOpenNewTabPrompt(false)}
        >
          <div className="p-6 text-center">
            <svg
              aria-hidden="true"
              className="mx-auto mb-4 w-14 h-14 text-gray-400 dark:text-gray-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Open {props.quiz.title} quiz in a new tab
            </h3>
            <button
              data-modal-toggle="popup-modal"
              type="button"
              onClick={handleOpenQuizInNewTab}
              className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
            >
              Open
            </button>
          </div>
        </Modal>
      )}
      {showAuthModal && quizTitle && quizId && quizConfig && (
        <AuthenticationModal
          view={showAuthModal}
          quizTitle={quizTitle}
          quizId={quizId}
          close={() => setShowAuthModal(false)}
          userId={props.id}
          userName={props.username}
          courseId={props.courseId}
          getStuAuthStatus={handleStuAuthStatus}
          authComplete={handleAuthComplete}
          quizConfig={quizConfig}
          authToken={props.token}
          guid={props.toolConsumerGuid}
          studentId={props.studentId}
        />
      )}
      {showCloseProcPrompt && (
        <Modal
          visible={showCloseProcPrompt}
          closable={false}
          footer={null}
          title={null}
          width={"50pc"}
        >
          <div className="flex flex-col items-center h-full w-full gap-4">
            <p className="text-lg font-semibold">
              Proctoring is in progress. Closing this tab automatically close
              your test/quiz.
            </p>
            <p className="text-lg font-semibold">
              Are you sure you want to close the tab and close the test/quiz?
            </p>
            <div className="flex flex-row gap-4">
              <div className="flex space-x-2 justify-center">
                <button
                  type="button"
                  onClick={() => setShowCloseProcPrompt(false)}
                  className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                >
                  No
                </button>
              </div>
              <div className="flex space-x-2 justify-center">
                <button
                  onClick={() => {
                    handleOk();
                  }}
                  type="button"
                  className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default VideoAndScreenRec;
