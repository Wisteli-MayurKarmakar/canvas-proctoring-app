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
  MonitorOutlined,
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
import {
  defaultProcSettings,
  disabledConfigOptions,
} from "./CommonUtilites/ProctorSettingDefaults";
import "./configuration.css";
import {
  autoCompleteSetup,
  saveLtiCanvasConfig,
  fetchCanvasQuizzesByCourseId,
  recoverQuiz,
} from "./apiConfigs";
import { message, Tooltip } from "antd";
import CustomizationSummary from "./CommonUtilites/CustomizationSummary";
import { useQuizStore } from "./store/QuizStore";
import WaitingModal from "./CommonUtilites/WaitingModal";
import { useAppStore } from "./store/AppSotre";
import {
  ConfigurationOptionsWithStatus,
  ConfigurationWithStatus,
  defualtProctingSettings,
  FullNameMap,
  IconMap,
  Quiz,
  QuizConfiguration,
} from "./AppTypes";

interface Props {
  auth: Object | any;
  id: any;
  courseId: any;
  reqToken: any;
  toolConsumerGuid: any;
}

const iconSize = "";

const Configuration: React.FunctionComponent<Props> = (props): JSX.Element => {
  let [quizzesStat, setQuizzesStat] = useState<any>();
  const [quizzes, setQuizzes] = useState<any>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [showWaitingModal, setShowWaitingModal] = useState<boolean>(false);
  const [showConfigurations, setShowConfigurations] = useState<boolean>(false);
  let [configSaveStatus, setConfigSaveStatus] = useState<boolean>(false);
  let [defaultSettingsOptionsChecked, setDefaultSettingsOptionsChecked] =
    useState<any>(null);
  let [isReset, setIsReset] = useState<boolean>(false);
  const {
    tokenData,
    courseDetails,
    urlParamsData,
    userAccessDetails,
    isNotAllowed,
  } = useAppStore((state) => state);
  const {
    customizableQuizConfig,
    isLockdown,
    isProcExamd,
    isRecOptions,
    isStudResource,
    isVerification,
    isViolation,
    reportReview,
    liveLaunch,
    liveProctoring,
    lockdownBrowser,
    handleConfigCatSelectChange,
    handleConfigOptionChange,
    handleQuizConfigSelect,
    showConfigSummary,
    selectedQuizConfig,
    configAvailable,
    setAllQuizzes,
  } = useQuizStore((state) => state);

  const fullNameMap: FullNameMap = {
    recOptions: "Recording Options",
    recordWebcam: "Record Webcam",
    recordScreen: "Record Screen",
    recordAudio: "Record Audio",
    chat: "Chat",
    verificationOptions: "Verification Options",
    studentPicture: "Student Picture",
    studentIdDl: "Student ID or Dl",
    roomScan: "Room Scan",
    otp: "One Time Password",
    studentRes: "Student Resources",
    calculatorAllowed: "Calculator Allowed",
    scratchPadAllowed: "Scratch Pad Allowed",
    liveHelp: "Live Help",
    whitelistPages: "Whitelist Pages",
    lockdownOptions: "Lockdown Options",
    disableCopyPaste: "Disable Copy Paste",
    disablePrinting: "Disable Printing",
    lockdownBrowser: "Lockdown Browser",
    violationOptions: "Violation Options",
    multiplePerson: "Multiple Person",
    cellPhone: "Cell Phone",
    noPersonInRoom: "No Person In Room",
    speaking: "Speaking",
    proctorOptions: "Proctor Options by Examd",
    postExamReview: "Post Exam Review",
    examdLiveLaunch: "Live Launch",
    examdProctored: "Proctoring",
    instructorProctored: "Live Verification",
  };

  const iconMap: IconMap = {
    recordWebcam: <VideoCameraOutlined style={{ fontSize: iconSize }} />,
    recordScreen: <DesktopOutlined style={{ fontSize: iconSize }} />,
    recordAudio: <AudioOutlined style={{ fontSize: iconSize }} />,
    chat: <CommentOutlined style={{ fontSize: iconSize }} />,
    studentPicture: <UserOutlined style={{ fontSize: iconSize }} />,
    studentIdDl: <IdcardOutlined style={{ fontSize: iconSize }} />,
    roomScan: <ScanOutlined style={{ fontSize: iconSize }} />,
    otp: <KeyOutlined style={{ fontSize: iconSize }} />,
    calculatorAllowed: <CalculatorOutlined style={{ fontSize: iconSize }} />,
    scratchPadAllowed: <SnippetsOutlined style={{ fontSize: iconSize }} />,
    liveHelp: <RobotOutlined style={{ fontSize: iconSize }} />,
    whitelistPages: <IeOutlined style={{ fontSize: iconSize }} />,
    disableCopyPaste: <CopyOutlined style={{ fontSize: iconSize }} />,
    disablePrinting: <PrinterOutlined style={{ fontSize: iconSize }} />,
    lockdownBrowser: <ChromeOutlined style={{ fontSize: iconSize }} />,
    multiplePerson: <TeamOutlined style={{ fontSize: iconSize }} />,
    cellPhone: <PhoneOutlined style={{ fontSize: iconSize }} />,
    noPersonInRoom: <InteractionOutlined style={{ fontSize: iconSize }} />,
    speaking: <SoundOutlined style={{ fontSize: iconSize }} />,
    postExamReview: <ProjectOutlined style={{ fontSize: iconSize }} />,
    examdLiveLaunch: <RocketOutlined style={{ fontSize: iconSize }} />,
    examdProctored: <img src={ExamdLogo} width={100} height={100} />,
    instructorProctored: <MonitorOutlined style={{ fontSize: iconSize }} />,
  };

  let configuration: ConfigurationOptionsWithStatus = [];

  if (customizableQuizConfig) {
    configuration = [
      {
        fullName: "Recording Options",
        recordWebcam: customizableQuizConfig?.recordWebcam as boolean,
        recordScreen: customizableQuizConfig?.recordScreen as boolean,
        recordAudio: customizableQuizConfig?.recordAudio as boolean,
        chat: customizableQuizConfig?.chat as boolean,
      },
      {
        fullName: "Verification Options",
        studentPicture: customizableQuizConfig.studentPicture as boolean,
        studentIdDl: customizableQuizConfig.studentIdDl as boolean,
        roomScan: customizableQuizConfig.roomScan as boolean,
        otp: customizableQuizConfig.otp as boolean,
        instructorProctored:
          customizableQuizConfig.instructorProctored as boolean,
      },
      {
        fullName: "Student Resources",
        calculatorAllowed: customizableQuizConfig.calculatorAllowed as boolean,
        scratchPadAllowed: customizableQuizConfig.scratchPadAllowed as boolean,
        liveHelp: customizableQuizConfig.liveHelp as boolean,
        whitelistPages: customizableQuizConfig.whitelistPages as boolean,
      },
      {
        fullName: "Lockdown Options",
        disableCopyPaste: customizableQuizConfig.disableCopyPaste as boolean,
        disablePrinting: customizableQuizConfig.disablePrinting as boolean,
        lockdownBrowser: customizableQuizConfig.lockdownBrowser as boolean,
      },
      {
        fullName: "Violation Options",
        multiplePerson: customizableQuizConfig.multiplePerson as boolean,
        cellPhone: customizableQuizConfig.cellPhone as boolean,
        noPersonInRoom: customizableQuizConfig.noPersonInRoom as boolean,
        speaking: customizableQuizConfig.speaking as boolean,
      },
      {
        fullName: "Proctoring Options by Examd",
        postExamReview: customizableQuizConfig.postExamReview as boolean,
        examdLiveLaunch: customizableQuizConfig.examdLiveLaunch as boolean,
        examdProctored: customizableQuizConfig.examdProctored as boolean,
      },
    ];
  }

  const [recoveringQuiz, setRecoveringQuiz] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const quizStoreState = useQuizStore((state) => state);
  const quizRecoveryMsg: JSX.Element = (
    <p className="text-center font-semibold text-lg">
      Recovering Quiz. Please wait...
    </p>
  );
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

  // const setDefaultCheckedStatus = () => {
  //   let checks: checkTypes = {};
  //   for (let key in settingOptions) {
  //     let subOptions: subOptionsProto = {};
  //     for (let subKey in settingOptions[key]) {
  //       subOptions[subKey] = false;
  //     }
  //     let obj: objProto = {
  //       [key]: subOptions,
  //     };
  //     Object.assign(checks, obj);
  //   }
  //   setChecked(checks);
  // };

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
      setIsSaving(!isSaving);
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

    if (reportReview) {
      if (
        !customizableQuizConfig.recordAudio &&
        !customizableQuizConfig.recordWebcam &&
        !customizableQuizConfig.recordScreen &&
        !customizableQuizConfig.chat
      ) {
        message.error(
          "Please select an option for recording option or un-check recording option"
        );
        return;
      }
    }

    if (isVerification) {
      if (
        !customizableQuizConfig.studentIdDl &&
        !customizableQuizConfig.studentPicture &&
        !customizableQuizConfig.roomScan &&
        !customizableQuizConfig.otp &&
        !customizableQuizConfig.instructorProctored
      ) {
        message.error(
          "Please select an option for verification option or un-check verification option"
        );
        return;
      }
    }

    if (isStudResource) {
      if (
        !customizableQuizConfig.calculatorAllowed &&
        !customizableQuizConfig.scratchPadAllowed &&
        !customizableQuizConfig.liveHelp &&
        !customizableQuizConfig.whitelistPages
      ) {
        message.error(
          "Please select an option for student resource option or un-check student resource option"
        );
        return;
      }
    }

    if (isLockdown) {
      if (
        !customizableQuizConfig.disableCopyPaste &&
        !customizableQuizConfig.disablePrinting &&
        !customizableQuizConfig.lockdownBrowser
      ) {
        message.error(
          "Please select an option for lockdown option or un-check lockdown option"
        );
        return;
      }
    }

    if (isViolation) {
      if (
        !customizableQuizConfig.multiplePerson &&
        !customizableQuizConfig.cellPhone &&
        !customizableQuizConfig.noPersonInRoom &&
        !customizableQuizConfig.speaking
      ) {
        message.error(
          "Please select an option for violation option or un-check violation option"
        );
        return;
      }
    }

    if (isProcExamd) {
      if (
        !customizableQuizConfig.postExamReview &&
        !customizableQuizConfig.examdLiveLaunch &&
        !customizableQuizConfig.examdProctored
      ) {
        message.error(
          "Please select an option for examd proctoring option or un-check examd proctoring option"
        );
        return;
      }
    }

    let config: QuizConfiguration = { ...selectedQuizConfig };
    config.idInstructor = "";
    config.idLtiCanvasConfig = uuid();
    config.idUser = props.id;
    config.quizId = selectedQuiz.id;
    config.guid = props.toolConsumerGuid;
    config.courseId = props.courseId;
    config.assignmentId = 0;
    config.calculatorAllowed = customizableQuizConfig.calculatorAllowed;
    config.cellPhone = customizableQuizConfig.cellPhone;
    config.chat = customizableQuizConfig.chat;
    config.disableCopyPaste = customizableQuizConfig.disableCopyPaste;
    config.disablePrinting = customizableQuizConfig.disablePrinting;
    config.examdLiveLaunch = customizableQuizConfig.examdLiveLaunch;
    config.examdProctored = customizableQuizConfig.examdProctored;
    config.liveHelp = customizableQuizConfig.liveHelp;
    config.lockdownBrowser = customizableQuizConfig.lockdownBrowser;
    config.multiplePerson = customizableQuizConfig.multiplePerson;
    config.noPersonInRoom = customizableQuizConfig.noPersonInRoom;
    config.otp = customizableQuizConfig.otp;
    config.postExamReview = customizableQuizConfig.postExamReview;
    config.recordAudio = customizableQuizConfig.recordAudio;
    config.recordScreen = customizableQuizConfig.recordScreen;
    config.recordWebcam = customizableQuizConfig.recordWebcam;
    config.roomScan = customizableQuizConfig.roomScan;
    config.scratchPadAllowed = customizableQuizConfig.scratchPadAllowed;
    config.speaking = customizableQuizConfig.speaking;
    config.studentIdDl = customizableQuizConfig.studentIdDl;
    config.studentPicture = customizableQuizConfig.studentPicture;
    config.whitelistPages = customizableQuizConfig.whitelistPages;
    config.instructorProctored = customizableQuizConfig.instructorProctored;

    if (configAvailable) {
      config.assignmentId = selectedQuizConfig.assignmentId;
    }
    setIsSaving(!isSaving);
    axios
      .post(saveLtiCanvasConfig, config, {
        headers: { Authorization: `Bearer ${tokenData.lmsAccessToken}` },
      })
      .then((res) => {
        if (config["assignmentId"] === 0) {
          setShowWaitingModal(true);
          handleAutoCompleteSetup();
        }
        // setQuizConfig(config);
        message.success("Configurations saved successfully");
        setConfigSaveStatus(true);
        if (isSaving) {
          setIsSaving(!isSaving);
        }
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
    useQuizStore.setState({
      customizableQuizConfig: disabledConfigOptions,
      isRecOptions: false,
      isVerification: false,
      isLockdown: false,
      isProcExamd: false,
      isStudResource: false,
      isViolation: false,
    });
  };

  const getQuizzesByCourseId = (id: string) => {
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
        setAllQuizzes(res.data as Quiz[]);
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
    prepareDefaultSettingsOptionsChecked();
  }, []);

  const handleSelectQuiz = (quiz: any) => {
    quizStoreState.setSelectedQuiz(quiz);
    setSelectedQuiz(quiz);
    setShowConfigurations(false);
    let quizStat: any = { ...quizzesStat };

    Object.keys(quizStat).forEach((key: string) => {
      quizStat[key] = false;
    });

    quizStat[quiz.title] = true;
    setQuizzesStat(quizStat);
    setIsReset(false);
  };

  const handleShowConfig = () => {
    if (selectedQuiz) {
      if (showConfigurations) {
        setShowConfigurations(false);
        useQuizStore.setState({
          showConfigSummary: true,
        });
      } else {
        setShowConfigurations(true);
        useQuizStore.setState({
          showConfigSummary: false,
        });
      }
    } else {
      message.error("Please select a quiz");
      return;
    }
  };

  const handleRepairModule = async () => {
    if (!selectedQuiz) {
      message.error("Please select a quiz");
      return;
    }
    setRecoveringQuiz(true);
    let response = await axios.post(
      `${recoverQuiz}/${tokenData.instituteId}/${urlParamsData.courseId}/${selectedQuiz.id}/${selectedQuiz.title}/${tokenData.lmsAccessToken}`
    );

    if (response.status === 200) {
      message.success("Quiz recovered successfully");
      setRecoveringQuiz(false);
      return;
    }
    message.error("Failed to recover quiz");
    return;
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
              defaultProcSettings.map(
                (setting: defualtProctingSettings, index: number) => {
                  let checked: boolean = false;

                  if (setting.configName === "reportReview") {
                    checked = reportReview;
                  } else if (setting.configName === "liveLaunch") {
                    checked = liveLaunch;
                  } else if (setting.configName === "liveProctoring") {
                    checked = liveProctoring;
                  } else if (setting.configName === "lockdownBrowser") {
                    checked = lockdownBrowser;
                  }

                  return (
                    <div
                      className="flex flex-col w-full justify-center gap-1"
                      key={index}
                    >
                      <div className="flex flex-row h-full w-full items-center justify-center gap-1">
                        <input
                          className="form-check-input appearance-none h-4 w-4 border self-center border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                          type="checkbox"
                          disabled={isNotAllowed}
                          value=""
                          id={`${setting.name}_${
                            defaultSettingsOptionsChecked[setting.name]
                          }`}
                          onChange={(e) =>
                            handleQuizConfigSelect(setting.configName)
                          }
                          checked={checked}
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
                }
              )}
          </div>
        </div>
        {selectedQuiz && !isNotAllowed ? (
          <div className="flex flex-row h-full items-center gap-8">
            <p
              className="text-center text-blue-400 font-semibold cursor-pointer underline text-lg mt-4 mb-4"
              onClick={handleShowConfig}
            >
              {`${
                showConfigurations ? "Hide Customization" : "Edit Customization"
              }`}
            </p>
            {!showConfigurations && (
              <p
                className="text-center text-blue-400 font-semibold cursor-pointer underline text-lg mt-4 mb-4"
                onClick={handleRepairModule}
              >
                Repair Proctoring Module
              </p>
            )}
          </div>
        ) : (
          <p className="text-lg font-semibold text-center mt-8">
            Please select a quiz.
          </p>
        )}
        {showConfigurations && selectedQuiz && (
          <div className="container mx-auto mt-2">
            <p className="font-bold font-serif text-xl underline">
              {selectedQuiz && selectedQuiz.title + ":    "}Configuration
            </p>
            {!isNotAllowed ? (
              <div
                className="mt-4 container overflow-y-scroll"
                style={{ height: "76vh" }}
              >
                {configuration.length > 0 && (
                  <div className="flex flex-col h-full w-full items-center justify-start gap-8">
                    {configuration.map(
                      (item: ConfigurationWithStatus, index: number) => {
                        let checked: boolean = false;
                        let category: string = "";
                        if (item.fullName === "Recording Options") {
                          checked = isRecOptions;
                          category = "isRecOptions";
                        } else if (item.fullName === "Verification Options") {
                          checked = isVerification;
                          category = "isVerification";
                        } else if (item.fullName === "Student Resources") {
                          checked = isStudResource;
                          category = "isStudResource";
                        } else if (item.fullName === "Lockdown Options") {
                          checked = isLockdown;
                          category = "isLockdown";
                        } else if (item.fullName === "Violation Options") {
                          checked = isViolation;
                          category = "isViolation";
                        } else if (
                          item.fullName === "Proctoring Options by Examd"
                        ) {
                          checked = isProcExamd;
                          category = "isProcExamd";
                        }

                        return (
                          <div
                            className="flex flex-col h-full w-full items-center justify-start gap-2"
                            key={index}
                          >
                            <div className="flex flex-row h-full w-full items-center justify-start gap-2">
                              <b className="font-semibold">{item.fullName}</b>
                              <input
                                className="flex items-center justify-center"
                                type="checkbox"
                                role="switch"
                                id="flexSwitchCheckDefault"
                                checked={checked}
                                onChange={() =>
                                  handleConfigCatSelectChange(category)
                                }
                              />
                            </div>
                            {
                              <div className="flex flex-row h-full w-full items-center justify-start gap-8">
                                {Object.keys(item).map(
                                  (key: string, index: number) => {
                                    if (key !== "fullName")
                                      return (
                                        <div className="h-full" key={index}>
                                          <div
                                            className={`flex border box-border items-center justify-center h-32 w-32 bg-white shadow-lg rounded hover:bg-blue-400 hover:text-white 
                                          cursor-pointer ${
                                            item[key]
                                              ? "bg-blue-400 text-white"
                                              : "bg-white"
                                          }`}
                                            onClick={() =>
                                              handleConfigOptionChange(
                                                category,
                                                key
                                              )
                                            }
                                          >
                                            <div className="text-7xl flex items-start justify-center align-middle">
                                              {iconMap[key]}
                                            </div>
                                          </div>
                                          <p className="text-center truncate w-32 text-base font-semibold">
                                            {fullNameMap[key]}
                                          </p>
                                        </div>
                                      );
                                  }
                                )}
                              </div>
                            }
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
                {/* {applySettings && (
                <InfoModal
                  title="User settings"
                  message="Fetching user settings. Please wait."
                />
              )} */}
              </div>
            ) : (
              <div className="my-4">
                <p className="text-center text-lg font-semibold mx-auto">
                  You are not authorized to configure the selected Quiz.
                </p>
                <p className="text-center text-lg font-semibold mx-auto">
                  Please contact admin
                </p>
              </div>
            )}
            {!isNotAllowed && (
              <div className="flex flex-row pt-4 gap-5 pb-4">
                <button
                  disabled={isSaving}
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
            )}
          </div>
        )}
        {recoverQuiz && (
          <WaitingModal
            visible={recoveringQuiz}
            title="Quiz Recovery"
            message={quizRecoveryMsg}
          />
        )}
        {showConfigSummary && !isNotAllowed && <CustomizationSummary />}
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
