import { message } from "antd";
import axios from "axios";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { getLtiCanvasConfigByGuidCourseIdQuizId } from "../apiConfigs";
import {
  defualtProctingSettings,
  Quiz,
  QuizStore,
  QuizConfiguration,
  QuizConfigurationWithOnlyProcOpt,
} from "../AppTypes";
import { defaultProcSettings } from "../CommonUtilites/ProctorSettingDefaults";
import { useAppStore } from "../store/AppSotre";

const getSelectedQuizConfig = async (
  quizId: string
): Promise<QuizConfiguration | null> => {
  const guid: string = useAppStore.getState().urlParamsData.guid as any;
  const courseId: string = useAppStore.getState().urlParamsData.courseId as any;

  let res: QuizConfiguration | null = null;
  try {
    if (guid && courseId) {
      let response = await axios.get(
        `${getLtiCanvasConfigByGuidCourseIdQuizId}?guid=${guid}&courseId=${courseId}&quizId=${quizId}`
      );
      if (response.status === 200) {
        res = response.data as QuizConfiguration;
      }
    }
  } catch (e) {
    res = null;
  }

  return res;
};

const updateQuizConfiguratio = async (quizConfig: QuizConfiguration) => {
  try {
    const response = await axios;
  } catch (err) {}
};

const setQuizConfiguration = (
  quizConfig: QuizConfigurationWithOnlyProcOpt,
  updatedConfig: QuizConfigurationWithOnlyProcOpt
): QuizConfigurationWithOnlyProcOpt => {
  let config: QuizConfigurationWithOnlyProcOpt = { ...quizConfig };

  Object.keys(updatedConfig).forEach((key: string) => {
    if (!config[key as keyof QuizConfigurationWithOnlyProcOpt]) {
      config[key as keyof QuizConfigurationWithOnlyProcOpt] =
        updatedConfig[key as keyof QuizConfigurationWithOnlyProcOpt];
    }
  });

  return config;
};

const subtractQuizConfiguration = (
  quizConfig: QuizConfigurationWithOnlyProcOpt,
  updatedConfig: QuizConfigurationWithOnlyProcOpt
): QuizConfigurationWithOnlyProcOpt => {
  let config: QuizConfigurationWithOnlyProcOpt = { ...quizConfig };

  Object.keys(updatedConfig).forEach((key: string) => {
    if (
      config[key as keyof QuizConfigurationWithOnlyProcOpt] &&
      updatedConfig[key as keyof QuizConfigurationWithOnlyProcOpt]
    ) {
      config[key as keyof QuizConfigurationWithOnlyProcOpt] = false;
    }
  });

  return config;
};

