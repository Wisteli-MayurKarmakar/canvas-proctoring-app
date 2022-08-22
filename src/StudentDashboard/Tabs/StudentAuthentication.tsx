import axios from "axios";
import React, { useEffect } from "react";
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
  isStudentAuthed: any;
  // socket: any;
}

const StudentAuthentication: React.FC<Props> = (props): JSX.Element => {
  let [authSteps, setAuthSteps] = React.useState<any>(null);
  let [stepsLength, setStepsLength] = React.useState<any>(null);
  let [currentStep, setCurrentStep] = React.useState<number>(0);
  let [quizTitle, setQuizTitle] = React.useState<any>(null);

  const handleLiveAuthentication = (status: boolean) => {
    if (status) {
      props.isStudentAuthed(true);
    } else {
      props.isStudentAuthed(false);
    }
  }

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
            isLiveAuthed={handleLiveAuthentication}
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

  const handleNextStep = () => {
    if (currentStep < stepsLength - 1) {
      setCurrentStep((prevState: any) => prevState + 1);
    }
  };

  const startWebCam = () => {
    // navigator.mediaDevices.getUserMedia
  };

  useEffect(() => {
    startWebCam();
    prepareAuthSteps();
  }, []);

  return (
    <div className="flex flex-col gap-16 mt-12 items-center justify-center">
      {authSteps && (
        <div>
          <p className="text-center text-xl font-bold">
            {authSteps[currentStep].name}
          </p>
          {authSteps[currentStep].component}
        </div>
      )}
      {currentStep !== stepsLength - 1 && (
        <div className="flex space-x-2 justify-center">
          <button
            onClick={handleNextStep}
            type="button"
            className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentAuthentication;
