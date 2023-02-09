import { Button, Col, Modal, Row, Timeline } from "antd";
import React, { useEffect, useState } from "react";
import { getWebSocketUrl } from "../../APIs/apiservices";
import ChatBox from "../../CommonUtilites/ChatBox";
import { useAppStore } from "../../store/AppSotre";
import { QuizConfiguration } from "../../AppTypes";
import moment from "moment";

interface Props {
  view: boolean;
  close: () => void;
  quiz: any;
  student: any;
  quizConfig?: QuizConfiguration;
}

type Violations = {
  message: string[];
  timestamp: string;
};

const LiveStreaming: React.FC<Props> = (props): JSX.Element => {
  let { view, close } = props;
  const room: string =
    "rm_" + props.student.course_id + "_" + props.quiz.id + "rtc";
  const user: string = "chat_" + props.student.user_id;
  let answer: any = null;
  let peerConnection = React.useRef<any>(null);
  const vdoDstRef: any = React.useRef<any>(null);
  let destVideo: any = null;
  const socket = getWebSocketUrl();
  const socketViolations = getWebSocketUrl();
  const { urlParamsData } = useAppStore((state) => state);
  const [violations, setViolations] = useState<Violations[]>([]);

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

  const listenToViolations = () => {
    const roomName: string = `vl_${urlParamsData.courseId}_${props.student.user_id}_${props?.quizConfig?.idInstructor}_${props.quiz.id}`;
    const userName: string = urlParamsData.userId as string;

    if (!socketViolations.connected) {
      socketViolations.connect();
      socketViolations.emit("validate", {
        evt: "chat",
        room: roomName,
        user: userName,
      });
    }

    socketViolations.on("chat", (data: any) => {
      if (data.type === "chat") {
        let msg = JSON.parse(data.message);
        if (msg.msgType === "VIOLATION_MSG") {
          setViolations((prevViolations) => [...prevViolations, msg.msg]);
        }
      }
    });
  };

  useEffect(() => {
    connectSocket();
    listenToViolations();
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
          <div className="flex items-center justify-center h-[240px] border-2 mt-4 rounded">
            <p className="text-center font-semibold">Coming soon...</p>
          </div>
        </div>
        <div className="flex flex-col w-full justify-center gap-1">
          <p className="text-xl font-semibold text-center underline">
            Violations messages
          </p>
          <div className="flex items-center justify-center mx-auto box-border w-full rounded border-2 py-2 h-[240px] mt-4">
            {violations.length > 0 ? (
              <Timeline
                style={{
                  // maxHeight: "80%",
                  height: 240,
                  overflowY: "scroll",
                  position: "relative",
                  padding: 5,
                  width: "100%",
                  scrollbarWidth: "thin",
                }}
                mode="right"
              >
                {violations.map((violation: Violations, idx: number) => {
                  const label: string = moment(violation.timestamp).format(
                    "MM/DD/YYYY HH:mm:ss a"
                  );
                  return (
                    <Timeline.Item key={idx} label={label}>
                      {violation.message.join(", ")}
                    </Timeline.Item>
                  );
                })}
              </Timeline>
            ) : (
              <p className="text-center font-semibold">No violations...</p>
            )}
          </div>
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
