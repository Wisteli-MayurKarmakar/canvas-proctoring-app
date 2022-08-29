import { Button, message, Modal } from "antd";
import React, { useEffect } from "react";
import PrivacyPolicy from "../../StudentDashboard/Tabs/PrivacyPolicy";
import QuizRules from "../../StudentDashboard/Tabs/QuizRules";
import SystemCheck from "../../StudentDashboard/Tabs/SystemCheck";
import Thanks from "../../StudentDashboard/Tabs/Thanks";
import StudentAuthentication from "../../StudentDashboard/Tabs/StudentAuthentication";

interface Props {
  view: boolean;
  quizTitle: string;
  close: (status: boolean) => void;
  quizId: string;
  userId: string;
  userName: string;
  quizConfig: Object | any;
  authComplete: () => void;
  courseId: string;
  getStuAuthStatus: (data: any) => void;
  authToken: any;
  guid: any;
  studentId: string;
}

const AuthenticationModal: React.FC<Props> = (props): JSX.Element => {
  let { view, close, quizTitle } = props;
  const [stepName, setStepName] = React.useState<string>("System Check");
  const [stepNo, setStepNo] = React.useState<number>(0);
  const [buttonDisabled, setButtonDisabled] = React.useState<boolean>(true);
  let [stuAuthenticated, setStuAuthenticated] = React.useState<boolean>(false);
  let [quizSteps, setQuizSteps] = React.useState<any>([]);
  const [authConfigurations, setAuthConfigurations] =
    React.useState<Object | null>(null);
  const [socketInstance, setSocketInstance] = React.useState<any>(null);
  let studIdWODash = props.courseId + "_" + props.quizId;
  let user = "chat_" + props.userId;
  let room = "rm_" + studIdWODash;
  let [mediaStream, setMediaStream] = React.useState<any>(null);

  const getSystemCheckStatus = (status: boolean) => {
    if (status) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  };

  const isAgree = (flag: boolean) => {
    if (flag) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  };

  // useEffect(() => {
  //   if (stepNo > 3) {
  //     props.authComplete();
  //   }
  // }, [stepNo]);

  const sendStatus = (status: any) => {
    socketInstance.emit("chat", {
      evt: "chat",
      room: room,
      text: JSON.stringify({
        msgType: "STU_LIVE_REP",
        msg: { stuId: props.userId, status: status },
      }),
    });
    socketInstance.on("chat", (data: any) => {
      if (data.type === "user") {
        return;
      }
      let msg = JSON.parse(data.message);

      if (msg.msgType === "STU_LIVE_REQ") {
        sendAuthStatus("STU_AUTH_STEP", quizSteps[stepNo].name, props.userId);
      }
    });
  };

  // const sendSignal = (stage: any) => {
  //   sendStatus(stage);

  //   socketInstance.on("chat", (data: any) => {
  //     console.log("AuthModal", data);
  //   });
  // };

  const handleSocketConnection = (socket: any) => {
    setSocketInstance(socket);
    // socket.emit("chat", {
    //   evt: "chat",
    //   room: room,
    //   text: JSON.stringify({
    //     msgType: "STU_LIVE_REP",
    //     msg: { stuId: props.userId, status: steps[stepNo].name },
    //   }),
    // });

    // socket.on("chat", (data: any) => {
    //   if (data.type === "chat") {
    //     let msg = JSON.parse(data.message);
    //     if (msg.msgType === "STU_LIVE_REQ") {
    //       let stuIds = msg.msg.stuIds;
    //       let stuId = stuIds.find((id: any) => id === props.userId);
    //       if (stuId) {
    //         socket.emit("chat", {
    //           evt: "chat",
    //           room: room,
    //           text: JSON.stringify({
    //             msgType: "STU_LIVE_REP",
    //             msg: { stuId: props.userId, status: steps[stepNo].name },
    //           }),
    //         });
    //       }
    //     }

    //     if (msg.msgType === "STU_AUTHED") {
    //       let stuId = msg.msg.stuId;
    //       if (stuId === props.userId) {
    //         props.getStuAuthStatus({ status: "AUTHED", stuId: stuId });
    //         setStuAuthenticated(true);
    //       }
    //     }
    //   }
    // });
  };

  const sendAuthStatus = (msgType: string, stepName: string, stuId: string) => {
    socketInstance.emit("chat", {
      evt: "chat",
      room: room,
      text: JSON.stringify({
        msgType: msgType,
        msg: { stuId: stuId, stepName: stepName },
      }),
    });
  };

  let steps = [
    {
      name: "System Check",
      component: (
        <SystemCheck
          quizId={props.quizId}
          stuName={props.userName}
          stuId={props.userId}
          systemCheckStatus={getSystemCheckStatus}
          courseId={props.courseId}
          getSocketConnection={handleSocketConnection}
        />
      ),
    },
    {
      name: "Privacy Policy",
      component: <PrivacyPolicy isChecked={isAgree} showAgree={true} />,
    },
    {
      name: "Rules",
      component: (
        <QuizRules quizConfig={props.quizConfig} isChecked={isAgree} />
      ),
    },
  ];

  const handleStudentAuthed = (status: any) => {
    if (status) {
      setButtonDisabled(false);
      setStuAuthenticated(true);
    }
  };

  const handleAuthStatus = (status: boolean) => {
    if (status) {
      setStuAuthenticated(status);
      setButtonDisabled(false);
    }
  };

  useEffect(() => {
    let config = {} as any;
    config["studentPicture"] = props.quizConfig.studentPicture;
    config["studentIdDl"] = props.quizConfig.studentIdDl;
    config["roomScan"] = props.quizConfig.roomScan;
    config["otp"] = props.quizConfig.otp;
    config["examdLiveLaunch"] = props.quizConfig.examdLiveLaunch;
    if (props.quizConfig) {
      if (
        props.quizConfig.studentPicture ||
        props.quizConfig.studentIdDl ||
        props.quizConfig.roomScan ||
        props.quizConfig.otp ||
        props.quizConfig.examdLiveLaunch
      ) {
        steps.push({
          name: "Authentication",
          component: (
            <StudentAuthentication
              authConfigs={config}
              quizTitle={props.quizTitle}
              userId={props.userId}
              courseId={props.courseId}
              quizId={props.quizId}
              isStudentAuthed={handleStudentAuthed}
              authToken={props.authToken}
              guid={props.guid}
              studentId={props.studentId}
              authStatus={handleAuthStatus}
              // socket={socketInstance}
            />
          ),
        });
      }
      setQuizSteps(steps);
    }
    steps.push({
      name: "Thanks",
      component: <Thanks />,
    });

    let flag: boolean = false;
    steps.forEach((step: { [key: string]: string | JSX.Element }) => {
      if (step.name === "Authentication") {
        flag = true;
      }
    });

    if (!flag) {
      setStuAuthenticated(true);
    }
    setQuizSteps(steps);
    setAuthConfigurations(config);
  }, []);

  const handleNext = () => {
    sendStatus(quizSteps[stepNo + 1].name);
    setStepName(quizSteps[stepNo + 1].name);
    setStepNo(stepNo + 1);
    setButtonDisabled(true);
    sendAuthStatus("STU_AUTH_STEP", quizSteps[stepNo + 1].name, props.studentId);
  };

  const closeWebCamResources = () => {
    //enumerate devices and if any active close it
    //close mediaStream
    socketInstance.emit("chat", {
      evt: "chat",
      room: room,
      text: JSON.stringify({
        msgType: "END_AUTH",
        msg: { stuId: props.userId },
      }),
    });
  };

  return (
    <Modal
      title={
        <div className="flex flex-row gap-8">
          <p>{quizTitle} - Authentication</p>
          <p> ({stepName})</p>
        </div>
      }
      visible={view}
      bodyStyle={{ maxHeight: "50%", height: 600, overflowY: "scroll" }}
      onCancel={() => {
        closeWebCamResources();
        // window.location.reload();
        close(false);
      }}
      footer={
        stepNo >= 0 && stepNo < quizSteps.length - 1
          ? [
              <Button key="close" onClick={() => close(false)}>
                Close
              </Button>,
              <Button key="next" onClick={handleNext} disabled={buttonDisabled}>
                Next Step
              </Button>,
            ]
          : stepNo === quizSteps.length - 1 && [
              <Button
                key="close"
                onClick={() => {
                  closeWebCamResources();
                  close(false);
                  props.authComplete();
                }}
                disabled={stuAuthenticated ? false : true}
              >
                Close
              </Button>,
            ]
      }
      width={"90pc"}
      destroyOnClose={true}
      maskClosable={false}
    >
      {quizSteps.length > 0 && quizSteps[stepNo].component}
    </Modal>
  );
};

export default AuthenticationModal;
