import { Button, Col, Modal, Row } from "antd";
import React, { useEffect } from "react";
import { getWebSocketUrl } from "../../APIs/apiservices";
import ChatBox from "../../CommonUtilites/ChatBox";

interface Props {
  view: boolean;
  close: () => void;
  quiz: any;
  student: any;
}

const LiveStreaming: React.FC<Props> = (props): JSX.Element => {
  let { view, close } = props;
  const room: string =
    "rm_" + props.student.course_id + "_" + props.quiz.id + "rtc";
  const user: string = "chat_" + props.student.user_id;
  var answer: any = null;
  var peerConnection = React.useRef<any>(null);
  const vdoDstRef: any = React.useRef<any>(null);
  var destVideo: any = null;
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

  const createPeerConnection = async () => {
    peerConnection.current = new RTCPeerConnection(PC_CONFIG);

    destVideo = new MediaStream();
    vdoDstRef.current.srcObject = destVideo;

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

  const addAnswer = async (answer: any) => {
    if (!peerConnection.current.currentRemoteDescription) {
      await peerConnection.current.setRemoteDescription(answer);
    }
  };

  const addCandidate = async (candidate: any) => {
    if (peerConnection && candidate) {
      // await peerConnection.current.setRemoteDescription(answer);
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
        }

        if (msg.msgType === "QUIZ_STARTED") {
        }
        // if (msg.msgType === "STU_LIVE_REP") {
        //   if (msg.msg.stuId === props.selectedRow.user.id) {
        //     message.success("Please start authentication");
        //   }
        // }
      }
    });
    createOffer();
  };

  useEffect(() => {
    connectSocket();
  }, []);

  return (
    <Modal
      visible={view}
      // onCancel={close}
      closable={false}
      footer={[
        <Button
          key="close"
          onClick={close}
          type="primary"
          className="!bg-blue-600 !rounded"
        >
          Close
        </Button>,
      ]}
      destroyOnClose={true}
      maskClosable={false}
      width={"60pc"}
      // title={<span>{props.quiz.title}</span>}
    >
      <div className="container mx-auto h-44 w-full">
        <div id="xmedia" className="hidden"></div>
        <fieldset
          className="h-44 w-full"
          style={{
            border: "1px solid #bec2c7",
            width: "100%",
            borderRadius: "5px",
          }}
        >
          <legend
            className="font-bold"
            style={{
              marginLeft: "1em",
              padding: "0px 1px 0pc 2pc",
              width: "230px",
              fontSize: "1.2em",
            }}
          >
            Student & Quiz Details
          </legend>
          <Row gutter={24}>
            <Col span={12}>
              <div className="p-2">
                <p className="text-center font-semibold underline">
                  Student Information
                </p>
                <Row gutter={24} style={{ textAlign: "center" }}>
                  <Col span={12}>
                    <p className="">Name:</p>
                  </Col>
                  <Col span={12}>
                    <p className="">{props.student.name}</p>
                  </Col>
                </Row>
                <Row gutter={24} style={{ textAlign: "center" }}>
                  <Col span={12}>User Id:</Col>
                  <Col span={12}>{props.student.user_id}</Col>
                </Row>
                <Row gutter={24} style={{ textAlign: "center" }}>
                  <Col span={12}>Course Id:</Col>
                  <Col span={12}>{props.student.course_id}</Col>
                </Row>
              </div>
            </Col>
            <Col span={12}>
              <div className="p-2">
                <p className="text-center font-semibold underline">
                  Quiz Information
                </p>
                <Row gutter={24} style={{ textAlign: "center" }}>
                  <Col span={12}>
                    <p className="">Quiz Name:</p>
                  </Col>
                  <Col span={12}>
                    <p className="">{props.quiz.title}</p>
                  </Col>
                </Row>
                <Row gutter={24} style={{ textAlign: "center" }}>
                  <Col span={12}>Quiz Id:</Col>
                  <Col span={12}>{props.quiz.id}</Col>
                </Row>
                <Row gutter={24} style={{ textAlign: "center" }}>
                  <Col span={12}>Time limit:</Col>
                  <Col span={12}>{props.quiz.time_limit} mins</Col>
                </Row>
              </div>
            </Col>
          </Row>
        </fieldset>
      </div>
      <div className="grid grid-cols-2 gap-4 h-full">
        <div className="flex flex-col w-full justify-center gap-1">
          <p className="text-xl font-semibold text-center underline">
            Student's video
          </p>
          <video
            src=""
            controls
            playsInline
            ref={vdoDstRef}
            autoPlay
            style={{ height: 240 }}
            className="rounded w-full h-full bg-black mt-4"
          ></video>
        </div>
        {/* <div className="flex flex-col w-full justify-center gap-1">
          <p className="text-xl font-semibold text-center underline">
            Screen video
          </p>
          <video
            src=""
            controls
            playsInline
            ref={vdoDstRef}
            autoPlay
            style={{ height: 240 }}
            className="rounded w-full h-full bg-black mt-4"
          >
          </video>
        </div> */}
        <div className="flex flex-col w-full justify-center gap-1">
          <p className="text-xl font-semibold text-center underline">
            Screen video
          </p>
          <div
            style={{ height: 240 }}
            className="box-border w-full mt-4 rounded border-2"
          >
            <p className="flex items-center justify-center h-full font-semibold text-lg">Coming soon...</p>
          </div>
        </div>
        <div className="flex flex-col w-full justify-center gap-1">
          <p className="text-xl font-semibold text-center underline">
            Violations messages
          </p>
          <div
            style={{ height: 240 }}
            className="box-border w-full mt-4 rounded border-2"
          ></div>
        </div>
        <div className="flex flex-col w-full justify-center gap-1">
          <p className="text-xl font-semibold text-center underline">
            Chat messages
          </p>
          <ChatBox
            quiz={props.quiz}
            student={props.student}
            classStyle={
              "flex flex-col items-center justify-center w-full h-60 border-2 rounded-md p-2 mt-4"
            }
            isStudent={false}
          />
        </div>
      </div>
    </Modal>
  );
};

export default LiveStreaming;
