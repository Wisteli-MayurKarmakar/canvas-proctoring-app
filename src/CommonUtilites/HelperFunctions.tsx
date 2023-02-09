import axios, { AxiosError, AxiosResponse } from "axios";
import moment from "moment";
import {
  createSampleQuiz,
  addSampleQuestion,
  saveLtiCanvasConfig,
  autoCompleteSetup,
  uploadAuthImage,
} from "../apiConfigs";
import { QuizConfiguration } from "../AppTypes";
import { useAppStore } from "../store/AppSotre";
import { useQuizStore } from "../store/QuizStore";

const defaultConfiguration = useQuizStore.getState().defaultConfiguration;
const urlParamsData = useAppStore.getState().urlParamsData;
const tokenData = useAppStore.getState().tokenData;

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const handleCreateSampleConfig = async (
  quizId: string,
  guid: string,
  courseId: string,
  userId: string
): Promise<boolean> => {
  let payload: QuizConfiguration = {
    assignmentId: 0,
    calculatorAllowed: defaultConfiguration.calculatorAllowed,
    cellPhone: defaultConfiguration.cellPhone,
    chat: defaultConfiguration.chat,
    courseId: courseId,
    createDate: moment().toISOString(),
    createUser: "System",
    disableCopyPaste: defaultConfiguration.disableCopyPaste,
    disablePrinting: defaultConfiguration.disablePrinting,
    examdLiveLaunch: defaultConfiguration.examdLiveLaunch,
    examdProctored: defaultConfiguration.examdProctored,
    guid: guid,
    idLtiCanvasConfig: uuid(),
    idUser: userId,
    instructorProctored: defaultConfiguration.instructorProctored,
    liveHelp: defaultConfiguration.liveHelp,
    lockdownBrowser: defaultConfiguration.lockdownBrowser,
    modifyDate: moment().toISOString(),
    modifyUser: "System",
    moduleId: 0,
    multiplePerson: defaultConfiguration.multiplePerson,
    noPersonInRoom: defaultConfiguration.noPersonInRoom,
    otp: defaultConfiguration.otp,
    postExamReview: defaultConfiguration.postExamReview,
    quizId: quizId,
    recordAudio: defaultConfiguration.recordAudio,
    recordScreen: defaultConfiguration.recordScreen,
    recordWebcam: defaultConfiguration.recordWebcam,
    roomScan: defaultConfiguration.roomScan,
    scratchPadAllowed: defaultConfiguration.scratchPadAllowed,
    speaking: defaultConfiguration.speaking,
    studentIdDl: defaultConfiguration.studentIdDl,
    studentPicture: defaultConfiguration.studentPicture,
    timeLimit: 2,
    whitelistPages: defaultConfiguration.whitelistPages,
  };
  try {
    let response = await axios.post(
      `${saveLtiCanvasConfig}`,
      { ...payload },
      {
        headers: { Authorization: `Bearer ${tokenData.lmsAccessToken}` },
      }
    );
    if (response.status === 201) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
  return false;
};

const handleAutoCompleteSetup = async (
  courseId: string,
  title: string,
  quizId: string,
  token: string,
  instituteId: string
) => {
  useQuizStore.setState({
    isAutomatingQuizSetup: true,
  });
  try {
    let response = await axios.get(
      `${autoCompleteSetup}${courseId}/${title}/${quizId}/${token}/${instituteId}`
    );
    if (response.status === 200) {
      useQuizStore.setState({
        isAutomatingQuizSetup: false,
      });
    }
  } catch (e) {
    useQuizStore.setState({
      isAutomatingQuizSetup: false,
    });
  }
};

export const uploadLiveImage = (blob: Blob) => {
  const urlParamsData = useAppStore.getState().urlParamsData;
  const tokenData = useAppStore.getState().tokenData;
  const url = `${uploadAuthImage}/${urlParamsData.guid}/${urlParamsData.studentId}`;
  const file = new File([blob], "authPic.png", {
    lastModified: new Date().getTime(),
    type: blob.type,
  });
  let formData = new FormData();
  formData.append("file", file);
  formData.append("name", "authPic");
  axios
    .post(url, formData, {
      headers: {
        Accept: "*/*",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${tokenData.lmsAccessToken}`,
        "Content-Disposition":
          "form-data; name=file; filename=authPic.png",
      },
    })
};

export const addSampleQuestions = async (
  quizId: string,
  quizTitle: string,
  instituteId: string,
  courseId: string,
  token: string,
  guid: string,
  userId: string
) => {
  let questions = [
    { questionName: "1st Question", questionText: "what is 5x5" },
    { questionName: "2nd Question", questionText: "what is 5x5X5X25" },
  ];
  for (let i: number = 0; i < 2; i++) {
    let payload = {
      questionId: 0,
      quizId: quizId,
      questionName: questions[i]["questionName"],
      questionType: "calculated_question",
      questionText: questions[i]["questionText"],
      pointsPossible: 5,
      correctComments: "string",
      incorrectComments: "string",
      neutralComments: "string",
    };

    try {
      let response = await axios.post(
        `${addSampleQuestion}/${instituteId}/${courseId}/${token}`,
        { ...payload }
      );
      if (response.status === 200) {
      }
    } catch (e) {}
  }
  let response: boolean = await handleCreateSampleConfig(
    quizId,
    guid,
    courseId,
    userId
  );
  if (response) {
    await handleAutoCompleteSetup(
      courseId,
      quizTitle,
      quizId,
      token,
      instituteId
    );
  }
};
