import { message, Modal } from "antd";
import axios from "axios";
import React, { FunctionComponent, useEffect } from "react";
import $ from "jquery";
import { getWebSocketUrl } from "./APIs/apiservices";
import ProctoringInfoModal from "./CommonUtilites/ProctoringInfoModal";
import InfoModal from "./infoModal";
import moment, { Moment } from "moment";
import { useStudentStore } from "./store/globalStore";
import ProctoringEndInfoModal from "./ProctoringEndInfoModal";
import { useAppStore } from "./store/AppSotre";
import { useSocketStore } from "./store/SocketStore";

//@ts-ignore
import SebConfigDev from "./assets/seb_settings/SebClientSettingsDev.seb";
//@ts-ignore
import SebConfigLocal from "./assets/seb_settings/SebClientSettingsLocal.seb";
import {
  getLtiCanvasConfigByAssignment,
  getQuizSubmissionsStateFromCanvas,
  newTabQuizUrl,
  saveLtiVideoRef,
  completeCanvasQuizSubmission as completeCanvasQuizSubmissionUrl,
  submitAssignment,
  saveLtiConsumptions,
} from "./apiConfigs";
import { useAssignmentStore } from "./store/StudentDashboardStore";
import { useStudentJourneyStore } from "./store/StudentProctorJourneyStore";
import { ConsumptionDetails } from "./AppTypes";

declare global {
  interface Window {
    $?: any;
    ExamdAutoProctorJS: any;
  }
}

interface Props {
  assignment: Object | any;
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
  invokeUrl: string;
  quizId: string;
}

useStudentStore.getState().setCurrentTime();

