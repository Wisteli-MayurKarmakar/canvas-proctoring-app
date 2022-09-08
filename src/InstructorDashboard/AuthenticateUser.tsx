import { Col, Divider, message, Row } from "antd";
import React, { useEffect } from "react";
import InfoModal from "../infoModal";
import { getWebSocketUrl } from "../APIs/apiservices";
import axios from "axios";

interface Props {
  authConfigs: any;
  quizTitle: string;
  courseId: string;
  quizId: string;
  selectedRow: any;
  userId: string;
  guid: string;
}

interface rtcStateProto {
  [key: string]: boolean;
}

const AuthenticateUser: React.FC<Props> = (props): JSX.Element => {
  const [authStarted, setAuthStarted] = React.useState<boolean>(false);
  const user = "chat_" + props.userId + "_" + "instr";
  const room = "rm_" + props.courseId + "_" + props.quizId;
  let [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
  let [studentPhoto, setStudentPhoto] = React.useState<any>(null);
  let [studentId, setStudentId] = React.useState<any>(null);
  let [fetchingProofs, setFetchingProofs] = React.useState<boolean>(false);
  const [authButtonDisabled, setAuthButtonDisabled] =
    React.useState<boolean>(true);
  let vdoDstRef = React.useRef<any>(null);
  const socket = getWebSocketUrl();
  const [roomName, setRoomName] = React.useState<string>("");
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
      // {
      //   urls: ["stun:stun1.1.google.com:19302", "stun:stun2.1.google.com:19302"],
      // }
    ],
  };

  const webRTCStates: rtcStateProto = {
    offer: false,
    answer: false,
    icecandidateLocal: false,
    icecandidateDest: false,
  };

  const stopRecordingWebcam = (): void => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    });
  };

  const sendData = (data: any) => {
    var jsn = {
      room: roomName,
      data: data,
    };
    socket.emit("rtcdata", jsn);
  };

  const createPeerConnection = async () => {
    peerConnection.current = new RTCPeerConnection(PC_CONFIG);

    // send data from peerDataChannel to server
    peerDataChannel.current =
      peerConnection.current.createDataChannel("dataChannel");
    //open data channel
    peerDataChannel.current.onopen = () => {
      console.log("data channel opened");
    };

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
      console.log("authuser msg", data);
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
      peerDataChannel.current.send(
        JSON.stringify({
          authStatus: "STU_AUTHED",
          stuId: props.selectedRow.user.id,
        })
      );
    }
    // sendMsgViaSocket("STU_AUTHED", { stuId: props.selectedRow.user.id });
  };

  const getStudentProofs = async (studentId: string) => {
    setFetchingProofs(true);
    let picProof = await axios.get(
      `https://examd-dev.uc.r.appspot.com/student/api/v1/viewCanvasProfile/${props.guid}/${props.selectedRow.user.id}`,
      {
        headers: {
          Authorization: `Bearer ${props.authConfigs.data.access_token}`,
        },
        responseType: "arraybuffer",
      }
    );

    if (
      picProof.headers["content-type"] === "image/jpeg" ||
      picProof.headers["content-type"] === "image/png" ||
      picProof.headers["content-type"] === "image/svg" ||
      picProof.headers["content-type"] === "image/webp" ||
      picProof.headers["content-type"] === "image/jpg"
    ) {
      let blob = new Blob([picProof.data], {
        type: picProof.headers["content-type"],
      });
      setStudentPhoto(URL.createObjectURL(blob));
    }

    let idProof = await axios.get(
      `https://examd-dev.uc.r.appspot.com/student/api/v1/downloadDL/${props.guid}/${props.selectedRow.user.id}`,
      {
        headers: {
          Authorization: `Bearer ${props.authConfigs.data.access_token}`,
        },
        responseType: "arraybuffer",
      }
    );

    if (
      idProof.headers["content-type"] === "image/jpeg" ||
      idProof.headers["content-type"] === "image/png" ||
      idProof.headers["content-type"] === "image/svg" ||
      idProof.headers["content-type"] === "image/webp" ||
      idProof.headers["content-type"] === "image/jpg"
    ) {
      let blob = new Blob([idProof.data], {
        type: idProof.headers["content-type"],
      });
      setStudentId(URL.createObjectURL(blob));
    }
    setFetchingProofs(false);
  };

  useEffect(() => {
    connectSocket();
    getStudentProofs(props.selectedRow.user.id);
  }, []);

  if (fetchingProofs) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-lg font-semibold">
          Fetching details. Please wait...
        </p>
      </div>
    );
  }

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
            <p className="text-xl">{props.selectedRow.user.name}</p>
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
          {studentPhoto ? (
            <img
              src={studentPhoto}
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
          {studentId ? (
            <img
              src={studentId}
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
          disabled={authButtonDisabled}
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
