import axios from "axios";
import React, { useEffect } from "react";
import { getWebSocketUrl } from "../../APIs/apiservices";
import jwt from "jsonwebtoken";

interface Props {
  authConfigs: any;
  quizTitle: string;
  userId: string;
  courseId: string;
  quizId: string;
  // socket: any;
}

const StudentAuthentication: React.FC<Props> = (props): JSX.Element => {
  let [vdoStmSource, setVdoStmSource] = React.useState<any>(null);
  const videoSrc = React.useRef<any>(null);
  const roomName = "rm_" + props.courseId + "_" + props.quizId;
  var offer: any = null;
  const user = "chat_" + props.userId + "_" + "stu";
  var peerConnection: any = null;
  const socket = getWebSocketUrl();

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

  const startVideo = async () => {
    if (!props.authConfigs.examdLiveLaunch) {
      return;
    }
    let stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    videoSrc.current.srcObject = stream;
    setVdoStmSource(stream);
  };

  const createPeerConnection = async () => {
    peerConnection = new RTCPeerConnection(PC_CONFIG);
    let localStream: any = null;
    if (!vdoStmSource) {
      localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      videoSrc.current.srcObject = localStream;
      setVdoStmSource(localStream);
    }
    if (vdoStmSource) {
      vdoStmSource.getTracks().forEach((track: any) => {
        peerConnection.addTrack(track, vdoStmSource);
      });
    } else {
      localStream.getTracks().forEach((track: any) => {
        peerConnection.addTrack(track, localStream);
      });
    }

    peerConnection.onicecandidate = async (event: any) => {
      if (event.candidate) {
        sendMsgViaSocket("candidate", event.candidate);
      }
    };
  };

  const sendMsgViaSocket = (msgType: any, data: any) => {
    socket.emit("chat", {
      evt: "chat",
      room: roomName,
      text: JSON.stringify({
        msgType: msgType,
        msg: data,
      }),
    });
  };

  const createAnswer = async (offer: any) => {
    await createPeerConnection();

    await peerConnection.setRemoteDescription(offer);
    let answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    sendMsgViaSocket("answer", answer);
  };
  const addCandidate = async (candidate: any) => {
    if (peerConnection) {
      await peerConnection.setRemoteDescription(offer);
      await peerConnection.addIceCandidate(candidate);
    }
  };

  const sendActiveNotification = () => {
    socket.connect();
    socket.emit("validate", {
      evt: "chat",
      room: roomName,
      user: user,
    });

    socket.emit("chat", {
      evt: "chat",
      room: roomName,
      text: JSON.stringify({
        msgType: "USER_ACTIVE",
        msg: {
          stuName: props.courseId + "_" + props.quizId + "_" + props.userId,
          stuId: props.userId,
        },
      }),
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
        if(msg.msgType === "AUTH_APPROVED"){
          console.log("AUTH_APPROVED");
        }
      }
    });
  };

  useEffect(() => {
    sendActiveNotification();
    startVideo();
  }, []);
  return (
    <div className="flex flex-row gap-40 mt-24 items-center justify-center">
      {props.authConfigs.examdLiveLaunch && (
        <div className="flex flex-col justify-center">
          <div className="box-border h-56 w-64 p-1 border-2 rounded">
            <video ref={videoSrc} id="videoSrc" autoPlay muted />
          </div>
          <p className="text-center text-xl font-bold">Video</p>
        </div>
      )}
      {props.authConfigs.studentPicture && (
        <div className="flex flex-col">
          <div className="box-border h-56 w-64 p-1 border-2 rounded"></div>
          <p className="text-center text-xl font-bold">Student Picture</p>
        </div>
      )}
      {props.authConfigs.studentIdDl && (
        <div className="flex flex-col">
          <div className="box-border h-56 w-64 p-1 border-2 rounded"></div>
          <p className="text-center text-xl font-bold">Student DL/ ID</p>
        </div>
      )}
      {props.authConfigs.otp && (
        <div className="flex flex-col">
          <p className="text-xl">Enter OTP</p>
          <div className="flex flex-row gap-4">
            <input
              type="text"
              id="first_name"
              className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-44 p-2.5 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter OTP"
              required
            />
            <button
              type="button"
              className="py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>
          </div>
          <br />
          <p>Please enter the otp sent to your registered email.</p>
        </div>
      )}
    </div>
  );
};

export default StudentAuthentication;
