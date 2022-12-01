import React, { useEffect, useRef, useState } from "react";
import {
  AudioOutlined,
  CalculatorOutlined,
  ChromeOutlined,
  CommentOutlined,
  CopyOutlined,
  DesktopOutlined,
  IdcardOutlined,
  IeOutlined,
  InfoCircleFilled,
  InteractionOutlined,
  KeyOutlined,
  PhoneOutlined,
  PrinterOutlined,
  ProjectOutlined,
  RobotOutlined,
  RocketOutlined,
  ScanOutlined,
  SnippetsOutlined,
  SoundOutlined,
  TeamOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

import ExamdLogo from "./ExamdLogo.png";
import axios from "axios";
import InfoModal from "./infoModal";
import { defaultProcSettings } from "./CommonUtilites/ProctorSettingDefaults";
import "./configuration.css";
import {
  autoCompleteSetup,
  saveLtiCanvasConfig,
  getLtiCanvasConfigByGuidCourseIdQuizId,
  fetchCanvasQuizzesByCourseId,
} from "./apiConfigs";
import { message, Tooltip } from "antd";
import CustomizationSummary from "./CommonUtilites/CustomizationSummary";
import { useQuizStore } from "./store/QuizStore";
import WaitingModal from "./CommonUtilites/WaitingModal";
import { useAppStore } from "./store/AppSotre";

interface Props {
  auth: Object | any;
  id: any;
  courseId: any;
  reqToken: any;
  toolConsumerGuid: any;
}

interface settingStruct {
  [key: string]: {
    [key: string]: {
      fullName: string;
      icon: React.ReactElement;
    };
  };
}

interface checkTypes {
  [key: string]: {
    [key: string]: boolean;
  };
}

interface optionCheckedProto {
  [key: string]: boolean;
}

interface subOptionsProto {
  [key: string]: boolean;
}
interface objProto {
  [key: string]: subOptionsProto;
}

interface settingOptionsStatus {
  [key: string]: any;
}

const abbrs = {
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

const iconSize = "";

const settingOptions: settingStruct = {
  "Recording Options": {
    recordWebcam: {
      fullName: "Record Webcam",
      icon: <VideoCameraOutlined style={{ fontSize: iconSize }} />,
    },
    recordScreen: {
      fullName: "Record Screen",
      icon: <DesktopOutlined style={{ fontSize: iconSize }} />,
    },
    recordAudio: {
      fullName: "Record Audio",
      icon: <AudioOutlined style={{ fontSize: iconSize }} />,
    },
    chat: {
      fullName: "Chat",
      icon: <CommentOutlined style={{ fontSize: iconSize }} />,
    },
  },
  "Verification Options": {
    studentPicture: {
      fullName: "Student Picture",
      icon: <UserOutlined style={{ fontSize: iconSize }} />,
    },
    studentIdDl: {
      fullName: "Student ID or DL",
      icon: <IdcardOutlined style={{ fontSize: iconSize }} />,
    },
    roomScan: {
      fullName: "Room Scan",
      icon: <ScanOutlined style={{ fontSize: iconSize }} />,
    },
    otp: {
      fullName: "One Time Password",
      icon: <KeyOutlined style={{ fontSize: iconSize }} />,
    },
  },
  "Student Resources": {
    calculatorAllowed: {
      fullName: "Calculator",
      icon: <CalculatorOutlined style={{ fontSize: iconSize }} />,
    },
    scratchPadAllowed: {
      fullName: "Scratch Pad",
      icon: <SnippetsOutlined style={{ fontSize: iconSize }} />,
    },
    liveHelp: {
      fullName: "Live Help",
      icon: <RobotOutlined style={{ fontSize: iconSize }} />,
    },
    whitelistPages: {
      fullName: "Whitelist Pages",
      icon: <IeOutlined style={{ fontSize: iconSize }} />,
    },
  },
  "Lock Down Options": {
    disableCopyPaste: {
      fullName: "Disable Copy/ Paste",
      icon: <CopyOutlined style={{ fontSize: iconSize }} />,
    },
    disablePrinting: {
      fullName: "Disable Printing",
      icon: <PrinterOutlined style={{ fontSize: iconSize }} />,
    },
    lockdownBrowser: {
      fullName: "Lock Down Browser",
      icon: <ChromeOutlined style={{ fontSize: iconSize }} />,
    },
  },
  "Violation Options": {
    multiplePerson: {
      fullName: "Multiple Person",
      icon: <TeamOutlined style={{ fontSize: iconSize }} />,
    },
    cellPhone: {
      fullName: "Cell Phone",
      icon: <PhoneOutlined style={{ fontSize: iconSize }} />,
    },
    noPersonInRoom: {
      fullName: "No Person In Room",
      icon: <InteractionOutlined style={{ fontSize: iconSize }} />,
    },
    speaking: {
      fullName: "Speaking",
      icon: <SoundOutlined style={{ fontSize: iconSize }} />,
    },
  },
  "Proctor Options": {
    postExamReview: {
      fullName: "Post Exam Review",
      icon: <ProjectOutlined style={{ fontSize: iconSize }} />,
    },
    examdLiveLaunch: {
      fullName: "Examd Live Launch",
      icon: <RocketOutlined style={{ fontSize: iconSize }} />,
    },
    instructorProctored: {
      fullName: "Instructor Proctored",
      icon: <IdcardOutlined style={{ fontSize: iconSize }} />,
    },
    examdProctored: {
      fullName: "Examd Proctored",
      icon: <img src={ExamdLogo} width={100} height={100} />,
    },
  },
};

const Configuration: React.FunctionComponent<Props> = (props): JSX.Element => {
  let [optionsStatus, setOptionsStatus] = React.useState<optionCheckedProto>(
    {}
  );
  let [quizzesStat, setQuizzesStat] = React.useState<any>();
  let [checked, setChecked] = React.useState<checkTypes>(abbrs);
  let [userSettings, setUserSettings] = React.useState<any>({});
  let [applySettings, setApplySettings] = React.useState<boolean>(false);
  const [quizzes, setQuizzes] = React.useState<any>(null);
  const [selectedQuiz, setSelectedQuiz] = React.useState<any>(null);
  let [quizSettings, setQuizSettings] = React.useState<any>(null);
  const [showWaitingModal, setShowWaitingModal] =
    React.useState<boolean>(false);
  const [showConfigurations, setShowConfigurations] =
    React.useState<boolean>(false);
  let [quizConfig, setQuizConfig] = React.useState<any>(null);
  let [configSaveStatus, setConfigSaveStatus] = React.useState<boolean>(false);
  let [defaultSettingsOptionsChecked, setDefaultSettingsOptionsChecked] =
    React.useState<any>(null);
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [quicKConfigSelected, setQuicKConfigSelected] = useState<string>("");
  let [isReset, setIsReset] = React.useState<boolean>(false);
  const { tokenData, courseDetails } = useAppStore((state) => state);
  const quizStoreState = useQuizStore((state) => state);
  const resetOptionSelection = (option: string) => {
    let selectables: optionCheckedProto = { ...(checked[option] as {}) };
    for (let key in selectables) {
      selectables[key] = false;
    }
    setChecked({ ...checked, [option]: selectables });
  };
  const waitingModalMessage: JSX.Element = (
    <div className="flex flex-row h-full w-full items-center justify-center gap-2">
      <p className="mx-atuo text-xl text-center font-bold">
        Setting up the quiz for proctoring. Please wait...
      </p>
      <div role="status">
        <svg
          className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-green-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );

  const handleChange = (option: string, e: any | null) => {
    let options: optionCheckedProto = { ...(optionsStatus as {}) };
    options[option] = e.target.checked;

    if (e.target.checked === false) {
      resetOptionSelection(option);
      setOptionsStatus(options);
      return;
    }
    setOptionsStatus(options);
  };

  const setDefaultCheckedStatus = () => {
    let checks: checkTypes = {};
    for (let key in settingOptions) {
      let subOptions: subOptionsProto = {};
      for (let subKey in settingOptions[key]) {
        subOptions[subKey] = false;
      }
      let obj: objProto = {
        [key]: subOptions,
      };
      Object.assign(checks, obj);
    }
    setChecked(checks);
  };

  const handleOptionClick = (option: string, subOption: string) => {
    if (optionsStatus[option] === false) {
      alert(`Please enable ${option} first`);
      return;
    }

    if (defaultSettingsOptionsChecked["AI Proctoring"]) {
      if (subOption === "examdLiveLaunch") {
        message.error(
          "Cannot select Examd Live Launch option with Default Proctoring"
        );
        return;
      }
    }

    if (defaultSettingsOptionsChecked["Live Launch"]) {
      if (subOption === "studentIdDl" || subOption === "studentPicture") {
        message.error(
          "Cannot select any AI authentication option with Live Launch Proctoring"
        );
        return;
      }
    }

    if (
      defaultSettingsOptionsChecked["Live Proctoring"] ||
      defaultSettingsOptionsChecked["Lockdown Browser"]
    ) {
      if (subOption === "examdLiveLaunch") {
        let res =
          checked["Verification Options"]["studentPicture"] ||
          checked["Verification Options"]["studentIdDl"];

        if (res) {
          message.error(
            "Please de-select AI authentication options before selecting Live Launch"
          );
          return;
        }
      }

      if (subOption === "studentPicture" || subOption === "studentIdDl") {
        let res = checked["Proctor Options"]["examdLiveLaunch"];

        if (res) {
          message.error(
            "Please de-select Live Launch options before selecting any AI authentication option"
          );
          return;
        }
      }
    }

    let options: optionCheckedProto = { ...(checked[option] as {}) };
    let flag = true;

    for (let key in options) {
      if (key === subOption && options[key]) {
        flag = false;
        options[key] = false;
      }
    }
    if (flag) {
      options[subOption] = true;
    }
    setChecked({ ...(checked as {}), [option]: options });
  };

  const setOptionsEnableSwitchStatus = () => {
    let status: settingOptionsStatus = {};
    Object.keys(settingOptions).forEach((option: string) => {
      status[option] = false;
    });
    setOptionsStatus(status);
  };

  function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  const handleAutoCompleteSetup = async () => {
    try {
      let response = await axios.get(
        `${autoCompleteSetup}${props.courseId}/${selectedQuiz.title}/${selectedQuiz.id}/${tokenData.lmsAccessToken}/${tokenData?.instituteId}`
      );
      setShowWaitingModal(false);
    } catch (e) {
      setShowWaitingModal(false);
    }
  };

  const handleSubmit = () => {
    if (!selectedQuiz) {
      alert("Please select a quiz");
      return;
    }
    let flag = true;
    let optionsEnabled: string[] = [];
    Object.keys(optionsStatus).forEach((option: string) => {
      if (optionsStatus[option] === true) {
        optionsEnabled.push(option);
      }
    });

    let optionsChoosen: string[] = [];
    Object.keys(checked).map((option: string) => {
      let optionEnabled: boolean = optionsEnabled.includes(option);
      let anyOptionSelected: boolean = false;
      Object.keys(checked[option]).forEach((subOption: string) => {
        if (checked[option][subOption] === true) {
          if (optionEnabled) {
            anyOptionSelected = true;
          }
          optionsChoosen.push(subOption);
        }
      });
      if (optionEnabled && !anyOptionSelected) {
        flag = false;
      }
    });

    if (!flag) {
      alert(`Please select any one option to submit.`);
      return;
    }

    let checkedOptions: checkTypes = { ...(checked as {}) };
    let allOptions: settingOptionsStatus = {};
    for (let key in checkedOptions) {
      for (let subKey in checkedOptions[key]) {
        allOptions[subKey] = checkedOptions[key][subKey];
      }
    }
    allOptions["idInstructor"] = "";
    allOptions["idLtiCanvasConfig"] = uuid();
    allOptions["idUser"] = props.id;
    allOptions["quizId"] = selectedQuiz.id;
    allOptions["toolConsumerInstanceGuid"] = props.toolConsumerGuid;
    allOptions["courseId"] = props.courseId;
    allOptions["assignmentId"] = 0;

    if (quizConfig) {
      allOptions["assignmentId"] = quizConfig.assignmentId;
    }

    axios
      .post(saveLtiCanvasConfig, allOptions, {
        headers: { Authorization: `Bearer ${tokenData.lmsAccessToken}` },
      })
      .then((res) => {
        if (allOptions["assignmentId"] === 0) {
          setShowWaitingModal(true);
          handleAutoCompleteSetup();
        }
        setQuizConfig(allOptions);
        message.success("Configurations saved successfully");
        setConfigSaveStatus(true);
      })
      .catch((err) => {
        setConfigSaveStatus(false);
        message.error(
          "Something went wrong while saving. Please try again later."
        );
        handleResetAll();
      });
  };

  const handleResetAll = () => {
    let checkOptions: checkTypes = { ...checked };
    let switchOptions: optionCheckedProto = { ...optionsStatus };
    for (let key in checkOptions) {
      let subOptions: optionCheckedProto = { ...checkOptions[key] };
      switchOptions[key] = false;
      for (let subKey in subOptions) {
        subOptions[subKey] = false;
      }
      checkOptions[key] = subOptions;
    }

    for (let key in switchOptions) {
      switchOptions[key] = false;
    }
    setChecked(checkOptions);
    setOptionsStatus(switchOptions);
    let defaultOptions: {
      [key: string]: boolean;
    } = { ...defaultSettingsOptionsChecked };
    for (let key in defaultOptions) {
      defaultOptions[key] = false;
    }
    setDefaultSettingsOptionsChecked(defaultOptions);
    setIsReset(true);
  };

  const applyUserSettings = (settings: any) => {
    let enabledOptions: string[] = Object.keys(settings as Object).filter(
      (key: string) => settings[key] && key
    );
    let checkOptions: checkTypes = { ...checked };

    for (let key in checkOptions) {
      let subOptions: optionCheckedProto = { ...checkOptions[key] };
      for (let subKey in subOptions) {
        subOptions[subKey] = false;
      }
      checkOptions[key] = subOptions;
    }

    let optSwitches: optionCheckedProto = { ...optionsStatus };

    for (let key in optSwitches) {
      optSwitches[key] = false;
    }

    enabledOptions.forEach((option) => {
      Object.keys(checkOptions).forEach((key) => {
        if (option in checkOptions[key]) {
          checkOptions[key][option] = true;
          if (!optSwitches[key]) {
            optSwitches[key] = true;
          }
        }
      });
    });
    setChecked(checkOptions);
    setOptionsStatus(optSwitches);
    setApplySettings(false);
  };

  const getUserSettings = (quizId: string | ""): void => {
    axios
      .get(
        `${getLtiCanvasConfigByGuidCourseIdQuizId}?guid=${[
          props.toolConsumerGuid,
        ]}&courseId=${props.courseId}&quizId=${quizId}`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.lmsAccessToken}`,
          },
        }
      )
      .then((res) => {
        setUserSettings(res.data);
        setQuizSettings(res.data);
        applyUserSettings(res.data);
        setApplySettings(false);
        setQuizConfig(res.data);
        setShowSummary(true);
      })
      .catch((err) => {
        setQuizConfig(null);
        setShowSummary(false);
        setOptionsEnableSwitchStatus();
        setDefaultCheckedStatus();
      });
  };
  const getQuizzesByCourseId = (id: string): void => {
    axios
      .get(
        `${fetchCanvasQuizzesByCourseId}${id}/${tokenData.lmsAccessToken}/${tokenData.instituteId}`
      )
      .then((res) => {
        let quizzesStatus: any = {};

        res.data.forEach((quiz: any) => {
          quizzesStatus[quiz.title] = false;
        });
        setQuizzes(res.data);
        setQuizzesStat(quizzesStatus);
        quizStoreState.setAllQuizzes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const prepareDefaultSettingsOptionsChecked = (): void => {
    let optionsChecked: any = {};

    defaultProcSettings.forEach((option: any) => {
      optionsChecked[option.name] = false;
    });
    setDefaultSettingsOptionsChecked(optionsChecked);
  };

  useEffect(() => {
    getQuizzesByCourseId(props.courseId);
    setOptionsEnableSwitchStatus();
    setDefaultCheckedStatus();
    prepareDefaultSettingsOptionsChecked();
  }, []);

  const handleSelectQuiz = (quiz: any) => {
    setSelectedQuiz(quiz);
    quizStoreState.setSelectedQuiz(quiz);
    setShowConfigurations(false);
    let quizStat: any = { ...quizzesStat };

    Object.keys(quizStat).forEach((key: string) => {
      quizStat[key] = false;
    });

    quizStat[quiz.title] = true;
    setQuizzesStat(quizStat);
    getUserSettings(quiz.id);
    setIsReset(false);
  };

  const resetOtherDefaultCheckedOptions = (optionName: string) => {
    let optionsChecked: any = { ...defaultSettingsOptionsChecked };
    optionsChecked[optionName] = true;
    Object.keys(optionsChecked).forEach((key: string) => {
      if (key !== optionName) {
        optionsChecked[key] = false;
      }
    });
    setDefaultSettingsOptionsChecked(optionsChecked);
  };

  const checkExamLiveLaunchSelected = (): boolean => {
    return checked["Proctor Options"]["examdLiveLaunch"];
  };

  const checkPhotoIdSelected = (): boolean => {
    let res1 = checked["Verification Options"]["studentIdDl"];
    let res2 = checked["Verification Options"]["studentPicture"];
    return res1 || res2;
  };

  const checkPhotoIdAndLiveLaunchSelected = (): boolean => {
    let res1 =
      checked["Verification Options"]["studentIdDl"] ||
      checked["Verification Options"]["studentPicture"];
    let res2 = checked["Proctor Options"]["examdLiveLaunch"];

    return res1 && res2;
  };

  const handleCheckboxChange = (e: any, idx: number, optionName: string) => {
    if (!selectedQuiz) {
      alert("Please select a quiz");
      return;
    }

    if (optionName === "AI Proctoring") {
      let res: boolean = checkExamLiveLaunchSelected();
      if (res) {
        let checkedOptions = { ...checked };
        checkedOptions["Proctor Options"]["examdLiveLaunch"] = false;
        setChecked(checkedOptions);
      }
    }

    if (optionName === "Live Launch") {
      let res: boolean = checkPhotoIdSelected();

      if (res) {
        let checkedOptions = { ...checked };
        checkedOptions["Verification Options"]["studentIdDl"] = false;
        checkedOptions["Verification Options"]["studentPicture"] = false;
        setChecked(checkedOptions);
      }
    }

    if (optionName === "Live Proctoring") {
      let res: boolean = checkPhotoIdAndLiveLaunchSelected();

      if (res) {
        let checkedOptions = { ...checked };
        checkedOptions["Proctor Options"]["examdLiveLaunch"] = false;
        setChecked(checkedOptions);
      }
    }

    if (optionName === "Lockdown Browser") {
      let res: boolean = checkPhotoIdAndLiveLaunchSelected();
      if (res) {
        let checkedOptions = { ...checked };
        checkedOptions["Proctor Options"]["examdLiveLaunch"] = false;
        setChecked(checkedOptions);
      }
    }

    if (e.target.checked) {
      let settings: any = { ...defaultProcSettings[idx].settings };
      resetOtherDefaultCheckedOptions(optionName);
      applyUserSettings(settings);
      setQuicKConfigSelected(optionName);
      if (!showConfigurations) {
        setShowSummary(true);
      }
    } else {
      setDefaultSettingsOptionsChecked({
        ...defaultSettingsOptionsChecked,
        [optionName]: false,
      });
      if (!quizStoreState.selectedQuizConfig) {
        handleResetAll();
      }
      setQuicKConfigSelected("");
      if (!showConfigurations) {
        setShowSummary(false);
      }
    }
  };

  const handleShowConfig = () => {
    if (selectedQuiz) {
      if (showConfigurations) {
        setShowConfigurations(false);
        setShowSummary(true);
      } else {
        setShowConfigurations(true);
        setShowSummary(false);
      }
    } else {
      message.error("Please select a quiz");
      return;
    }
  };

  return (
    <>
      {courseDetails.name && (
        <h2 className="text-center text-2xl underline">
          Course Name - {courseDetails.name}
        </h2>
      )}
      <div className="flex flex-col gap-5 justify-center items-center mt-5 text-center container text-lg">
        <div className="inline-flex flex-wrap gap-4 justify-center h-full w-full max-h-72 overflow-y-scroll pt-4">
          {quizzes ? (
            quizzes.map((quiz: any, index: number) => {
              return (
                <div
                  style={{
                    cursor: "pointer",
                  }}
                  key={index}
                  onClick={() => handleSelectQuiz(quiz)}
                  className={`transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-110 duration-200 
                flex border box-border items-center justify-center w-36 h-32 bg-white shadow-md text-center ${
                  quizzesStat[quiz.title]
                    ? "hover:bg-blue-400 hover:text-white bg-blue-400 text-white"
                    : "hover:bg-blue-400 hover:text-white text-black"
                } rounded`}
                >
                  <p className="font-semibold text-center break-words w-full p-2">
                    {quiz.title}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="flex gap-8">
              <p className="text-center">Fetching quizzes...</p>
              <div role="status">
                <svg
                  className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-green-500 "
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex border box-border shadow-md rounded flex-row gap-4 h-16 w-full items-center mt-4">
          <div className="flex flex-col md:flex-row w-full h-full gap-2 items-center justify-center p-2">
            {defaultSettingsOptionsChecked &&
              defaultProcSettings.map((setting: any, index: number) => {
                return (
                  <div
                    className="flex flex-col w-full justify-center gap-1"
                    key={index}
                  >
                    <div className="flex flex-row h-full w-full items-center justify-center gap-1">
                      <input
                        className="form-check-input appearance-none h-4 w-4 border self-center border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault"
                        onChange={(e) =>
                          handleCheckboxChange(e, index, setting.name)
                        }
                        checked={defaultSettingsOptionsChecked[setting.name]}
                      />
                      <Tooltip
                        placement="top"
                        title={setting.infoMsg}
                        className="pt-1"
                      >
                        <InfoCircleFilled
                          style={{ color: "rgb(96 165 250)" }}
                        />
                      </Tooltip>
                    </div>
                    <div className="mr-5 text-gray-700 font-semibold truncate">
                      {setting.name}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="flex flex-row h-full items-center gap-8">
          <p
            className="text-center text-blue-400 font-semibold cursor-pointer underline text-lg mt-4 mb-4"
            onClick={handleShowConfig}
          >
            {`${
              showConfigurations ? "Hide Customization" : "Edit Customization"
            }`}
          </p>
        </div>
        {showConfigurations && selectedQuiz && (
          <div className="container mx-auto mt-2">
            <p className="font-bold font-serif text-xl underline">
              {selectedQuiz && selectedQuiz.title + ":    "}Configuration
            </p>
            <div
              className="mt-4 container overflow-y-scroll"
              style={{ height: "76vh" }}
            >
              {Object.keys(settingOptions).map((key: string) => (
                <div key={key} className="row-span-full">
                  <div className="flex flex-row h-full items-center gap-2 mb-2 mt-4">
                    <b className="font-semibold">{key}</b>
                    <input
                      className="flex items-center justify-center"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckDefault"
                      checked={
                        Object.keys(optionsStatus).length > 0 &&
                        optionsStatus[key]
                      }
                      onChange={(e) => handleChange(key, e)}
                    />
                  </div>
                  <div className="flex flex-row gap-6">
                    {Object.keys(settingOptions[key]).map(
                      (subKey: string, idx: number) => (
                        <div key={idx}>
                          <div
                            className={`flex border box-border items-center justify-center h-32 w-32 bg-white shadow-lg rounded hover:bg-blue-400 hover:text-white 
                        cursor-pointer ${
                          Object.keys(checked).length > 0 &&
                          checked[key][subKey]
                            ? "bg-blue-400 text-white"
                            : "bg-white"
                        }`}
                            onClick={() => handleOptionClick(key, subKey)}
                          >
                            <div className="text-7xl flex items-start justify-center align-middle">
                              {settingOptions[key][subKey].icon}
                            </div>
                          </div>
                          <p className="text-center truncate w-32">
                            {settingOptions[key][subKey].fullName}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
              {applySettings && (
                <InfoModal
                  title="User settings"
                  message="Fetching user settings. Please wait."
                />
              )}
            </div>
            <div className="flex flex-row pt-4 gap-5 pb-4">
              <button
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Submit
              </button>
              <button
                onClick={handleResetAll}
                className="bg-transparent  text-blue-700 font-semibold  py-2 px-4 border border-blue-500  rounded"
              >
                Reset
              </button>
            </div>
          </div>
        )}
        {showSummary && (
          <CustomizationSummary
            quickConfig={quicKConfigSelected}
            quizConfig={quizConfig}
            handleSave={handleSubmit}
          />
        )}
        {showWaitingModal && (
          <WaitingModal
            visible={showWaitingModal}
            title="Setting up quiz"
            message={waitingModalMessage}
          />
        )}
      </div>
    </>
  );
};

export default Configuration;
