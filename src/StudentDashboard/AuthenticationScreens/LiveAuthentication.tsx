import React, { useEffect } from "react";
import { getWebSocketUrl } from "../../APIs/apiservices";

interface Props {
  courseId: string;
  quizId: string;
  userId: string;
  authConfigs: any;
}

const LiveAuthentication: React.FC<Props> = (props): JSX.Element => {
  const socket = getWebSocketUrl();
  const videoSrc = React.useRef<any>(null);
  let [vdoStmSource, setVdoStmSource] = React.useState<any>(null);
  const roomName = "rm_" + props.courseId + "_" + props.quizId;
  var offer: any = null;
  const user = "chat_" + props.userId + "_" + "stu";
  var peerConnection: any = null;
  var vStream: any = null;

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
    vStream = stream;
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
      vStream = localStream;
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

    peerConnection.ondatachannel = (event: any) => {
      let recieveChannel = event.channel;
      recieveChannel.onmessage = (msg: any) => {
        console.log("message recieved", msg)

      }
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
        if (msg.msgType === "AUTH_APPROVED") {
          console.log("AUTH_APPROVED");
        }
        if (msg.msgType === "END_AUTH") {
          if (msg.msg.stuId === props.userId) {
            //get tracks from videoSrc and stop the stream
            if (vStream) {
              vStream.getTracks().forEach((track: any) => {
                track.stop();
              });
            }
          }
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
      <div className="flex flex-col justify-center">
        <div className="box-border h-56 w-64 p-1 border-2 rounded">
          <video ref={videoSrc} id="videoSrc" autoPlay muted />
        </div>
        <p className="text-center text-xl font-bold">Video</p>
      </div>
    </div>
  );
};

export default LiveAuthentication;
