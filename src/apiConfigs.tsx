// let env: string = process.env.NODE_ENV;

// const getEndPoints: string =
//   env === "development"
//     ? "https://examd.us/cdn/urls/xproctor/1"
//     : "${baseUrl}cdn/urls/xproctor/1";
// const canvasEnrollmentsByCourseId: string =
//   env === "development"
//     ? "https://examd-dev.uc.r.appspot.com/student/api/v1/fetchCanvasEnrollmentsByCourseId/"
//     : "${baseUrl}student/api/v1/fetchCanvasEnrollmentsByCourseId/";
// const autoCompleteSetup: string =
//   env === "development"
//     ? "https://examd-dev.uc.r.appspot.com/student/api/v1/autoCompleteSetup/"
//     : "${baseUrl}student/api/v1/autoCompleteSetup/";

// const saveLtiCanvasConfig: string =
//   env === "development"
//     ? "https://examd-dev.uc.r.appspot.com/student/api/v1/saveLtiCanvasConfig"
//     : "${baseUrl}student/api/v1/saveLtiCanvasConfig";

// const getLtiCanvasConfigByGuidCourseIdQuizId: string =
//   env === "development"
//     ? "https://examd-dev.uc.r.appspot.com/student/api/v1/getLtiCanvasConfigByGuidCourseIdQuizId"
//     : "${baseUrl}student/api/v1/getLtiCanvasConfigByGuidCourseIdQuizId";

// const fetchCanvasQuizzesByCourseId: string =
//   env === "development"
//     ? "https://examd-dev.uc.r.appspot.com/student/api/v1/fetchCanvasQuizzesByCourseId/"
//     : "${baseUrl}student/api/v1/fetchCanvasQuizzesByCourseId/";

// const viewCanvasProfile: string =
//   env === "development"
//     ? "https://examd-dev.uc.r.appspot.com/student/api/v1/viewCanvasProfile/"
//     : "${baseUrl}student/api/v1/viewCanvasProfile/";

// const downloadDL: string =
//   env === "development"
//     ? "https://examd-dev.uc.r.appspot.com/student/api/v1/downloadDL/"
//     : "${baseUrl}student/api/v1/downloadDL/";

// const saveLtiVideoRef: string =
//   env === "development"
//     ? "https://examd-dev.uc.r.appspot.com/student/api/v1/saveLtiVideoRef"
//     : "${baseUrl}student/api/v1/saveLtiVideoRef";

// const getQuizSubmissionsStateFromCanvas: string =
//   env === "development"
//     ? "https://examd-dev.uc.r.appspot.com/student/api/v1/getQuizSubmissionsStateFromCanvas/"
//     : "${baseUrl}student/api/v1/getQuizSubmissionsStateFromCanvas/";

// const completeCanvasQuizSubmission: string =
//   env === "development"
//     ? "https://examd-dev.uc.r.appspot.com/student/api/v1/completeCanvasQuizSubmission/1/"
//     : "${baseUrl}student/api/v1/completeCanvasQuizSubmission/1/";

// const newTabQuizUrl: string =
//   env === "development"
//     ? "https://examd.us/lti/config/index.html?"
//     : "${baseUrl}lti/config/index.html?";

// const fetchCanvasEnrollmentsByCourseId: string =
//   env === "development"
//     ? "https://examd.us/student/api/v1/fetchCanvasEnrollmentsByCourseId/"
//     : "${baseUrl}student/api/v1/fetchCanvasEnrollmentsByCourseId/";

// const sendEmail: string =
//   env === "development"
//     ? "https://examd.us/notification/api/v1/mail/sendEmail"
//     : "${baseUrl}notification/api/v1/mail/sendEmail";

// const generateOtpForCanvasQuiz: string =
//   env === "development"
//     ? "https://examd-dev.uc.r.appspot.com/student/api/v1/generateOtpForCanvasQuiz/"
//     : "${baseUrl}student/api/v1/generateOtpForCanvasQuiz/";

// const validateOtpForCanvasQuiz: string =
//   env === "development"
//     ? "https://examd-dev.uc.r.appspot.com/student/api/v1/validateOtpForCanvasQuiz/"
//     : "${baseUrl}student/api/v1/validateOtpForCanvasQuiz/";

// const aiMatch: string =
//   env === "development"
//     ? "https://examd.us/ai/frame/match"
//     : "${baseUrl}ai/frame/match";

// const getLtiStudentProfileDetails: string =
//   env === "development"
//     ? "https://examd.us/student/api/v1/getLtiStudentProfileDetails/"
//     : "${baseUrl}student/api/v1/getLtiStudentProfileDetails/";

// const uploadCanvasProfile: string =
//   env === "development"
//     ? "https://examd-dev.uc.r.appspot.com/student/api/v1/uploadCanvasProfile/"
//     : "${baseUrl}student/api/v1/uploadCanvasProfile/";

// const uploadCanvasDL: string =
//   env === "development"
//     ? "https://examd-dev.uc.r.appspot.com/student/api/v1/uploadCanvasDL/"
//     : "${baseUrl}student/api/v1/uploadCanvasDL/";

// const fetchCanvasCourseDetailsByCourseId: string =
//   env === "development"
//     ? "https://examd.us/student/api/v1/fetchCanvasCourseDetailsByCourseId/"
//     : "${baseUrl}student/api/v1/fetchCanvasCourseDetailsByCourseId/";

