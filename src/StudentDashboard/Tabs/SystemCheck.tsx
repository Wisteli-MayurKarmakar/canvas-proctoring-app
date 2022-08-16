import { Col, Row, Space, Spin } from "antd";
import React, { useEffect } from "react";
import { getWebSocketUrl } from "../../APIs/apiservices";
import { FcAssistant, FcSupport } from "react-icons/fc";
import {
  AudioOutlined,
  CheckCircleOutlined,
  DesktopOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { AiOutlineFundView } from "react-icons/ai";
import classes from "./tabs.module.scss";

interface Props {
  quizId: string;
  stuName: string;
  stuId: string;
  systemCheckStatus: (status: boolean) => void;
  courseId: string;
  getSocketConnection: any;
}

const SystemCheck: React.FC<Props> = (props): JSX.Element => {
  const [spinning, setSpinning] = React.useState<boolean>(false);
  const [systemCheckClicked, setSystemCheckClicked] =
    React.useState<boolean>(false);
  const [camera, setCamera] = React.useState<boolean>(false);
  const [systemError, setSystemError] = React.useState<boolean>(false);
  const [microphone, setMicrophone] = React.useState<boolean>(false);
  var ws = getWebSocketUrl();

  const iconsSize = {
    fontSize: "2rem",
    paddingBottom: "0.5rem",
  };

  const systemCheckSuccessIcon = {
    fontSize: "30px",
    color: "#59ca0d !important",
  };

  const systemCheckFailIcon = {
    fontSize: "30px",
    color: "#d70303 !important",
  };

  const connectSocket = (stuId: string) => {
    let studIdWODash = props.courseId + "_" + props.quizId;
    let user = "chat_" + stuId;
    let room = "rm_" + studIdWODash;

    if (!ws.connected) {
      ws.connect();
      ws.emit("validate", {
        evt: "chat",
        room: room,
        user: user,
      });
    }

    ws.emit("chat", {
      evt: "chat",
      room: room,
      text: JSON.stringify({
        msgType: "EXAM_SESS_JOIN",
        msg: {
          stuName: studIdWODash + "_" + stuId,
          stuId: stuId,
        },
      }),
    });

    props.getSocketConnection(ws);

    // ws.on("message", (data: any) => {
    //   console.log(data);
    // });
    // ws.on("chat", (data: any) => {
    //   console.log("chat", data);
    // });
  };

  useEffect(() => {
    if (camera && microphone) {
      props.systemCheckStatus(true);
    }
    if (!camera || !microphone) {
      props.systemCheckStatus(false);
    }
  }, [camera, microphone]);

  const testSystemCheck = (): void => {
    setSpinning(true);
    setSystemCheckClicked(true);
    setTimeout(() => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Video capability
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then(handleCameraMicrophone)
          .catch((error) => {
            console.error("handleCameraMicrophone() error:", error);
            setSystemCheckClicked(true);
            setCamera(false);
            setMicrophone(false);
            setSpinning(false);
            setSystemError(true);
          });
      }
    }, 2000);
  };
  const handleCameraMicrophone = (stream: any): void => {
    stream.getTracks().forEach((track: any) => track.stop());
    setCamera(true);
    setMicrophone(true);
    setSystemCheckClicked(true);
    setSpinning(false);
    setSystemError(false);
  };

  useEffect(() => {
    connectSocket(props.stuId as string);
  }, []);
  return (
    <div className="text-center w-full">
      <Spin tip="Checking your system" size="large" spinning={spinning}>
        <b className="text-2xl font-extrabold">
          {" "}
          Test your equipment before you start the quiz
        </b>
        <p className="font-bold">
          <span>
            <b className="flex flex-row justify-center items-center gap-4 text-xl">
              <FcSupport /> Please Note
            </b>
          </span>{" "}
          <br /> The automated equipment check does not guarantee your
          equipment's functionality on the exam day. Blocked ports or security
          firewalls, or software upgrades may inhibit your ability to connect to
          a proctor. To ensure functionailty, check with our experienced
          technician.
        </p>
      </Spin>
      <Space direction="vertical">
        <Row gutter={24}>
          <Col span={24}>
            <Space size={50} direction="horizontal">
              <VideoCameraOutlined style={{ ...iconsSize }} />{" "}
              {camera && (
                <CheckCircleOutlined
                  style={
                    camera
                      ? { ...systemCheckSuccessIcon }
                      : { ...systemCheckFailIcon }
                  }
                />
              )}{" "}
            </Space>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <Space size={50} direction="horizontal">
              <AudioOutlined style={{ ...iconsSize }} />{" "}
              {microphone && (
                <CheckCircleOutlined
                  style={
                    microphone
                      ? { ...systemCheckSuccessIcon }
                      : { ...systemCheckFailIcon }
                  }
                />
              )}{" "}
            </Space>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <Space size={50} direction="horizontal">
              <DesktopOutlined style={{ ...iconsSize }} />{" "}
              {microphone && (
                <CheckCircleOutlined
                  style={
                    microphone
                      ? { ...systemCheckSuccessIcon }
                      : { ...systemCheckFailIcon }
                  }
                />
              )}{" "}
            </Space>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            {" "}
            {/* <FundViewOutlined /> */}
            <Space size={50} direction="horizontal">
              <AiOutlineFundView style={{ ...iconsSize }} />{" "}
              {microphone && (
                <CheckCircleOutlined
                  style={
                    microphone
                      ? { ...systemCheckSuccessIcon }
                      : { ...systemCheckFailIcon }
                  }
                />
              )}{" "}
            </Space>
          </Col>
        </Row>
        <Row gutter={24}>
          <div className="flex flex-row space-x-2 items-center justify-center">
            <button
              onClick={testSystemCheck}
              type="button"
              className="flex flex-row px-12 py-2.5 items-center gap-2 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            >
              <FcAssistant /> 
              Test Computer
            </button>
          </div>
        </Row>
      </Space>
    </div>
  );
};

export default SystemCheck;
