import { Button, message, Modal } from "antd";
import React, { useEffect } from "react";
import PrivacyPolicy from "../../StudentDashboard/Tabs/PrivacyPolicy";
import QuizRules from "../../StudentDashboard/Tabs/QuizRules";
import SystemCheck from "../../StudentDashboard/Tabs/SystemCheck";
import StudentAuthentication from "../../StudentDashboard/Tabs/StudentAuthentication";
import { useStudentStore } from "../../store/globalStore";
import { useWebCamStore } from "../../store/globalStore";
import { useAssignmentStore } from "../../store/StudentDashboardStore";

interface Props {
  view: boolean;
  quizTitle: string;
  close: () => void;
  quizId: string;
  userId: string;
  userName: string;
  quizConfig: Object | any;
  authComplete: () => void;
  courseId: string;
  // getStuAuthStatus: (data: any) => void;
  student: any;
  authToken: any;
  guid: any;
  studentId: string;
}

const AuthenticationModal: React.FC<Props> = (props): JSX.Element => {
  const [stepName, setStepName] = React.useState<string>("System Check");
  const [stepNo, setStepNo] = React.useState<number>(0);
  const [buttonDisabled, setButtonDisabled] = React.useState<boolean>(true);
  let [stuAuthenticated, setStuAuthenticated] = React.useState<boolean>(false);
  let [quizSteps, setQuizSteps] = React.useState<any>([]);
  const [authConfigurations, setAuthConfigurations] =
    React.useState<Object | null>(null);
  const [socketInstance, setSocketInstance] = React.useState<any>(null);
  let setStudAuthState = useStudentStore((state) => state.setQuizAuthObj);
  let authStepsCount = useStudentStore((state) => state.authStepsCount);
  let setAuthStepsCount = useStudentStore((state) => state.setAuthStepsCount);
  const selectedAssignment = useAssignmentStore(
    (state) => state.selectedAssignment
  );
  let stream = useWebCamStore((state) => state.stream);
  let studIdWODash = props.courseId + "_" + selectedAssignment?.id;
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
        sendAuthStatus(
          "STU_AUTH_STEP",
          quizSteps[stepNo].name,
          props.userId,
          selectedAssignment?.id as any
        );
      }
    });
  };

  const handleSocketConnection = (socket: any) => {
    setSocketInstance(socket);
  };

  const sendAuthStatus = (
    msgType: string,
    stepName: string,
    stuId: string,
    assignmentId: number
  ) => {
    socketInstance.emit("chat", {
      evt: "chat",
      room: room,
      text: JSON.stringify({
        msgType: msgType,
        msg: { stuId: stuId, stepName: stepName, assignmentId: assignmentId },
      }),
    });
  };

  const handleAuthStatus = (status: boolean) => {
    if (status) {
      setStuAuthenticated(status);
      setButtonDisabled(false);
      setStudAuthState({
        quizId: selectedAssignment?.id as any,
        studentAuthState: true,
      });
      props.authComplete();
    }
  };

  useEffect(() => {
    let steps: {
      [key: string]: any;
    }[] = [
      {
        name: "System Check",
        key: "systemCheck",
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
        key: "privacyPolicy",
        component: <PrivacyPolicy isChecked={isAgree} showAgree={true} />,
      },
      {
        name: "Rules",
        key: "rules",
        component: (
          <QuizRules quizConfig={props.quizConfig} isChecked={isAgree} />
        ),
      },
    ];
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
          key: "auth",
          component: (
            <StudentAuthentication
              authConfigs={config}
              quizTitle={props.quizTitle}
              userId={props.userId}
              courseId={props.courseId}
              quizId={props.quizId}
              authToken={props.authToken}
              guid={props.guid}
              studentId={props.studentId}
              authStatus={handleAuthStatus}
              student={props.student}
              // socket={socketInstance}
            />
          ),
        });
      }
      // setQuizSteps(steps);
    }
    sendStatus("System Check");
    setAuthStepsCount(steps.length - 1);

    if (steps.length <= 4) {
      setQuizSteps(steps);
      setAuthConfigurations(config);
    }
  }, []);

  useEffect(() => {
    if (authStepsCount === stepNo) {
      if (!buttonDisabled) {
        props.authComplete();
        setStudAuthState({
          quizId: selectedAssignment?.id as any,
          studentAuthState: true,
        });
        setStuAuthenticated(true);
      } else {
        setStuAuthenticated(false);
      }
    }
  }, [authStepsCount, stepNo, buttonDisabled]);

  const handleNext = () => {
    sendStatus(quizSteps[stepNo + 1].name);
    setStepName(quizSteps[stepNo + 1].name);
    setStepNo(stepNo + 1);
    setButtonDisabled(true);
    sendAuthStatus(
      "STU_AUTH_STEP",
      quizSteps[stepNo + 1].name,
      props.studentId,
      selectedAssignment?.id as any
    );
  };

  const closeWebCamResources = () => {
    if (stream?.active) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }

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
          <p>{props.quizTitle} - Authentication</p>
          <p> ({stepName})</p>
        </div>
      }
      visible={props.view}
      bodyStyle={{ maxHeight: "50%", height: 600, overflowY: "scroll" }}
      onCancel={() => {
        closeWebCamResources();
        props.close();
      }}
      footer={
        stepNo >= 0 && stepNo < quizSteps.length - 1
          ? [
              <Button key="close" onClick={() => props.close()}>
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
                  props.authComplete();
                  props.close();
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