// const getLtiCVideoRef: string =
//   env === "development"
//     ? "https://examd-dev.uc.r.appspot.com/student/api/v1/getLtiCVideoRef"
//     : "${baseUrl}student/api/v1/getLtiCVideoRef";

// const getExceptions: string =
//   env === "development"
//     ? "https://examd.us/ai/db/excp/list/ex/"
//     : "${baseUrl}ai/db/excp/list/ex/";

// const saveLtiStudentProfile: string =
//   env === "development"
//     ? "https://examd.us/student/api/v1/saveLtiStudentProfile"
//     : "${baseUrl}student/api/v1/saveLtiStudentProfile";

// const getCanvasTokenUrl: string =
//   env === "development"
//     ? "https://examd.us/student/api/v1/getCanvasToken"
//     : "${baseUrl}student/api/v1/getCanvasToken";

let baseUrl: string | undefined = process.env.REACT_APP_BASE_URL;

const getEndPoints: string = `${baseUrl}cdn/urls/xproctor/1`;

const canvasEnrollmentsByCourseId: string = `${baseUrl}student/api/v1/fetchCanvasEnrollmentsByCourseId/`;

const autoCompleteSetup: string = `${baseUrl}student/api/v1/autoCompleteSetup/`;

const saveLtiCanvasConfig: string = `${baseUrl}student/api/v1/saveLtiCanvasConfig`;

const getLtiCanvasConfigByGuidCourseIdQuizId: string = `${baseUrl}student/api/v1/getLtiCanvasConfigByGuidCourseIdQuizId`;

const fetchCanvasQuizzesByCourseId: string = `${baseUrl}student/api/v1/fetchCanvasQuizzesByCourseId/`;

const viewCanvasProfile: string = `${baseUrl}student/api/v1/viewCanvasProfile/`;

const downloadDL: string = `${baseUrl}student/api/v1/downloadDL/`;

const saveLtiVideoRef: string = `${baseUrl}student/api/v1/saveLtiVideoRef`;

const getQuizSubmissionsStateFromCanvas: string = `${baseUrl}student/api/v1/getQuizSubmissionsStateFromCanvas/`;

const completeCanvasQuizSubmission: string = `${baseUrl}student/api/v1/completeCanvasQuizSubmission/1/`;

const newTabQuizUrl: string = `${baseUrl}lti/config/index.html?`;

const fetchCanvasEnrollmentsByCourseId: string = `${baseUrl}student/api/v1/fetchCanvasEnrollmentsByCourseId/`;

const sendEmail: string = `${baseUrl}notification/api/v1/mail/sendEmail`;

const generateOtpForCanvasQuiz: string = `${baseUrl}student/api/v1/generateOtpForCanvasQuiz/`;

const validateOtpForCanvasQuiz: string = `${baseUrl}student/api/v1/validateOtpForCanvasQuiz/`;

const aiMatch: string = `${baseUrl}ai/frame/match`;

const getLtiStudentProfileDetails: string = `${baseUrl}student/api/v1/getLtiStudentProfileDetails/`;

const uploadCanvasProfile: string = `${baseUrl}student/api/v1/uploadCanvasProfile/`;

const uploadCanvasDL: string = `${baseUrl}student/api/v1/uploadCanvasDL/`;

const fetchCanvasCourseDetailsByCourseId: string = `${baseUrl}student/api/v1/fetchCanvasCourseDetailsByCourseId/`;

const getLtiCVideoRef: string = `${baseUrl}student/api/v1/getLtiCanvasVideoRef`;

const getExceptions: string = `${baseUrl}ai/db/excp/list/ex/`;

const saveLtiStudentProfile: string = `${baseUrl}student/api/v1/saveLtiStudentProfile`;

const getCanvasTokenUrl: string = `${baseUrl}student/api/v1/getCanvasToken`;

const fetchAccountsByIdAndEnrollemntType: string = `${baseUrl}student/api/v1/fetchAccountsByIdAndEnrollemntType`;

const submitAssignment: string = `${baseUrl}student/api/v1/submitAssignment`;

const fetchCanvasAssignmentsByCourseId: string = `${baseUrl}student/api/v1/fetchCanvasAssignmentsByCourseId`;

export {
  getEndPoints,
  canvasEnrollmentsByCourseId,
  autoCompleteSetup,
  saveLtiCanvasConfig,
  getLtiCanvasConfigByGuidCourseIdQuizId,
  fetchCanvasQuizzesByCourseId,
  downloadDL,
  viewCanvasProfile,
  saveLtiVideoRef,
  getQuizSubmissionsStateFromCanvas,
  completeCanvasQuizSubmission,
  newTabQuizUrl,
  fetchCanvasEnrollmentsByCourseId,
  sendEmail,
  generateOtpForCanvasQuiz,
  validateOtpForCanvasQuiz,
  uploadCanvasDL,
  uploadCanvasProfile,
  aiMatch,
  getLtiStudentProfileDetails,
  fetchCanvasCourseDetailsByCourseId,
  getLtiCVideoRef,
  getExceptions,
  saveLtiStudentProfile,
  getCanvasTokenUrl,
  fetchAccountsByIdAndEnrollemntType,
  submitAssignment,
  fetchCanvasAssignmentsByCourseId
};
