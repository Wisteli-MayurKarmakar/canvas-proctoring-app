
import React from "react";
import OtpVerification from "../AuthenticationScreens/OtpVerification";
import RoomScan from "../AuthenticationScreens/RoomScan";
import LiveAuthentication from "../AuthenticationScreens/LiveAuthentication";
import StudentIdDlVerification from "../AuthenticationScreens/StudentIdDlVerification";

interface Props {
  authConfigs: any;
  quizTitle: any;
  userId: string;
  courseId: string;
  quizId: string;
  authToken: any;
  guid: any;
  studentId: string;
  student: any;
  authStatus: (status: boolean) => void;
  // socket: any;
}

const handleLiveAuthentication = (
  status: boolean,
  authSteps: {
    [key: string]: any;
  }[],
  currentStep: number,
  authStatus: (flag: boolean) => void,
  setCurrentStep: (step: number) => void,
) => {
  if (currentStep === authSteps.length - 1) {
    if (status) {
      authStatus(true);
    }
  } else {
    setCurrentStep(authSteps.length - 1);
  }
};

const handleAiAuthentication = (
  status: boolean,
  authSteps: {
    [key: string]: any;
  }[],
  currentStep: number,
  authStatus: (flag: boolean) => void,
  setCurrentStep: (step: number) => void
) => {
  if (currentStep === authSteps.length - 1) {
    authStatus(true);
  } else {
    setCurrentStep(currentStep + 1);
  }
};

const handleRmVideSent = (
  status: boolean,
  authSteps: {
    [key: string]: any;
  }[],
  currentStep: number,
  authStatus: (flag: boolean) => void,
  setCurrentStep: (step: number) => void
) => {
  if (status) {
    if (currentStep === authSteps.length - 1) {
      authStatus(true);
    } else {
      setCurrentStep(currentStep + 1);
    }
  }
};

const handleOtpVerification = (
  status: boolean,
  currentStep: number,
  setCurrentStep: (step: number) => void,
  authSteps: {
    [key: string]: any;
  }[],
  authStatus: (flag: boolean) => void
) => {
  if (currentStep === authSteps.length - 1) {
    authStatus(true);
  } else {
    setCurrentStep(currentStep + 1);
  }
};

const StudentAuthentication: React.FC<Props> = (props): JSX.Element => {
  let [currentStep, setCurrentStep] = React.useState<number>(0);

  const prepareAuthSteps = () => {
    if (!props.authConfigs) {
      return [];
    }

    let steps: {
      [key: string]: any;
    }[] = [];

    if (props.authConfigs.roomScan) {
      steps.push({
        name: "Room Scan",
        key: "roomScan",
        component: (
          <RoomScan
            authToken={props.authToken}
            guid={props.guid}
            studentId={props.studentId}
            courseId={props.courseId}
            quizId={props.quizId}
            rmVideoSent={(status) =>
              handleRmVideSent(
                status,
                steps,
                currentStep,
                props.authStatus,
                setCurrentStep
              )
            }
          />
        ),
      });
    }

    if (props.authConfigs.otp) {
      steps.push({
        name: "OTP Verification",
        key: "otp",
        component: (
          <OtpVerification
            authToken={props.authToken}
            guid={props.guid}
            studentId={props.studentId}
            student={props.student}
            quizTitle={props.quizTitle}
            otpVerified={(status) =>
              handleOtpVerification(
                status,
                currentStep,
                setCurrentStep,
                steps,
                props.authStatus
              )
            }
          />
        ),
      });
    }

    if (props.authConfigs.studentIdDl || props.authConfigs.studentPicture) {
      let name: string = "Student Profile Picture Verification";

      if (props.authConfigs.studentIdDl && props.authConfigs.studentPicture) {
        name = "Student Profile Picture and ID/DL Verification";
      }

      if (!props.authConfigs.studentPicture && props.authConfigs.studentIdDl) {
        name = "Student ID/ DL Verification";
      }

      steps.push({
        name: name,
        key: "studentIdDl",
        component: (
          <StudentIdDlVerification
            authConfigs={props.authConfigs}
            authToken={props.authToken}
            userId={props.userId}
            guid={props.guid}
            studentId={props.studentId}
            handleAuth={(status) =>
              handleAiAuthentication(
                status,
                steps,
                currentStep,
                props.authStatus,
                setCurrentStep
              )
            }
          />
        ),
      });
    }

    if (props.authConfigs.instructorProctored && !props.authConfigs.examdLiveLaunch) {
      steps.push({
        name: "Live Authentication",
        key: "Live",
        component: (
          <LiveAuthentication
            courseId={props.courseId}
            quizId={props.quizId}
            userId={props.studentId}
            authConfigs={props.authConfigs}
            isLiveAuthed={(status) =>
              handleLiveAuthentication(
                status,
                steps,
                currentStep,
                props.authStatus,
                setCurrentStep,
              )
            }
          />
        ),
      });
    }

    return steps;
  };

  let steps = prepareAuthSteps();

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      {steps.length > 0 && (
        <>
          <p className="text-center text-xl font-bold">
            {steps[currentStep].name}
          </p>
          {steps[currentStep].component}
        </>
      )}
    </div>
  );
};

export default StudentAuthentication;