const VideoAndScreenRec: FunctionComponent<Props> = (props): JSX.Element => {
  let [assignedId, setAssignedId] = React.useState<string | null>(null);
  let [showWait, setShowWait] = React.useState<boolean>(false);
  let [alertUser, setAlertUser] = React.useState<boolean>(false);
  let [onSeb, setOnSeb] = React.useState<boolean>(false);
  let [showCloseProcPrompt, setShowCloseProcPrompt] =
    React.useState<boolean>(false);
  const [examStarted, setExamStarted] = React.useState<boolean>(false);
  let [stuAuthenticated, setStuAuthenticated] = React.useState<boolean>(false);
  let [showProctoringAlert, setShowProctoringAlert] =
    React.useState<boolean>(false);
  const [openNewTabPropmpt, setOpenNewTabPrompt] =
    React.useState<boolean>(false);
  const [quizConfig, setQuizConfig] = React.useState<any>(props.quizConfig);
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
  const assignmentStore = useAssignmentStore((state) => state);
  const setAssignmentSubmitted = useAssignmentStore(
    (state) => state.setAssignmentSubmitted
  );
  const { getJourneyDetails, setJourneyDetails } = useStudentJourneyStore(
    (state) => state
  );
  const selectedAssignment = useAssignmentStore(
    (state) => state.selectedAssignment
  );
  const { createConnection, sendAssgnStatus, assgnStatRequesting } =
    useSocketStore((state) => state);
  const { urlParamsData, tokenData } = useAppStore((state) => state);
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

  useEffect(() => {
    if (assgnStatRequesting) {
      const assignmentId = assignmentStore.selectedAssignment?.id.toString();
      const assignmentName = assignmentStore.selectedAssignment?.name;
      const msgType: string = "ASSGN_PROC_START";
      if (assignmentId && assignmentName) {
        sendAssgnStatus(assignmentId, assignmentName, msgType);
      }
    }
  }, [assgnStatRequesting]);

  // if (assgnStatRequesting) {
  // }

  const setConfigByQuizCourseGuid = async () => {
    if (props.assignment) {
      let response = await axios.get(
        `${getLtiCanvasConfigByAssignment}/${urlParamsData.guid}/${props.assignment.id}`
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
      if (item.quizId === props.quizConfig.quizId) {
        if (item.studentAuthState) {
          setStuAuthenticated(true);
        }
        return;
      }
    });
  }, [studentQuizAuthObject]);

  useEffect(() => {
    if (urlParamsData.assignmentId) {
      setConfigByQuizCourseGuid();
    }
  }, [props]);

  const saveLTIPrctoringRef = async (
    videoId: string,
    startTime: Moment,
    endTime: Moment
  ) => {
    let response = await axios.post(
      saveLtiVideoRef,
      {
        idLtiVideoRef: videoId,
        idUser: props.studentId,
        idInstructor: "",
        idReference: videoId,
        idExam: props.quizId,
        status: 1,
        courseId: props.courseId,
        guid: urlParamsData.guid,
        examDate: selectedAssignment?.due_at,
        examActualStartTime: startTime.toISOString(),
        examActualEndTime: endTime.toISOString(),
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
    useAssignmentStore.setState({
      isNewTabOpen: true,
    });

    if (!props.assignment) {
      return;
    }
    if (!props.quizConfig) {
      setShowWait(true);
      return;
    }
    startProctoring();
    const roomName: string = `${urlParamsData.guid}_${urlParamsData.courseId}_assgn_status`;
    const userName: string = `${urlParamsData.studentId}_instr_assgn_status`;
    const msgType: string = "ASSGN_PROC_START";
    if (
      urlParamsData.assignmentId &&
      assignmentStore.selectedAssignment?.name
    ) {
      createConnection(roomName, userName, msgType, {
        assignmentId: urlParamsData.assignmentId,
        assingmentName: assignmentStore.selectedAssignment.name,
      });
    }
  };

  const sendMsgViaSocket = (msgType: any, data: any) => {
    let payload = {
      msgType: msgType,
      msg: data,
    };
    socket.emit("chat", {
      evt: "chat",
      room: "rm_" + props.courseId + "_" + props.quizId + "rtc",
      text: JSON.stringify(payload),
    });
  };

  const openChannels = async (
    video: boolean,
    screen: boolean
  ): Promise<boolean> => {
    let res: {
      status: number;
      message: string;
    } = await window.ExamdAutoProctorJS.openChannels(
      props.quizConfig.recordWebcam || video,
      true,
      props.quizConfig.recordScreen || screen,
      false,
      (msg: any) => { },
      (msg: any) => { }
    );

    if (res.status === 1) {
      return false;
    }
    return true;
  };

  const submitQuizAssignment = async () => {
    let response = await axios.post(
      `${submitAssignment}/${urlParamsData.courseId}/${props.assignment.id}/${tokenData.instituteId}/${urlParamsData.studentId}/${tokenData.lmsAccessToken}`
    );

    if (response.status === 200) {
      setJourneyDetails("assignmentSubmitted");
      window.localStorage.setItem("assgnSubmit", "1");
      message.success("Assignment submitted successfully.");
      return;
    }
    window.localStorage.setItem("assgnSubmit", "0");
    message.error("Something went wrong submitting the assignment.");
    return;
  };

  const saveConsumptionDetails = async () => {
    let payload: ConsumptionDetails = {
      guid: urlParamsData.guid as string,
      emailId: urlParamsData.studentId as string,
      userId: urlParamsData.studentId as string,
      courseId: parseInt(urlParamsData.courseId as string),
      quizId: parseInt(
        assignmentStore.selectedAssignmentConfigurations?.quizId as string
      ),
      productType: "",
      durationInMins: assignmentStore.selectedAssignment?.time_limit as number,
      interactionDate: moment().toISOString(),
      status: 0,
    };
    let response = await axios.post(`${saveLtiConsumptions}`, { ...payload });
  };

  const startProctoring = async () => {
    if (
      assignmentStore.selectedAssignmentConfigurations &&
      "timeLimit" in assignmentStore.selectedAssignmentConfigurations
    ) {
      let time = moment().add(
        (assignmentStore.selectedAssignmentConfigurations[
          "timeLimit"
        ] as number) + 5,
        "minutes"
      );
      let expTime: number = Math.round(
        moment.duration(time.diff(moment())).asMilliseconds()
      );
      completeQuizInterval = setTimeout(() => {
        completeQuizSubmission();
        clearTimeout(completeQuizInterval);
        closeTab();
      }, expTime);
    }

    if (props.quizConfig.lockdownBrowser) {
      openSEB();
      return;
    }

    if (!props.isNewTab) {
      saveConsumptionDetails();
      handleOpenQuizInNewTab();
      return;
    }

    if (props.assignment === null) {
      message.warn("Please select a quiz");
      return;
    }
    setExamStarted(true);
    setAlertUser(true);
    setShowProctoringAlert(true);

    await window.ExamdAutoProctorJS.initLibrary()
      .then((resp: any) => {
        setAssignedId(resp.assignedId);
      })
      .catch((error: any) => { });

    window.ExamdAutoProctorJS.setCredentials(props.username, props.pass);

    await window.ExamdAutoProctorJS.getDefaultAudioVideoSync()


    let video = assignmentStore.selectedAssignmentConfigurations?.recordWebcam;
    let screen = assignmentStore.selectedAssignmentConfigurations?.recordScreen;
    let channelsOpened: boolean = false;

    while (!channelsOpened && (video || screen)) {
      let res: boolean = await openChannels(
        video as boolean,
        screen as boolean
      );
      if (!res) {
        message.error(
          `${selectedAssignment?.name} is a proctored assignment. Please grant the permissions to continue.`
        );
      } else {
        submitQuizAssignment();
        setJourneyDetails("cameraAccess");
        setJourneyDetails("microphoneAccess");
        setJourneyDetails("screenShare");
      }

      channelsOpened = res;
    }
    // Starts VDO + Audio recording

    if (video) {
      try {
        await window.ExamdAutoProctorJS.startVideoRecording();
      } catch (e) {
        console.log("Error starting video recording");
      }
    }

    // Starts Screen recording
    if (screen) {
      try {
        await window.ExamdAutoProctorJS.startScreenRecording();
      } catch (e) {
        console.log("Error starting screen recording");
      }
    }

    if (video) {
      let vidEle: any = $("#xvideo");
      //capture stream from vidEle
      if (navigator.userAgent.indexOf("Firefox") > -1) {
        stream = vidEle.get(0).mozCaptureStream();
      } else {
        stream = vidEle.get(0).captureStream();
      }
      if (vidEle) {
        stream.getTracks().forEach((track: any) => { });
      }
    }
    saveLTIPrctoringRef(
      window.ExamdAutoProctorJS.randomExamId,
      startTime,
      startTime
    );
  };

  const handleEndExam = async () => {
    let endTime: Moment = moment();
    const response = await axios.get(
      `${getQuizSubmissionsStateFromCanvas}${urlParamsData.courseId}/${props.quizId}/Y/${tokenData.lmsAccessToken}/${tokenData.instituteId}`
    );
    if (response.data.length > 0) {
      if (startTime.isAfter(moment.utc(response.data[0]["started_at"]))) {
        saveLTIPrctoringRef(
          window.ExamdAutoProctorJS.randomExamId,
          startTime,
          endTime
        );
        window.close();
        return;
      }

      if (!("finished_at" in response.data[0])) {
        saveLTIPrctoringRef(
          window.ExamdAutoProctorJS.randomExamId,
          startTime,
          endTime
        );
        clearInterval(checkSubmissionInterval);
        setShowCloseProcPrompt(true);
      }
    } else {
      saveLTIPrctoringRef(
        window.ExamdAutoProctorJS.randomExamId,
        startTime,
        endTime
      );
      window.close();
      return;
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
      quizId: props.quizId,
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
    if (props.assignment) {
      setRoom("rm_" + props.courseId + "_" + props.quizId + "rtc");
    }
  }, [props.assignment]);

  useEffect(() => {
    if (props.quizConfig) {
      setShowWait(false);
    }
  }, [props.quizConfig]);

  const checkQuizSubmission = async () => {
    let endTime: Moment = moment();
    let response = await axios.get(
      `${getQuizSubmissionsStateFromCanvas}${urlParamsData.courseId}/${props.quizId}/Y/${tokenData.lmsAccessToken}/${tokenData.instituteId}`
    );
    if (response.data.length > 0) {
      if (startTime.isAfter(moment.utc(response.data[0]["started_at"]))) {
        return;
      }

      if ("finished_at" in response.data[0]) {
        let currentTime = moment();
        let quizFinishTime = moment.utc(response.data[0]["finished_at"]);
        if (currentTime.isAfter(quizFinishTime)) {
          saveLTIPrctoringRef(
            window.ExamdAutoProctorJS.randomExamId,
            startTime,
            endTime
          );
          setQuizEnded(true);
          setShowCloseProcPrompt(true);
          setJourneyDetails("quizSubmitted");
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
    localStorage.removeItem("assgnSubmit");

    if (props.isNewTab) {
      getJourneyDetails();
      window.addEventListener("beforeunload", (event: any) => {
        completeQuizSubmission();
        closeTab();
      });
    }
    if (onSeb === "true") {
      setOnSeb(true);
    }

    if (urlParamsData.newTab) {
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
    if (!urlParamsData.newTab) {
      window.addEventListener("storage", (event: StorageEvent) => {
        let assgnSubmission = window.localStorage.getItem("assgnSubmit");
        if (assgnSubmission) {
          if (assgnSubmission === "1") {
            setAssignmentSubmitted(true);
          }
        }
      });
    }

    if (domain !== "localhost") {
      window.open(
        `${newTabQuizUrl}userId=${urlParamsData.userId}&courseId=${urlParamsData.courseId}&toolConsumerGuid=${urlParamsData.guid}&assignmentId=${props.assignment.id}&newTab=true&auth=1&studentId=${props.studentId}&accountId=${urlParamsData.accountId}&invokeUrl=${urlParamsData.invokeUrl}`,
        "_blank"
      );
      return;
    }
    window.open(
      `http://localhost:3000/lti/config?userId=${urlParamsData.userId}&courseId=${urlParamsData.courseId}&toolConsumerGuid=${urlParamsData.guid}&assignmentId=${props.assignment.id}&newTab=true&auth=1&studentId=${props.studentId}&accountId=${urlParamsData.accountId}&invokeUrl=${urlParamsData.invokeUrl}`,
      "_blank"
    );
    useAssignmentStore.setState({ isNewTabOpen: true });
  };

  const openSEB = () => {
    let url = window.location.href.split("//")[1];
    let urlSubStrings = url.split("/");
    let sebConfig: any = SebConfigDev;
    if (urlSubStrings[0] === "localhost:3000") {
      sebConfig = SebConfigLocal;
    }

    let sebURL: string = `seb://${urlSubStrings[0]}${sebConfig}???studentId=${urlParamsData.studentId}&assignmentId=${urlParamsData.assignmentId}&loginId=${urlParamsData.loginId}&courseId=${urlParamsData.courseId}&userId=${urlParamsData.userId}&invokeUrl=${urlParamsData.invokeUrl}&accountId=${urlParamsData.accountId}&toolConsumerGuid=${urlParamsData.guid}&newTab=true&auth=1`;
    // console.log("sebUrl", sebURL);
    // return
    window.location.href = sebURL;
    // if (stuAuthenticated || props.isAuthed) {
    // }
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
      url: `${completeCanvasQuizSubmissionUrl}${props.studentId}/${urlParamsData.courseId}/${props.quizId}/${tokenData.lmsAccessToken}`,
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

  const handleGoToQuiz = () => {
    let origin: string = new URL(tokenData.invokeUrl as string).origin;
    window.open(
      `${origin}/courses/${urlParamsData.courseId}/quizzes/${assignmentStore.selectedAssignmentConfigurations?.quizId}`
    );
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div id="xmedia" className="flex flex-row"></div>
      <div className="container text-center flex justify-center gap-8 h-full items-center">
        {!props.isNewTab && !assignmentStore.isNewTabOpen && (
          <button
            className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg
             focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            onClick={handleStartExam}
            disabled={!props.assignment}
            style={{ cursor: props.assignment ? "pointer" : "not-allowed" }}
          >
            Start Proctoring
          </button>
        )}
        {props.isNewTab && (
          <>
            <button
              disabled={assignmentStore.gotoQuiz ? false : true}
              className={`inline-block px-6 py-2.5 ${assignmentStore.gotoQuiz
                  ? "bg-blue-600 text-white"
                  : "bg-gray-400 text-black cursor-not-allowed"
                } font-medium text-xs leading-tight rounded shadow-md transition duration-150 ease-in-out`}
              onClick={handleGoToQuiz}
            >
              Go to Quiz
            </button>
            <button
              className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md
             hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg 
             transition duration-150 ease-in-out"
              onClick={handleEndExam}
              disabled={examStarted ? false : true}
              style={{ cursor: examStarted ? "pointer" : "not-allowed" }}
            >
              End Proctoring
            </button>
          </>
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
              Open {props.assignment.name} quiz in a new tab
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
          assignment={props.assignment}
        />
      )}
      {showWait && <InfoModal title="" message="Please wait..." />}
    </div>
  );
};

export default VideoAndScreenRec;
