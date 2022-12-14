import { Col, Row } from "antd";
import React, { useEffect } from "react";
import InfoModal from "../infoModal";
import { getWebSocketUrl } from "../APIs/apiservices";
import { useAssignmentStore } from "../store/StudentDashboardStore";
import { useAppStore } from "../store/AppSotre";
import { useProcotorJourneyStore } from "../store/ProctorJourneyStore";

interface Props {
  authConfigs: any;
  quizTitle: string;
  courseId: string;
  quizId: string;
  selectedRow: any;
  userId: string;
  guid: string;
  studentPhoto: any;
  studentId: any;
  updateStudentAuthStatus: (data: any) => void;
}

const AuthenticateUser: React.FC<Props> = (props): JSX.Element => {
  const [authStarted, setAuthStarted] = React.useState<boolean>(false);
  const { urlParamsData, tokenData } = useAppStore((state) => state);
  const user = "chat_" + urlParamsData.userId + "_" + "instr";
  const room = "rm_" + urlParamsData.courseId + "_" + props.quizId;
  let [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
  const selectedAssignment = useAssignmentStore(
    (state) => state.selectedAssignment
  );
  const { getJourneyDetails, setJourneyDetails } = useProcotorJourneyStore(
    (state) => state
  );
  const [authButtonDisabled, setAuthButtonDisabled] =
    React.useState<boolean>(true);
  let vdoDstRef = React.useRef<any>(null);
  const socket = getWebSocketUrl();
  var peerConnection = React.useRef<any>(null);
  var peerDataChannel = React.useRef<any>(null);
  var destVideo: any = null;
  var answer: any = null;
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
    ],
  };

  const stopRecordingWebcam = (): void => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    });
  };

  const createPeerConnection = async () => {
    peerConnection.current = new RTCPeerConnection(PC_CONFIG);

    // send data from peerDataChannel to server
    peerDataChannel.current =
      peerConnection.current.createDataChannel("dataChannel");
    //open data channel
    peerDataChannel.current.onopen = () => {};

    destVideo = new MediaStream();
    vdoDstRef.current.srcObject = destVideo;

    //create data channel
    // peerDataChannel = peerConnection.current.createDataChannel("dataChannel");

    peerConnection.current.ontrack = (event: any) => {
      event.streams[0].getTracks().forEach((track: any) => {
        destVideo.addTrack(track, event.streams[0]);
      });
    };

    peerConnection.current.onicecandidate = (event: any) => {
      if (event.candidate) {
        sendMsgViaSocket("candidate", event.candidate);
      }
    };
  };

  const createOffer = async () => {
    setIsAuthenticated(false);
    await createPeerConnection();

    let offer = await peerConnection.current.createOffer({
      offerToReceiveVideo: 1,
      offerToReceiveAudio: 1,
    });
    await peerConnection.current.setLocalDescription(offer);
    sendMsgViaSocket("offer", offer);
  };

  const sendMsgViaSocket = (msgType: string, data: any) => {
    socket.emit("chat", {
      evt: "chat",
      room: room,
      text: JSON.stringify({
        msgType: msgType,
        msg: data,
      }),
    });
  };

  const handleAuthentication = () => {
    setAuthStarted(true);
    setInterval(() => {
      setAuthStarted(false);
    }, 1000);

    // Stop webcam if it is already occupied
    if (!props.authConfigs.studentPicture) {
      // Stop webcam
      stopRecordingWebcam();
      stopRecordingWebcam();
    }
    createOffer();
  };

  const addAnswer = async (answer: any) => {
    if (!peerConnection.current.currentRemoteDescription) {
      await peerConnection.current.setRemoteDescription(answer);
    }
  };

  const addCandidate = async (candidate: any) => {
    if (peerConnection) {
      await peerConnection.current.addIceCandidate(candidate);
    }
  };

  const connectSocket = () => {
    if (!socket.connected) {
      socket.connect();
      socket.emit("validate", {
        evt: "chat",
        room: room,
        user: user,
      });
    }

    socket.on("chat", (data: any) => {
      if (data.type === "chat") {
        let msg = JSON.parse(data.message);
        if (msg.msgType === "answer") {
          answer = msg.msg;
          addAnswer(msg.msg);
        }
        if (msg.msgType === "candidate") {
          addCandidate(msg.msg);
          if (authButtonDisabled) {
            setAuthButtonDisabled(false);
          }
        }

        // if (msg.msgType === "STU_LIVE_REP") {
        //   if (msg.msg.stuId === props.selectedRow.user.id) {
        //     message.success("Please start authentication");
        //   }
        // }
      }
    });
  };

  const handleSave = async () => {
    setIsAuthenticated(true);
    let dataChannelState = await peerDataChannel.current.readyState;
    if (dataChannelState === "open") {
      props.updateStudentAuthStatus({
        courseId: urlParamsData.courseId,
        assignmentId: selectedAssignment?.id,
        studentId: props.studentId,
      });
      setIsAuthenticated(true);
      peerDataChannel.current.send(
        JSON.stringify({
          authStatus: "STU_AUTHED",
          stuId: props.selectedRow.id,
        })
      );
    }
    // sendMsgViaSocket("STU_AUTHED", { stuId: props.selectedRow.user.id });
  };

  useEffect(() => {
    connectSocket();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="font-bold text-2xl">Authentication</p>
      <br />
      <div className="box-border h-32 w-3/4 p-4 border-2 rounded">
        <Row gutter={24} style={{ textAlign: "center" }}>
          <Col span={12}>
            <p className="font-semibold text-xl">Quiz Name</p>
          </Col>
          <Col span={6}>
            <p className="text-xl">{props.quizTitle}</p>
          </Col>
        </Row>
        <Row gutter={24} style={{ textAlign: "center" }}>
          <Col span={12}>
            <p className="font-semibold text-xl">Student Name</p>
          </Col>
          <Col span={6}>
            {/* <p className="text-xl">{props.userName}</p> */}
            <p className="text-xl">{props.selectedRow.name}</p>
          </Col>
        </Row>
      </div>
      <br />
      <div className="flex space-x-2 justify-center">
        <button
          type="button"
          onClick={handleAuthentication}
          className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          Start Authentication
        </button>
      </div>
      <br />
      <br />
      <div className="flex flex-row gap-10">
        <div className="box-border h-44 w-56 p-1 border-2 rounded">
          <video autoPlay playsInline muted ref={vdoDstRef}></video>
        </div>
        <div className="box-border h-44 w-56 p-1 border-2 rounded">
          {props.studentPhoto ? (
            <img
              src={props.studentPhoto}
              alt="Not found"
              className="object-fill h-40 w-56 rounded"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg font-semibold">
              Not available
            </div>
          )}
        </div>
        <div className="box-border h-44 w-56 p-1 border-2 rounded">
          {props.studentId ? (
            <img
              src={props.studentId}
              alt="Not found"
              className="object-fill h-40 w-56 rounded"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg font-semibold">
              Not available
            </div>
          )}
        </div>
      </div>
      <br />
      <div className="flex space-x-2 justify-center">
        <button
          type="button"
          onClick={handleSave}
          disabled={isAuthenticated}
          className={
            "inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          }
        >
          {isAuthenticated ? "Authenticated" : "Authenticate"}
        </button>
      </div>
      {authStarted && (
        <InfoModal
          title="Authentication Started"
          message="Authentication has been started."
        />
      )}
    </div>
  );
};

export default AuthenticateUser;
