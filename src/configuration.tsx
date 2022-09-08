import React, { useEffect } from "react";
import {
  AudioOutlined,
  CalculatorOutlined,
  ChromeOutlined,
  CommentOutlined,
  CopyOutlined,
  DesktopOutlined,
  IdcardOutlined,
  IeOutlined,
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
import SettingsModal from "./settingsModal";
import { message } from "antd";

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

interface endPointsProto {
  [key: string]: string;
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
  let [infoMsg, setInfoMsg] = React.useState("");
  let [checked, setChecked] = React.useState<checkTypes>(abbrs);
  let [showInfoModal, setShowInfoModal] = React.useState(false);
  let [userSettings, setUserSettings] = React.useState<any>({});
  let [applySettings, setApplySettings] = React.useState<boolean>(false);
  const [quizzes, setQuizzes] = React.useState<any>(null);
  const [selectedQuiz, setSelectedQuiz] = React.useState<any>(null);
  let [quizSettings, setQuizSettings] = React.useState<any>(null);
  let [configSaveStatus, setConfigSaveStatus] = React.useState<boolean>(false);
  let [defaultSettingsOptionsChecked, setDefaultSettingsOptionsChecked] =
    React.useState<any>(null);

  const borderColorOnSelect = "#12b0ff";
  const defaultBorderColor = "#949799";

  const resetOptionSelection = (option: string) => {
    let selectables: optionCheckedProto = { ...(checked[option] as {}) };
    for (let key in selectables) {
      selectables[key] = false;
    }
    setChecked({ ...checked, [option]: selectables });
  };

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

  const checkIfVerificationOptSelected = (): boolean => {
    let flag: boolean = false;
    let verificationOpt: optionCheckedProto = {
      ...(checked["Verification Options"] as {}),
    };
    for (let key in verificationOpt) {
      if (verificationOpt[key]) {
        flag = true;
      }
    }
    if (flag) {
      alert(
        "Please disable all AI authentication options before enabling Examd Live Launch"
      );
      return true;
    }
    return false;
  };

  const checkIfProctorOptionsSelected = () => {
    let flag: boolean = false;
    let proctorOptions: optionCheckedProto = {
      ...(checked["Proctor Options"] as {}),
    };

    Object.keys(proctorOptions).forEach((key) => {
      if (key === "examdLiveLaunch") {
        if (proctorOptions[key]) {
          flag = true;
        }
      }
    });

    if (flag) {
      alert(
        "Please disable Examd Live Launch options before enabling an AI Authenction option"
      );
      return true;
    }

    return false;
  };

  const handleOptionClick = (option: string, subOption: string) => {
    if (defaultSettingsOptionsChecked["Default Proctoring"]) {
      if (subOption === "examdLiveLaunch") {
        message.error(
          "Cannot select Examd Live Launch option with Default Proctoring"
        );
        return;
      }
    }

    if (defaultSettingsOptionsChecked["Default w/ Live launch"]) {
      if (subOption === "studentIdDl" || subOption === "studentPicture") {
        message.error(
          "Cannot select any AI authentication option with Live Launch Proctoring"
        );
        return;
      }
    }

    if (
      defaultSettingsOptionsChecked["Default w/ Live Proctoring"] ||
      defaultSettingsOptionsChecked["Lock down Browser"]
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
    // if (subOption === "examdLiveLaunch") {
    //   let res = checkIfVerificationOptSelected();
    //   if (res) {
    //     let checkedOptions: optionCheckedProto = { ...(optionsStatus as {}) };
    //     checkedOptions[option] = false;
    //     setOptionsStatus(checkedOptions);
    //     return;
    //   }
    // }

    // if (option === "Verification Options") {
    //   let res = checkIfProctorOptionsSelected();
    //   if (res) {
    //     return;
    //   }
    // }

    let options: optionCheckedProto = { ...(checked[option] as {}) };
    let flag = true;

    if (optionsStatus[option] === false) {
      alert(`Please enable ${option} first`);
      return;
    }

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

  const handleSubmit = () => {
    if (!selectedQuiz) {
      alert("Please select a quiz");
      return;
    }
    let flag = true;
    let option = null;
    let optionsEnabled: string[] = [];
    Object.keys(optionsStatus).forEach((option: string) => {
      if (optionsStatus[option] === true) {
        optionsEnabled.push(option);
      }
    });

    let optionsChoosen: string[] = [];
    Object.keys(checked).map((option: string) => {
      Object.keys(checked[option]).forEach((subOption: string) => {
        if (checked[option][subOption] === true) {
          optionsChoosen.push(subOption);
        }
      });
    });
    for (let key in optionsStatus) {
      if (!optionsStatus[key]) {
        flag = false;
      } else {
        flag = true;
        option = key;
        break;
      }
    }

    if (flag && option) {
      flag = false;
      for (let key in checked[option]) {
        if (checked[option][key]) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        alert(`Please select any one option to submit.`);
        return;
      }
    } else {
      alert(`Please select any one option to submit.`);
      return;
    }

    // if (optionsEnabled.length !== optionsChoosen.length) {
    //   alert(`Please select an options for the enabled option.`);
    //   return;
    // }

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

    axios
      .post(
        "https://examd-dev.uc.r.appspot.com/student/api/v1/saveLtiCanvasConfig",
        allOptions,
        {
          headers: { Authorization: `Bearer ${props.auth.data.access_token}` },
        }
      )
      .then((res) => {
        message.success("Configurations saved successfully");
        // setShowInfoModal(true);
        setConfigSaveStatus(true);
      })
      .catch((err) => {
        setConfigSaveStatus(false);
        message.error(
          "Something went wrong while saving. Please try again later."
        );
        // setShowInfoModal(true);
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
        `https://examd-dev.uc.r.appspot.com/student/api/v1/getLtiCanvasConfigByGuidCourseIdQuizId?guid=${[
          props.toolConsumerGuid,
        ]}&courseId=${props.courseId}&quizId=${quizId}`,
        {
          headers: {
            Authorization: `Bearer ${props.auth.data.access_token}`,
          },
        }
      )
      .then((res) => {
        setUserSettings(res.data);
        setQuizSettings(res.data);
        applyUserSettings(res.data);
        setApplySettings(false);
      })
      .catch((err) => {
        console.log(err);
        setOptionsEnableSwitchStatus();
        setDefaultCheckedStatus();
      });
  };
  const getQuizzesByCourseId = (id: string): void => {
    axios
      .get(
        `https://examd-dev.uc.r.appspot.com/student/api/v1/fetchCanvasQuizzesByCourseId/${id}`,
        {
          headers: {
            Authorization: `Bearer ${props.reqToken}`,
          },
        }
      )
      .then((res) => {
        let quizzesStatus: any = {};
        res.data.forEach((quiz: any) => {
          quizzesStatus[quiz.title] = false;
        });
        setQuizzes(res.data);
        setQuizzesStat(quizzesStatus);
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
    getUserSettings("");
    prepareDefaultSettingsOptionsChecked();
  }, []);

  const handleSelectQuiz = (quiz: any) => {
    setSelectedQuiz(quiz);
    let quizStat: any = { ...quizzesStat };

    Object.keys(quizStat).forEach((key: string) => {
      quizStat[key] = false;
    });

    quizStat[quiz.title] = true;
    setQuizzesStat(quizStat);
    getUserSettings(quiz.id);
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

    if (optionName === "Default Proctoring") {
      let res: boolean = checkExamLiveLaunchSelected();
      if (res) {
        let checkedOptions = { ...checked };
        checkedOptions["Proctor Options"]["examdLiveLaunch"] = false;
        setChecked(checkedOptions);
      }
    }

    if (optionName === "Default w/ Live launch") {
      let res: boolean = checkPhotoIdSelected();

      if (res) {
        let checkedOptions = { ...checked };
        checkedOptions["Verification Options"]["studentIdDl"] = false;
        checkedOptions["Verification Options"]["studentPicture"] = false;
        setChecked(checkedOptions);
      }
    }

    if (optionName === "Default w/ Live Proctoring") {
      let res: boolean = checkPhotoIdAndLiveLaunchSelected();

      if (res) {
        let checkedOptions = { ...checked };
        checkedOptions["Proctor Options"]["examdLiveLaunch"] = false;
        setChecked(checkedOptions);
      }
    }

    if (optionName === "Lock down Browser") {
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
    } else {
      setDefaultSettingsOptionsChecked({
        ...defaultSettingsOptionsChecked,
        [optionName]: false,
      });
      applyUserSettings(quizSettings);
    }
  };

  return (
    <div className="flex flex-col gap-5 justify-center items-center mt-5 text-center container text-lg">
      <div className="flex flex-row flex-wrap gap-10">
        {quizzes ? (
          quizzes.map((quiz: any, index: number) => {
            return (
              <div
                style={{
                  cursor: "pointer",
                }}
                key={index}
                onClick={() => handleSelectQuiz(quiz)}
                className={`block p-6 max-w-sm bg-white rounded-lg border ${
                  quizzesStat[quiz.title]
                    ? "border-blue-400 border-4"
                    : "border-gray-200"
                } hover:bg-gray-100 dark:${
                  quizzesStat[quiz.title]
                    ? "border-blue-400"
                    : "border-gray-700"
                } dark:hover:bg-gray-300`}
              >
                <h1>{quiz.title}</h1>
                <p>Type: {quiz.quiz_type}</p>
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
      <div className="flex flex-row gap-10 h-24 lg:w-full md:w-screen sm:w-screen md:pl-4 md:pr-4 sm:pl-2 sm:pr-2 items-center justify-center">
        <div className="flex lg:flex-row md:flex-row sm:flex-col items-center justify-center box-border h-full w-full border-4 border-blue-400 rounded">
          {defaultSettingsOptionsChecked &&
            defaultProcSettings.map((setting: any, index: number) => {
              return (
                <label
                  htmlFor={setting.name}
                  className="flex items-center cursor-pointer"
                  key={index}
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      value=""
                      id={setting.name}
                      className="sr-only"
                      onChange={(e) =>
                        handleCheckboxChange(e, index, setting.name)
                      }
                      checked={defaultSettingsOptionsChecked[setting.name]}
                    />
                    <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                    <div className="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition border-2 border-gray-400"></div>
                  </div>
                  {/* <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4   peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div> */}
                  <div className="ml-1 mr-5 text-gray-700 font-semibold lg:text-lg md:text-baseline sm:text-sm">
                    {setting.name}
                  </div>
                </label>
              );
            })}
        </div>
      </div>
      <div className="container mx-auto pt-2">
        <p className="font-bold font-serif text-xl underline">
          {selectedQuiz && selectedQuiz.title + ":    "}Configuration
        </p>
        <div
          className="pt-3 container overflow-y-scroll"
          style={{ height: "76vh" }}
        >
          {Object.keys(settingOptions).map((key: string) => (
            <div key={key} className="row-span-full pb-2">
              <div className="flex gap-3">
                <b className="font-bold font-serif">{key}</b>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckDefault"
                    checked={
                      Object.keys(optionsStatus).length > 0 &&
                      optionsStatus[key]
                    }
                    onClick={(e) => handleChange(key, e)}
                  />
                </div>
              </div>
              <div className="flex flex-row gap-6">
                {Object.keys(settingOptions[key]).map(
                  (subKey: string, idx: number) => (
                    <div key={idx}>
                      <div
                        className="box-border h-32 w-32 p-4 border-4"
                        onClick={() => handleOptionClick(key, subKey)}
                        style={{
                          borderColor:
                            Object.keys(checked).length > 0 &&
                            checked[key][subKey]
                              ? borderColorOnSelect
                              : defaultBorderColor,
                        }}
                      >
                        <div className="text-7xl flex items-start justify-center align-middle">
                          {settingOptions[key][subKey].icon}
                        </div>
                      </div>
                      <p className="text-center">
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
        {/* {showInfoModal && configSaveStatus && (
          <SettingsModal
            view={showInfoModal}
            close={() => setShowInfoModal(false)}
            message={infoMsg}
            status={configSaveStatus}
          />
        )} */}
      </div>
    </div>
  );
};

export default Configuration;
