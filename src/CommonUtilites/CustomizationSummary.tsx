import React from "react";
import { defaultProcSettings } from "../CommonUtilites/ProctorSettingDefaults";
import { CheckSquareOutlined, CloseCircleOutlined } from "@ant-design/icons";

type Props = {
  quickConfig: string;
  quizConfig: any;
  handleSave: () => void;
};

const abbrs: any = {
  "Recording Options": {
    recordWebcam: false,
    recordScreen: false,
    recordAudio: false,
    chat: false,
  },
  "Verification Options": {
    studentPicture: false,
    studentIdDl: false,
    roomScan: false,
    otp: false,
  },
  "Student Resources": {
    calculatorAllowed: false,
    scratchPadAllowed: false,
    liveHelp: false,
    whitelistPages: false,
  },
  "Lock Down Options": {
    disableCopyPaste: false,
    disablePrinting: false,
    lockdownBrowser: false,
  },
  "Violation Options": {
    multiplePerson: false,
    cellPhone: false,
    noPersonInRoom: false,
    speaking: false,
  },
  "Proctor Options": {
    postExamReview: false,
    examdLiveLaunch: false,
    instructorProctored: false,
    examdProctored: false,
  },
};

const settingOptions: any = {
  "Recording Options": {
    recordWebcam: {
      fullName: "Record Webcam",
    },
    recordScreen: {
      fullName: "Record Screen",
    },
    recordAudio: {
      fullName: "Record Audio",
    },
    chat: {
      fullName: "Chat",
    },
  },
  "Verification Options": {
    studentPicture: {
      fullName: "Student Picture",
    },
    studentIdDl: {
      fullName: "Student ID or DL",
    },
    roomScan: {
      fullName: "Room Scan",
    },
    otp: {
      fullName: "One Time Password",
    },
  },
  "Student Resources": {
    calculatorAllowed: {
      fullName: "Calculator",
    },
    scratchPadAllowed: {
      fullName: "Scratch Pad",
    },
    liveHelp: {
      fullName: "Live Help",
    },
    whitelistPages: {
      fullName: "Whitelist Pages",
    },
  },
  "Lock Down Options": {
    disableCopyPaste: {
      fullName: "Disable Copy/ Paste",
    },
    disablePrinting: {
      fullName: "Disable Printing",
    },
    lockdownBrowser: {
      fullName: "Lock Down Browser",
    },
  },
  "Violation Options": {
    multiplePerson: {
      fullName: "Multiple Person",
    },
    cellPhone: {
      fullName: "Cell Phone",
    },
    noPersonInRoom: {
      fullName: "No Person In Room",
    },
    speaking: {
      fullName: "Speaking",
    },
  },
  "Proctor Options": {
    postExamReview: {
      fullName: "Post Exam Review",
    },
    examdLiveLaunch: {
      fullName: "Examd Live Launch",
    },
    instructorProctored: {
      fullName: "Instructor Proctored",
    },
    examdProctored: {
      fullName: "Examd Proctored",
    },
  },
};

const CustomizationSummary: React.FC<Props> = (props): JSX.Element => {
  let customizations: any = [];
  let configKeys: string[] = [
    "Recording Options",
    "Verification Options",
    "Student Resources",
    "Lock Down Options",
    "Violation Options",
    "Proctor Options",
  ];

  if (props.quickConfig || props.quizConfig) {
    let configurations: any = null;
    let res: any = [];
    if (props.quickConfig !== "") {
      configurations = defaultProcSettings.filter(
        (item: any) => item.name === props.quickConfig && item.settings
      );
      configKeys.forEach((key: string) => {
        let configObj: any = { name: key, config: [] };
        Object.keys(settingOptions[key]).forEach((item: any, index: number) => {
          configObj.config.push(
            <div
              className="flex flex-row h-full items-center gap-8"
              key={index}
            >
              <p className="font-semibold text-start w-1/2 capitalize">
                {settingOptions[key][item].fullName}
              </p>
              {configurations[0].settings[item] ? (
                <CheckSquareOutlined
                  style={{ background: "lightgreen", fontSize: 20 }}
                />
              ) : (
                <CloseCircleOutlined style={{ color: "red", fontSize: 20 }} />
              )}
            </div>
          );
        });
        res.push(configObj);
      });
    } else {
      configKeys.forEach((key: string) => {
        let configObj: any = { name: key, config: [] };
        Object.keys(settingOptions[key]).forEach((item: any, index: number) => {
          configObj.config.push(
            <div
              className="flex flex-row h-full items-center gap-8"
              key={index}
            >
              <p className="font-semibold text-start w-1/2 capitalize">
                {settingOptions[key][item].fullName}
              </p>
              {props.quizConfig[item] ? (
                <CheckSquareOutlined
                  style={{ background: "lightgreen", fontSize: 20 }}
                />
              ) : (
                <CloseCircleOutlined style={{ color: "red", fontSize: 20 }} />
              )}
            </div>
          );
        });
        res.push(configObj);
      });
    }

    customizations = [...res];
  }

  if (customizations.length > 0) {
    return (
      <div className="flex flex-col w-full justify-center gap-8">
        <div className="grid grid-cols-2 w-full content-center items-center lg:grid-cols-3 gap-4">
          {customizations.map((item: any, index: number) => {
            return (
              <div
                className="flex flex-col w-full justify-start gap-1"
                key={index}
              >
                <p className="text-lg text-left font-bold mb-2 underline">
                  {item.name}
                </p>
                {item.config.map((item: any) => item)}
              </div>
            );
          })}
        </div>
        {props.quickConfig !== "" && (
          <div className="flex space-x-2 justify-start">
            <button
            onClick={props.handleSave}
              type="button"
              className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <p className="text-center text-blue-400 text-xl">
      No Customization Summary available...
    </p>
  );
};

export default CustomizationSummary;
