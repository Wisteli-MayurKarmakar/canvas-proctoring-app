import { message } from "antd";
import axios from "axios";
import React, { FunctionComponent, useEffect, useState } from "react";
import InfoModal from "./infoModal";
import AuthenticationModal from "./StudentDashboard/Modals/AuthenticationModal";
import $ from "jquery";
import { getWebSocketUrl } from "./APIs/apiservices";

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
  const [examStarted, setExamStarted] = React.useState<boolean>(false);
  let [stuAuthenticated, setStuAuthenticated] = React.useState<boolean>(false);
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

  const setConfigByQuizCourseGuid = (): void => {
    if (props.quiz) {
      axios
        .get(
          `https://examd-dev.uc.r.appspot.com/student/api/v1/getLtiCanvasConfigByGuidCourseIdQuizId?guid=${[
            props.toolConsumerGuid,
          ]}&courseId=${props.courseId}&quizId=${props.quiz.id}`,
          {
            headers: {
              Authorization: `Bearer ${props.token}`,
            },
          }
        )
        .then((res) => {
          setQuizConfig(res.data);
        })
        .catch((err) => {
          message.error("No configurations found for this quiz");
        });
    }
  };

  const handleAuthComplete = (): void => {
    setShowAuthModal(false);
    startProctoring();
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
        idUser: props.id,
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
    if (!stuAuthenticated && !props.isAuthed) {
      setShowAuthModal(true);
    } else {
      startProctoring();
    }
  };

  const sendMsgViaSocket = (msgType: any, data: any) => {
    let payload = {
      msgType: msgType,
      msg: data,
    };
    console.log("rm_" + props.courseId + "_" + props.quiz.id + "rtc");
    socket.emit("chat", {
      evt: "chat",
      room: "rm_" + props.courseId + "_" + props.quiz.id + "rtc",
      text: JSON.stringify(payload),
    });
  };

  const call = (data: any) => {
    console.log("call data", data);
    if (data.evt === "message") {
      if ("violationId" in data.payload) {
        if (
          window.ExamdAutoProctorJS.randomExamId === data.payload.violationId
        ) {
          let violation = JSON.parse(data.payload.violationMsg);
          console.log("violation", violation);
          sendMsgViaSocket("violation", violation);
        }
      }
    }
  };

  const startProctoring = async () => {
    if (quizConfig.recordScreen && !props.isNewTab) {
      setOpenNewTabPrompt(true);
      return;
    }
    if (props.quiz === null) {
      message.warn("Please select a quiz");
      return;
    }
    setExamStarted(true);
    setAlertUser(true);
    setAlertMessage("Your exam has started");

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
    await window.ExamdAutoProctorJS.openChannels(
      true,
      true,
      props.isNewTab ? true : quizConfig.recordScreen,
      false,
      (msg: any) => {
        // call(msg)
        // window.ExamdAutoProctorJS.xsock.on("message", (data: any) => {
        //   sendMsgViaSocket("chat", "Hello")
        // })
      },
      (msg: any) => {
        console.log("log message", msg);
      }
    );

    // Starts VDO + Audio recording
    await window.ExamdAutoProctorJS.startVideoRecording();

    // Starts Screen recording
    await window.ExamdAutoProctorJS.startScreenRecording();
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
    setExamStarted(false);
    setAlertUser(true);
    setAlertMessage("Your exam has ended");
    window.ExamdAutoProctorJS.stopRecording();
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
    // if (!vdoStmSource) {
    //   localStream = await navigator.mediaDevices.getUserMedia({
    //     audio: true,
    //     video: true,
    //   });
    //   videoSrc.current.srcObject = localStream;
    //   setVdoStmSource(localStream);
    // }
    if (stream) {
      stream.getTracks().forEach((track: any) => {
        peerConnection.addTrack(track, stream);
      });
    } else {
      let vidEle: any = $("#xvideo");
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

  const connectSocket = (room: string): void => {
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
      console.log("chat", data);
      if (data.type === "chat") {
        let msg = JSON.parse(data.message);
        if (msg.msgType === "offer") {
          offer = msg.msg;
          createAnswer(msg.msg);
        }
        if (msg.msgType === "candidate") {
          addCandidate(msg.msg);
        }

        // if (msg.msgType === "STU_LIVE_REP") {
        //   if (msg.msg.stuId === props.selectedRow.user.id) {
        //     message.success("Please start authentication");
        //   }
        // }
      }
    });
  };

  useEffect(() => {
    if (props.quiz) {
      connectSocket("rm_" + props.courseId + "_" + props.quiz.id + "rtc");
      setRoom("rm_" + props.courseId + "_" + props.quiz.id + "rtc");
    }
  }, [props.quiz]);

  useEffect(() => {

  }, []);

  const handleOpenQuizInNewTab = () => {
    // localStorage.setItem("selectedQuiz", JSON.stringify(props.quiz));
    // window.open(
    //   `https://examd.us/lti/config/index.html?userId=${props.id}&courseId=${props.courseId}&toolConsumerGuid=${props.toolConsumerGuid}&quizId=${props.quiz.id}&newTab=true`,
    //   "_blank"
    // );
    window.open(
      `http://localhost:3000/lti/config?userId=${props.id}&courseId=${props.courseId}&toolConsumerGuid=${props.toolConsumerGuid}&quizId=${props.quiz.id}&newTab=true&auth=1`
    );
    setOpenNewTabPrompt(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div id="xmedia" className="flex flex-row"></div>
      <div className="container text-center flex justify-center gap-8">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded mt-4"
          onClick={handleStartExam}
        >
          Start Exam
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded mt-4"
          onClick={handleEndExam}
          disabled={examStarted ? false : true}
          style={{ cursor: examStarted ? "pointer" : "not-allowed" }}
        >
          End Exam
        </button>
      </div>
      {alertUser && <InfoModal title="" message={alertMessage} />}
      {openNewTabPropmpt && (
        <div
          id="popup-modal"
          tabIndex={-1}
          className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 md:inset-0 h-modal md:h-full"
        >
          <div className="relative mx-auto p-4 w-full max-w-md h-full md:h-auto">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                data-modal-toggle="popup-modal"
              ></button>
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
            </div>
          </div>
        </div>
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
        />
      )}
    </div>
  );
};

export default VideoAndScreenRec;





