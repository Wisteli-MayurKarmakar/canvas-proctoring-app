import { message, Modal } from "antd";
import axios from "axios";
import React, { FunctionComponent, useEffect } from "react";
import $ from "jquery";
import { getWebSocketUrl } from "./APIs/apiservices";
import ProctoringInfoModal from "./CommonUtilites/ProctoringInfoModal";
import InfoModal from "./infoModal";
import moment from "moment";
import { useStudentStore } from "./store/globalStore";
import ProctoringEndInfoModal from "./ProctoringEndInfoModal";

//@ts-ignore
import SebConfigDev from "./assets/seb_settings/SebClientSettingsDev.seb";
//@ts-ignore
import SebConfigLocal from "./assets/seb_settings/SebClientSettingsLocal.seb";
import {
  getLtiCanvasConfigByGuidCourseIdQuizId,
  getQuizSubmissionsStateFromCanvas,
  newTabQuizUrl,
  saveLtiVideoRef,
  completeCanvasQuizSubmission as completeCanvasQuizSubmissionUrl,
} from "./apiConfigs";

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
  quizConfig: any;
  accountId: string;
}

useStudentStore.getState().setCurrentTime();

const VideoAndScreenRec: FunctionComponent<Props> = (props): JSX.Element => {
  let [assignedId, setAssignedId] = React.useState<string | null>(null);
  let [showWait, setShowWait] = React.useState<boolean>(false);
  let [alertUser, setAlertUser] = React.useState<boolean>(false);
  let [onSeb, setOnSeb] = React.useState<boolean>(false);
  let [showCloseProcPrompt, setShowCloseProcPrompt] =
    React.useState<boolean>(false);
  let [video, setVideo] = React.useState<boolean>(false);
  let [screen, setScreen] = React.useState<boolean>(false);
  const [examStarted, setExamStarted] = React.useState<boolean>(false);
  let [stuAuthenticated, setStuAuthenticated] = React.useState<boolean>(false);
  let [showProctoringAlert, setShowProctoringAlert] =
    React.useState<boolean>(false);
  const [openNewTabPropmpt, setOpenNewTabPrompt] =
    React.useState<boolean>(false);
  const [quizConfig, setQuizConfig] = React.useState<any>(null);
  let checkSubmissionInterval: any = null;
  let interval: any = null;
  let completeQuizInterval: any = null;
  const socket = getWebSocketUrl();
  let [room, setRoom] = React.useState<string | null>(null);
  let studentQuizAuthObject = useStudentStore(
    (state) => state.studentQuizAuthObject
  );
  let [quizEnded, setQuizEnded] = React.useState<boolean>(false);
  let startTime = useStudentStore((state) => state.currentTime);
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
        `${getLtiCanvasConfigByGuidCourseIdQuizId}?guid=${[
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

  useEffect(() => {
    studentQuizAuthObject.forEach((item) => {
      if (item.quizId === props.quiz.id) {
        if (item.studentAuthState) {
          setStuAuthenticated(true);
        }
        return;
      }
    });
  }, [studentQuizAuthObject]);

  useEffect(() => {
    setConfigByQuizCourseGuid();
  }, [props]);

  const saveLTIPrctoringRef = (videoId: string): void => {
    axios.post(
      saveLtiVideoRef,
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
    if (!props.quizConfig) {
      setShowWait(true);
      return;
    }

    startProctoring();
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
    let time = moment().add(parseInt(props.quiz["time_limit"]) + 5, "minutes");
    let expTime: number = Math.round(
      moment.duration(time.diff(moment())).asMilliseconds()
    );
    completeQuizInterval = setTimeout(() => {
      completeQuizSubmission();
      clearTimeout(completeQuizInterval);
      closeTab();
    }, expTime);

    if (props.quizConfig.lockdownBrowser) {
      if (stuAuthenticated) {
        openSEB();
        return;
      }
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

    window.ExamdAutoProctorJS.setCredentials(props.username, props.pass);

    await window.ExamdAutoProctorJS.getDefaultAudioVideoSync()
      .then((resp: any) => {})
      .catch((error: any) => {});
    let url_string = window.location.href;
    let url = new URL(url_string);
    let video = url.searchParams.get("video");
    let screen = url.searchParams.get("screen");

    console.log(video, screen);

    await window.ExamdAutoProctorJS.openChannels(
      props.quizConfig.recordWebcam || (video === "1" ? true : false),
      true,
      props.quizConfig.recordScreen || (screen === "1" ? true : false),
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
    if (navigator.userAgent.indexOf("Firefox") > -1) {
      stream = vidEle.get(0).mozCaptureStream();
    } else {
      stream = vidEle.get(0).captureStream();
    }
    if (vidEle) {
      stream.getTracks().forEach((track: any) => {});
    }
    console.log(window.ExamdAutoProctorJS.randomExamId);
    saveLTIPrctoringRef(window.ExamdAutoProctorJS.randomExamId);
  };

  const handleEndExam = async () => {
    const response = await axios.get(
      `${getQuizSubmissionsStateFromCanvas}${props.courseId}/${props.quiz.id}/Y/${props.token}`
      // {
      //   headers: {
      //     Authorization: `Bearer ${props.token}`,
      //   },
      // }
    );
    if (response.data.length > 0) {
      if (startTime.isAfter(moment.utc(response.data[0]["started_at"]))) {
        window.close();
        return;
      }

      if (!("finished_at" in response.data[0])) {
        clearInterval(checkSubmissionInterval);
        setShowCloseProcPrompt(true);
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
    if (props.quizConfig) {
      setShowWait(false);
    }
  }, [props.quizConfig]);

  const checkQuizSubmission = async () => {
    let response = await axios.get(
      `${getQuizSubmissionsStateFromCanvas}${props.courseId}/${props.quiz.id}/Y/${props.token}`
    );
    if (response.data.length > 0) {
      if (startTime.isAfter(moment.utc(response.data[0]["started_at"]))) {
        return;
      }

      if ("finished_at" in response.data[0]) {
        let currentTime = moment();
        let quizFinishTime = moment.utc(response.data[0]["finished_at"]);
        if (currentTime.isAfter(quizFinishTime)) {
          setQuizEnded(true);
          setShowCloseProcPrompt(true);
          await window.ExamdAutoProctorJS.stopRecording();
          clearInterval(checkSubmissionInterval);
        }
      }
    }
  };

  useEffect(() => {
    let url_string = window.location.href;
    let url = new URL(url_string);
    let onSeb = url.searchParams.get("onSEBApp");

    localStorage.removeItem("tabClose");

    if (props.isNewTab) {
      window.addEventListener("beforeunload", (event: any) => {
        completeQuizSubmission();
        closeTab();
      });
    }
    if (onSeb === "true") {
      setOnSeb(true);
    }
    // setVideo(video === "1" ? true : false);
    // setScreen(screen === "1" ? true : false);
    if (props.isNewTab) {
      checkSubmissionInterval = setInterval(() => {
        checkQuizSubmission();
      }, 10000);

      startProctoring();
    }

    return () => {
      clearInterval(checkSubmissionInterval);
    };
  }, []);

  const handleOpenQuizInNewTab = () => {
    const url = window.location.href;
    const domain = url.split("/")[2].split(":")[0];
    setOpenNewTabPrompt(false);

    if (domain !== "localhost") {
      window.open(
        `${newTabQuizUrl}userId=${props.id}&courseId=${
          props.courseId
        }&toolConsumerGuid=${props.toolConsumerGuid}&quizId=${
          props.quiz.id
        }&newTab=true&auth=1&studentId=${props.studentId}&video=${
          quizConfig.recordWebcam ? "1" : "0"
        }&screen=${quizConfig.recordScreen ? "1" : "0"}&accountId=${
          props.accountId
        }`,
        "_blank"
      );
      return;
    }
    window.open(
      `http://localhost:3000/lti/config?userId=${props.id}&courseId=${
        props.courseId
      }&toolConsumerGuid=${props.toolConsumerGuid}&quizId=${
        props.quiz.id
      }&newTab=true&auth=1&studentId=${props.studentId}&video=${
        quizConfig.recordWebcam ? "1" : "0"
      }&screen=${quizConfig.recordScreen ? "1" : "0"}&accountId=${
        props.accountId
      }`,
      "_blank"
    );
  };

  const openSEB = () => {
    if (stuAuthenticated || props.isAuthed) {
      let url = window.location.href.split("//")[1];
      let urlSubStrings = url.split("/");
      let sebConfig: any = SebConfigDev;
      if (urlSubStrings[0] === "localhost:3000") {
        sebConfig = SebConfigLocal;
      }

      let sebURL: string = `seb://${urlSubStrings[0]}${sebConfig}???userId=${props.id}&courseId=${props.courseId}&toolConsumerGuid=${props.toolConsumerGuid}&quizId=${props.quiz.id}&newTab=true&auth=1&studentId=${props.studentId}`;
      window.location.href = sebURL;
    }
  };

  const closeTab = () => {
    if (onSeb) {
      setExamStarted(false);
      window.ExamdAutoProctorJS.stopRecording();
      window.open("https://www.google.com/");
      return;
    }
    setExamStarted(false);
    setAlertUser(true);
    window.close();
  };

  const completeQuizSubmission = async () => {
    $.ajax({
      async: false,
      url: `${completeCanvasQuizSubmissionUrl}${props.studentId}/${props.courseId}/${props.quiz.id}`,
      headers: {
        Authorization: `Bearer ${props.token}`,
      },
    });
  };

  const handleProctoringEnd = async () => {
    if (quizEnded) {
      closeTab();
      return;
    }

    await window.ExamdAutoProctorJS.stopRecording();
    completeQuizSubmission();
    closeTab();
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
        {props.isNewTab && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded mt-4"
            onClick={handleEndExam}
            disabled={examStarted ? false : true}
            style={{ cursor: examStarted ? "pointer" : "not-allowed" }}
          >
            End Proctoring
          </button>
        )}
      </div>
      {showProctoringAlert && quizConfig && (
        <ProctoringInfoModal
          visible={showProctoringAlert}
          quizConfig={quizConfig}
          onSeb={onSeb}
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
      {showCloseProcPrompt && (
        <ProctoringEndInfoModal
          visible={showCloseProcPrompt}
          close={() => setShowCloseProcPrompt(false)}
          handleOk={handleProctoringEnd}
          quizFinished={quizEnded}
          quiz={props.quiz}
        />
      )}
      {showWait && <InfoModal title="" message="Please wait..." />}
    </div>
  );
};

export default VideoAndScreenRec;
