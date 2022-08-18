import { Button, message, Modal } from "antd";
import React, { useEffect } from "react";
import PrivacyPolicy from "../../StudentDashboard/Tabs/PrivacyPolicy";
import QuizRules from "../../StudentDashboard/Tabs/QuizRules";
import SystemCheck from "../../StudentDashboard/Tabs/SystemCheck";
import AuthenticateUser from "../../InstructorDashboard/AuthenticateUser";
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

  useEffect(() => {
    if (stepNo > 3) {
      props.authComplete();
    }
  }, [stepNo]);

  const sendStatus = (status: any) => {
    socketInstance.emit("chat", {
      evt: "chat",
      room: room,
      text: JSON.stringify({
        msgType: "STU_LIVE_REP",
        msg: { stuId: props.userId, status: status },
      }),
    });
  };

  const sendSignal = (stage: any) => {
    sendStatus(stage);

    socketInstance.on("chat", (data: any) => {
      console.log("AuthModal", data);
    });
  };

  // useEffect(() => {
  //   if (socketInstance) {
  //   }
  // }, [socketInstance]);

  const handleSocketConnection = (socket: any) => {
    setSocketInstance(socket);
    socket.emit("chat", {
      evt: "chat",
      room: room,
      text: JSON.stringify({
        msgType: "STU_LIVE_REP",
        msg: { stuId: props.userId, status: steps[stepNo].name },
      }),
    });

    socket.on("chat", (data: any) => {
      if (data.type === "chat") {
        let msg = JSON.parse(data.message);
        if (msg.msgType === "STU_LIVE_REQ") {
          let stuIds = msg.msg.stuIds;
          let stuId = stuIds.find((id: any) => id === props.userId);
          if (stuId) {
            socket.emit("chat", {
              evt: "chat",
              room: room,
              text: JSON.stringify({
                msgType: "STU_LIVE_REP",
                msg: { stuId: props.userId, status: steps[stepNo].name },
              }),
            });
          }
        }

        if (msg.msgType === "STU_AUTHED") {
          let stuId = msg.msg.stuId;
          if (stuId === props.userId) {
            props.getStuAuthStatus({ status: "AUTHED", stuId: stuId });
            setStuAuthenticated(true);
          }
        }
      }
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
      component: <PrivacyPolicy isChecked={isAgree} />,
    },
    {
      name: "Rules",
      component: (
        <QuizRules quizConfig={props.quizConfig} isChecked={isAgree} />
      ),
    },
    // {
    //   name: "Authentication",
    //   component: <AuthenticateUser authConfigs={authConfigurations} userName={props.userName} quizTitle={props.quizTitle}/>,
    // },
  ];

  useEffect(() => {
    if (props.quizConfig) {
      let config = {} as any;
      config["studentPicture"] = props.quizConfig.studentPicture;
      config["studentIdDl"] = props.quizConfig.studentIdDl;
      config["roomScan"] = props.quizConfig.roomScan;
      config["otp"] = props.quizConfig.otp;
      config["examdLiveLaunch"] = props.quizConfig.examdLiveLaunch;

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
              // socket={socketInstance}
            />
          ),
        });
      }
      setQuizSteps(steps);
      setAuthConfigurations(config);
    }
  }, []);

  useEffect(() => {
    if (stepNo === quizSteps.length - 1) {
      setStuAuthenticated(true);
      props.authComplete();
      return;
    }
  }, [stepNo]);

  const handleNext = () => {
    sendStatus(quizSteps[stepNo + 1].name);
    setStepName(quizSteps[stepNo + 1].name);
    setStepNo((prevState: any) => prevState + 1);
    setButtonDisabled(true);
  };

  const closeMediaResources = async () => {
    //close media resources;
    let device = await navigator.mediaDevices.getUserMedia({ video: true });
    if (device.active) {
      device.getTracks().forEach((track: any) => {
        track.stop();
      });
    }
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
        window.location.reload();
        close(false);
      }}
      footer={
        stepNo >= 0 && stepNo < quizSteps.length - 1
          ? [
              <Button key="close" onClick={() => close(false)}>
                Close
              </Button>,
              <Button key="next" onClick={handleNext} disabled={buttonDisabled}>
                Next
              </Button>,
            ]
          : stepNo === steps.length && [
              <Button
                key="close"
                onClick={() => {
                  closeMediaResources();
                  close(false);
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