export const useQuizStore = create<QuizStore>()(
  devtools(
    (set, get) => ({
      allQuizzes: [] as Quiz[],
      selectedQuiz: undefined,
      defaultOptionSelected: undefined,
      reportReview: false,
      liveLaunch: false,
      configAvailable: false,
      liveProctoring: false,
      defaultConfiguration: {
        recordWebcam: true,
        recordScreen: true,
        recordAudio: false,
        chat: false,
        studentPicture: true,
        studentIdDl: true,
        roomScan: false,
        otp: false,
        calculatorAllowed: true,
        scratchPadAllowed: true,
        liveHelp: false,
        whitelistPages: false,
        disableCopyPaste: true,
        disablePrinting: true,
        multiplePerson: true,
        cellPhone: true,
        noPersonInRoom: true,
        speaking: true,
        postExamReview: false,
        examdLiveLaunch: false,
        instructorProctored: false,
        examdProctored: false,
        lockdownBrowser: false,
      },
      showConfigSummary: false,
      lockdownBrowser: false,
      selectedQuizConfig: {
        assignmentId: 0,
        calculatorAllowed: false,
        cellPhone: false,
        chat: false,
        courseId: "",
        createDate: "",
        createUser: "",
        disableCopyPaste: false,
        disablePrinting: false,
        examdLiveLaunch: false,
        examdProctored: false,
        guid: "",
        idLtiCanvasConfig: "",
        idUser: "",
        instructorProctored: false,
        liveHelp: false,
        lockdownBrowser: false,
        modifyDate: "",
        modifyUser: "",
        moduleId: 0,
        multiplePerson: false,
        noPersonInRoom: false,
        otp: false,
        postExamReview: false,
        quizId: "",
        recordAudio: false,
        recordScreen: false,
        recordWebcam: false,
        roomScan: false,
        scratchPadAllowed: false,
        speaking: false,
        studentIdDl: false,
        studentPicture: false,
        timeLimit: 0,
        whitelistPages: false,
      },
      isLockdown: false,
      isProcExamd: false,
      isRecOptions: false,
      isStudResource: false,
      isVerification: false,
      isViolation: false,
      customizableQuizConfig: {
        calculatorAllowed: false,
        cellPhone: false,
        chat: false,
        disableCopyPaste: false,
        disablePrinting: false,
        examdLiveLaunch: false,
        examdProctored: false,
        instructorProctored: false,
        liveHelp: false,
        lockdownBrowser: false,
        multiplePerson: false,
        noPersonInRoom: false,
        otp: false,
        postExamReview: false,
        recordAudio: false,
        recordScreen: false,
        recordWebcam: false,
        roomScan: false,
        scratchPadAllowed: false,
        speaking: false,
        studentIdDl: false,
        studentPicture: false,
        whitelistPages: false,
      },
      setAllQuizzes: (quizzes: Quiz[]) => {
        set({ allQuizzes: quizzes });
      },
      setSelectedQuiz: async (quiz: Quiz) => {
        set({
          selectedQuiz: quiz,
          reportReview: false,
          liveLaunch: false,
          liveProctoring: false,
          lockdownBrowser: false,
        });

        let configAvailable: boolean = false;
        let quizConfig: QuizConfiguration | null = await getSelectedQuizConfig(
          quiz.id
        );

        configAvailable = quizConfig ? true : false;

        let configWithOnlyProOptions: QuizConfigurationWithOnlyProcOpt | null =
          null;

        let isLockdown: boolean = false;
        let isProcExamd: boolean = false;
        let isRecOptions: boolean = false;
        let isStudResource: boolean = false;
        let isVerification: boolean = false;
        let isViolation: boolean = false;

        if (quizConfig) {
          if (
            quizConfig.recordWebcam ||
            quizConfig.recordScreen ||
            quizConfig.recordAudio ||
            quizConfig.chat
          ) {
            isRecOptions = true;
          }

          if (
            quizConfig.studentPicture ||
            quizConfig.studentIdDl ||
            quizConfig.roomScan ||
            quizConfig.otp
          ) {
            isVerification = true;
          }

          if (
            quizConfig.calculatorAllowed ||
            quizConfig.scratchPadAllowed ||
            quizConfig.liveHelp ||
            quizConfig.whitelistPages
          ) {
            isStudResource = true;
          }

          if (
            quizConfig.disableCopyPaste ||
            quizConfig.disablePrinting ||
            quizConfig.lockdownBrowser
          ) {
            isLockdown = true;
          }

          if (
            quizConfig.multiplePerson ||
            quizConfig.cellPhone ||
            quizConfig.noPersonInRoom ||
            quizConfig.speaking
          ) {
            isViolation = true;
          }

          if (
            quizConfig.postExamReview ||
            quizConfig.examdLiveLaunch ||
            quizConfig.examdProctored
          ) {
            if (quizConfig.postExamReview) {
              set({
                reportReview: true,
              });
            }
            if (quizConfig.examdLiveLaunch) {
              set({
                liveLaunch: true,
              });
            }
            if (quizConfig.examdProctored) {
              set({
                liveProctoring: true,
              });
            }
            isProcExamd = true;
          }

          configWithOnlyProOptions = {
            calculatorAllowed: quizConfig.calculatorAllowed,
            cellPhone: quizConfig.cellPhone,
            chat: quizConfig.chat,
            disableCopyPaste: quizConfig.disableCopyPaste,
            disablePrinting: quizConfig.disablePrinting,
            examdLiveLaunch: quizConfig.examdLiveLaunch,
            examdProctored: quizConfig.examdProctored,
            liveHelp: quizConfig.liveHelp,
            lockdownBrowser: quizConfig.lockdownBrowser,
            multiplePerson: quizConfig.multiplePerson,
            noPersonInRoom: quizConfig.noPersonInRoom,
            otp: quizConfig.otp,
            postExamReview: quizConfig.postExamReview,
            recordAudio: quizConfig.recordAudio,
            recordScreen: quizConfig.recordScreen,
            recordWebcam: quizConfig.recordWebcam,
            roomScan: quizConfig.roomScan,
            scratchPadAllowed: quizConfig.scratchPadAllowed,
            speaking: quizConfig.speaking,
            studentIdDl: quizConfig.studentIdDl,
            studentPicture: quizConfig.studentPicture,
            whitelistPages: quizConfig.whitelistPages,
            instructorProctored: quizConfig.instructorProctored,
          };
          set({
            selectedQuizConfig: quizConfig,
            customizableQuizConfig: configWithOnlyProOptions,
          });
        } else {
          isLockdown = true;
          isRecOptions = true;
          isStudResource = true;
          isVerification = true;
          isViolation = true;
          set({
            customizableQuizConfig: get().defaultConfiguration,
          });
        }
        set({
          isLockdown: isLockdown,
          isProcExamd: isProcExamd,
          isRecOptions: isRecOptions,
          isStudResource: isStudResource,
          isVerification: isVerification,
          isViolation: isViolation,
          showConfigSummary: true,
          configAvailable: configAvailable,
        });
      },
      setDefaultOptionSelection: (optionName: string, flag: boolean) => {
        if (flag && optionName !== "") {
          let configByOption: defualtProctingSettings[] =
            defaultProcSettings.filter(
              (item: defualtProctingSettings) => item.name === optionName
            );

          set({
            defaultOptionSelected: optionName,
            customizableQuizConfig: configByOption[0].settings,
          });
        } else {
          set({
            defaultOptionSelected: "",
            selectedQuizConfig: get().selectedQuizConfig,
          });
        }
      },
      updateQuizConfig: (configName: string, selected: boolean) => {
        if (get().customizableQuizConfig) {
          let quizConfig = {
            ...get().customizableQuizConfig,
          };

          quizConfig[configName as keyof QuizConfigurationWithOnlyProcOpt] =
            selected;

          const payload: QuizConfiguration = {
            assignmentId: get().selectedQuizConfig?.assignmentId as number,
            calculatorAllowed: quizConfig.calculatorAllowed,
            cellPhone: quizConfig.cellPhone,
            chat: quizConfig.chat,
            courseId: get().selectedQuizConfig?.courseId as string,
            createDate: get().selectedQuizConfig?.createDate as string,
            createUser: get().selectedQuizConfig?.createUser as string,
            disableCopyPaste: quizConfig.disableCopyPaste,
            disablePrinting: quizConfig.disablePrinting,
            examdLiveLaunch: quizConfig.examdLiveLaunch,
            examdProctored: quizConfig.examdProctored,
            guid: get().selectedQuizConfig?.guid as string,
            idLtiCanvasConfig: get().selectedQuizConfig
              ?.idLtiCanvasConfig as string,
            idUser: get().selectedQuizConfig?.idUser as string,
            instructorProctored: quizConfig.instructorProctored,
            liveHelp: quizConfig.liveHelp,
            lockdownBrowser: quizConfig.lockdownBrowser,
            modifyDate: get().selectedQuizConfig?.modifyDate as string,
            modifyUser: get().selectedQuizConfig?.modifyUser as string,
            moduleId: get().selectedQuizConfig?.moduleId as number,
            multiplePerson: quizConfig.multiplePerson,
            noPersonInRoom: quizConfig.noPersonInRoom,
            otp: quizConfig.otp,
            postExamReview: quizConfig.postExamReview,
            quizId: get().selectedQuizConfig?.quizId as string,
            recordAudio: quizConfig.recordAudio,
            recordScreen: quizConfig.recordScreen,
            recordWebcam: quizConfig.recordWebcam,
            roomScan: quizConfig.roomScan,
            scratchPadAllowed: quizConfig.scratchPadAllowed,
            speaking: quizConfig.speaking,
            studentIdDl: quizConfig.studentIdDl,
            studentPicture: quizConfig.studentPicture,
            timeLimit: get().selectedQuizConfig?.timeLimit as number,
            whitelistPages: quizConfig.whitelistPages,
          };

          updateQuizConfiguratio(payload);
        }
      },
      handleConfigCatSelectChange: (category: string) => {
        let config: QuizConfigurationWithOnlyProcOpt = {
          ...(get().customizableQuizConfig as QuizConfigurationWithOnlyProcOpt),
        };
        if (category === "isRecOptions") {
          if (get().isRecOptions) {
            config.recordAudio = false;
            config.recordScreen = false;
            config.recordWebcam = false;
            config.chat = false;
          } else {
            config.recordAudio = get().selectedQuizConfig.recordAudio;
            config.recordScreen = get().selectedQuizConfig.recordScreen;
            config.recordWebcam = get().selectedQuizConfig.recordWebcam;
            config.chat = get().selectedQuizConfig.chat;
          }
          set({
            isRecOptions: !get().isRecOptions,
            customizableQuizConfig: config,
          });
        }

        if (category === "isVerification") {
          if (get().isVerification) {
            config.studentPicture = false;
            config.studentIdDl = false;
            config.roomScan = false;
            config.otp = false;
          } else {
            config.studentPicture = get().selectedQuizConfig.studentPicture;
            config.studentIdDl = get().selectedQuizConfig.studentIdDl;
            config.roomScan = get().selectedQuizConfig.roomScan;
            config.otp = get().selectedQuizConfig.otp;
          }
          set({
            isVerification: !get().isVerification,
            customizableQuizConfig: config,
          });
        }

        if (category === "isStudResource") {
          if (get().isStudResource) {
            config.calculatorAllowed = false;
            config.scratchPadAllowed = false;
            config.liveHelp = false;
            config.whitelistPages = false;
          } else {
            config.calculatorAllowed =
              get().selectedQuizConfig.calculatorAllowed;
            config.scratchPadAllowed =
              get().selectedQuizConfig.scratchPadAllowed;
            config.liveHelp = get().selectedQuizConfig.liveHelp;
            config.whitelistPages = get().selectedQuizConfig.whitelistPages;
          }
          set({
            isStudResource: !get().isStudResource,
            customizableQuizConfig: config,
          });
        }

        if (category === "isLockdown") {
          if (get().isLockdown) {
            config.disableCopyPaste = false;
            config.disablePrinting = false;
            config.lockdownBrowser = false;
          } else {
            config.disableCopyPaste = get().selectedQuizConfig.disableCopyPaste;
            config.disablePrinting = get().selectedQuizConfig.disablePrinting;
            config.lockdownBrowser = get().selectedQuizConfig.lockdownBrowser;
          }
          set({
            isLockdown: !get().isLockdown,
            customizableQuizConfig: config,
          });
        }

        if (category === "isViolation") {
          if (get().isViolation) {
            config.multiplePerson = false;
            config.cellPhone = false;
            config.noPersonInRoom = false;
            config.speaking = false;
          } else {
            config.multiplePerson = get().selectedQuizConfig.multiplePerson;
            config.cellPhone = get().selectedQuizConfig.cellPhone;
            config.noPersonInRoom = get().selectedQuizConfig.noPersonInRoom;
            config.speaking = get().selectedQuizConfig.speaking;
          }
          set({
            isViolation: !get().isViolation,
            customizableQuizConfig: config,
          });
        }

        if (category === "isProcExamd") {
          if (get().isViolation) {
            config.postExamReview = false;
            config.examdLiveLaunch = false;
            config.examdProctored = false;
          } else {
            config.postExamReview = get().selectedQuizConfig.postExamReview;
            config.examdLiveLaunch = get().selectedQuizConfig.examdLiveLaunch;
            config.examdProctored = get().selectedQuizConfig.examdProctored;
          }
          set({
            isProcExamd: !get().isProcExamd,
            customizableQuizConfig: config,
          });
        }
      },
      handleConfigOptionChange: (category: string, option: string) => {
        let config: QuizConfigurationWithOnlyProcOpt = {
          ...(get().customizableQuizConfig as QuizConfigurationWithOnlyProcOpt),
        };

        if (option === "instructorProctored") {
          // if (config.studentIdDl || config.studentPicture) {
          //   message.error(
          //     "Cannot select any live authentication option with Ai Proctoring option"
          //   );
          //   return;
          // }

          // if (config.examdLiveLaunch) {
          //   message.error("Cannot select option with examd live launch");
          //   return;
          // }
          config.studentIdDl = false;
          config.studentPicture = false;
          config.examdLiveLaunch = false;
        }

        if (option === "studentIdDl" || option === "studentPicture") {
          config.instructorProctored = false;
          // if (config.instructorProctored) {
          //   message.error(
          //     "Cannot select any ai authentication option with manual authentication"
          //   );
          //   return;
          // }
        }

        if (option === "examdLiveLaunch") {
          // if (config.instructorProctored) {
          //   message.error(
          //     "Cannot select live launch option with manual authentication"
          //   );
          //   return;
          // }
          config.instructorProctored = false;
        }

        if (category === "isVerification" && !get().isVerification) {
          message.error("Please enable verification option first");
          return;
        }

        if (category === "isStudResource" && !get().isStudResource) {
          message.error("Please enable student resource option first");
          return;
        }

        if (category === "isRecOptions" && !get().isRecOptions) {
          message.error("Please enable recording option first");
          return;
        }

        if (category === "isLockdown" && !get().isLockdown) {
          message.error("Please enable lockdown option first");
          return;
        }

        if (category === "isViolation" && !get().isViolation) {
          message.error("Please enable violation option first");
          return;
        }

        if (category === "isProcExamd" && !get().isProcExamd) {
          message.error("Please enable proctoring by examd option first");
          return;
        }

        config[option as keyof QuizConfigurationWithOnlyProcOpt] =
          !config[option as keyof QuizConfigurationWithOnlyProcOpt];
        set({
          customizableQuizConfig: config,
        });
      },
      handleQuizConfigSelect: (configName: string) => {
        let isLockdown: boolean = false;
        let isProcExamd: boolean = false;
        let isRecOptions: boolean = false;
        let isStudResource: boolean = false;
        let isVerification: boolean = false;
        let isViolation: boolean = false;

        let reportReview: boolean = get().reportReview;
        let liveLaunch: boolean = get().liveLaunch;
        let liveProctoring: boolean = get().liveProctoring;
        let lockdownBrowser: boolean = get().lockdownBrowser;

        let config: QuizConfigurationWithOnlyProcOpt = {
          ...get().customizableQuizConfig,
        };

        if (!get().selectedQuiz) {
          message.error("Please select a quiz");
          return;
        }

        if (configName === "reportReview") {
          reportReview = !reportReview;

          if (!reportReview) {
            config.postExamReview = false;
          } else {
            config.postExamReview = true;
            config.lockdownBrowser = false;
            lockdownBrowser = false
          }
        }

        if (configName === "liveLaunch") {
          liveLaunch = !liveLaunch;
          if (!liveLaunch) {
            config.examdLiveLaunch = false;
          } else {
            config.examdLiveLaunch = true;
            config.lockdownBrowser = false;
            lockdownBrowser = false
            if (config.instructorProctored) {
              config.instructorProctored = false;
            }
          }
        }

        if (configName === "liveProctoring") {
          liveProctoring = !liveProctoring;
          if (!liveProctoring) {
            config.examdProctored = false;
          } else {
            config.examdProctored = true;
            config.lockdownBrowser = false;
            lockdownBrowser = false;
          }
        }

        if (configName === "lockdownBrowser") {
          lockdownBrowser = !lockdownBrowser;
          if (!lockdownBrowser) {
            config.lockdownBrowser = false;
          } else {
            config.lockdownBrowser = true;
            reportReview = false;
            liveLaunch = false;
            liveProctoring = false;
            config.postExamReview = false;
            config.examdLiveLaunch = false;
            config.examdProctored = false;
          }
        }
        if (config) {
          if (
            config.recordWebcam ||
            config.recordScreen ||
            config.recordAudio ||
            config.chat
          ) {
            isRecOptions = true;
          }

          if (
            config.studentPicture ||
            config.studentIdDl ||
            config.roomScan ||
            config.otp
          ) {
            isVerification = true;
          }

          if (
            config.calculatorAllowed ||
            config.scratchPadAllowed ||
            config.liveHelp ||
            config.whitelistPages
          ) {
            isStudResource = true;
          }

          if (
            config.disableCopyPaste ||
            config.disablePrinting ||
            config.lockdownBrowser
          ) {
            isLockdown = true;
          }

          if (
            config.multiplePerson ||
            config.cellPhone ||
            config.noPersonInRoom ||
            config.speaking
          ) {
            isViolation = true;
          }

          if (
            config.postExamReview ||
            config.examdLiveLaunch ||
            config.examdProctored
          ) {
            isProcExamd = true;
          }
          set({
            isLockdown: isLockdown,
            isProcExamd: isProcExamd,
            isRecOptions: isRecOptions,
            isStudResource: isStudResource,
            isVerification: isVerification,
            isViolation: isViolation,
            customizableQuizConfig: config,
          });
        }
        set({
          liveProctoring: liveProctoring,
          liveLaunch: liveLaunch,
          reportReview: reportReview,
          lockdownBrowser: lockdownBrowser,
        });
      },
    }),
    { name: "Quiz Store" }
  )
);
