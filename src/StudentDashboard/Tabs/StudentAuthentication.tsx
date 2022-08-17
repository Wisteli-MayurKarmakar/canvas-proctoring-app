import axios from "axios";
import React, { useEffect } from "react";
import OtpVerification from "../AuthenticationScreens/OtpVerification";
import RoomScan from "../AuthenticationScreens/RoomScan";
import LiveAuthentication from "../AuthenticationScreens/LiveAuthentication";
import StudentIdDlVerification from "../AuthenticationScreens/StudentIdDlVerification";

interface Props {
  authConfigs: any;
  quizTitle: string;
  userId: string;
  courseId: string;
  quizId: string;
  // socket: any;
}

const StudentAuthentication: React.FC<Props> = (props): JSX.Element => {
  let [authSteps, setAuthSteps] = React.useState<any>(null);
  let [stepsLength, setStepsLength] = React.useState<any>(null);
  let [currentStep, setCurrentStep] = React.useState<number>(0);

  const prepareAuthSteps = () => {
    let steps: any = [];
    if (props.authConfigs.examdLiveLaunch) {
      steps.push({
        name: "Live Authentication",
        component: (
          <LiveAuthentication
            courseId={props.courseId}
            quizId={props.quizId}
            userId={props.userId}
            authConfigs={props.authConfigs}
          />
        ),
      });
    }
    if (props.authConfigs.otp) {
      steps.push({
        name: "OTP Verification",
        component: <OtpVerification />,
      });
    }
    if (props.authConfigs.roomScan) {
      steps.push({
        name: "Room Scan",
        component: <RoomScan />,
      });
    }

    if (props.authConfigs.studentIdDl || props.authConfigs.studentPicture) {
      steps.push({
        name: "Student Id/Dl Verification",
        component: <StudentIdDlVerification authConfigs={props.authConfigs} />,
      });
    }
    setStepsLength(steps.length);
    setAuthSteps(steps);
  };

  useEffect(() => {
    console.log("props", props.authConfigs);
    prepareAuthSteps();
  }, []);
  return (
    <div className="flex flex-row gap-40 mt-24 items-center justify-center">
      {authSteps && (
        <div>
          <p className="text-center">{authSteps[currentStep].name}</p>
          {authSteps[currentStep].component}
        </div>
      )}
    </div>
  );
};

export default StudentAuthentication;
