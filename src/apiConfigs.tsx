let env: string = process.env.NODE_ENV;

const getEndPoints: string =
  env === "development"
    ? "https://examd.us/cdn/urls/xproctor/1"
    : "https://examd.online/cdn/urls/xproctor/1";
const canvasEnrollmentsByCourseId: string =
  env === "development"
    ? "https://examd-dev.uc.r.appspot.com/student/api/v1/fetchCanvasEnrollmentsByCourseId/"
    : "https://examd.online/student/api/v1/fetchCanvasEnrollmentsByCourseId/";
const autoCompleteSetup: string =
  env === "development"
    ? "https://examd-dev.uc.r.appspot.com/student/api/v1/autoCompleteSetup/"
    : "https://examd.online/student/api/v1/autoCompleteSetup/";

const saveLtiCanvasConfig: string =
  env === "development"
    ? "https://examd-dev.uc.r.appspot.com/student/api/v1/saveLtiCanvasConfig"
    : "https://examd.online/student/api/v1/saveLtiCanvasConfig";

const getLtiCanvasConfigByGuidCourseIdQuizId: string =
  env === "development"
    ? "https://examd-dev.uc.r.appspot.com/student/api/v1/getLtiCanvasConfigByGuidCourseIdQuizId"
    : "https://examd.online/student/api/v1/getLtiCanvasConfigByGuidCourseIdQuizId";

const fetchCanvasQuizzesByCourseId: string =
  env === "development"
    ? "https://examd-dev.uc.r.appspot.com/student/api/v1/fetchCanvasQuizzesByCourseId/"
    : "https://examd.online/student/api/v1/fetchCanvasQuizzesByCourseId/";

const viewCanvasProfile: string =
  env === "development"
    ? "https://examd-dev.uc.r.appspot.com/student/api/v1/viewCanvasProfile/"
    : "https://examd.online/student/api/v1/viewCanvasProfile/";

const downloadDL: string =
  env === "development"
    ? "https://examd-dev.uc.r.appspot.com/student/api/v1/downloadDL/"
    : "https://examd.online/student/api/v1/downloadDL/";

const saveLtiVideoRef: string =
  env === "development"
    ? "https://examd-dev.uc.r.appspot.com/student/api/v1/saveLtiVideoRef"
    : "https://examd.online/student/api/v1/saveLtiVideoRef";

const getQuizSubmissionsStateFromCanvas: string =
  env === "development"
    ? "https://examd-dev.uc.r.appspot.com/student/api/v1/getQuizSubmissionsStateFromCanvas/"
    : "https://examd.online/student/api/v1/getQuizSubmissionsStateFromCanvas/";

const completeCanvasQuizSubmission: string =
  env === "development"
    ? "https://examd-dev.uc.r.appspot.com/student/api/v1/completeCanvasQuizSubmission/1/"
    : "https://examd.online/student/api/v1/completeCanvasQuizSubmission/1/";

const newTabQuizUrl: string =
  env === "development"
    ? "https://examd.us/lti/config/index.html?"
    : "https://examd.online/lti/config/index.html?";

const fetchCanvasEnrollmentsByCourseId: string =
  env === "development"
    ? "https://examd.us/student/api/v1/fetchCanvasEnrollmentsByCourseId/"
    : "https://examd.online/student/api/v1/fetchCanvasEnrollmentsByCourseId/";

const sendEmail: string =
  env === "development"
    ? "https://examd.us/notification/api/v1/mail/sendEmail"
    : "https://examd.online/notification/api/v1/mail/sendEmail";

const generateOtpForCanvasQuiz: string =
  env === "development"
    ? "https://examd-dev.uc.r.appspot.com/student/api/v1/generateOtpForCanvasQuiz/"
    : "https://examd.online/student/api/v1/generateOtpForCanvasQuiz/";

const validateOtpForCanvasQuiz: string =
  env === "development"
    ? "https://examd-dev.uc.r.appspot.com/student/api/v1/validateOtpForCanvasQuiz/"
    : "https://examd.online/student/api/v1/validateOtpForCanvasQuiz/";

const aiMatch: string =
  env === "development"
    ? "https://examd.us/ai/frame/match"
    : "https://examd.online/ai/frame/match";

const getLtiStudentProfileDetails: string =
  env === "development"
    ? "https://examd.us/student/api/v1/getLtiStudentProfileDetails/"
    : "https://examd.online/student/api/v1/getLtiStudentProfileDetails/";

const uploadCanvasProfile: string =
  env === "development"
    ? "https://examd-dev.uc.r.appspot.com/student/api/v1/uploadCanvasProfile/"
    : "https://examd.online/student/api/v1/uploadCanvasProfile/";

const uploadCanvasDL: string =
  env === "development"
    ? "https://examd-dev.uc.r.appspot.com/student/api/v1/uploadCanvasDL/"
    : "https://examd.online/student/api/v1/uploadCanvasDL/";

const fetchCanvasCourseDetailsByCourseId: string =
  env === "development"
    ? "https://examd.us/student/api/v1/fetchCanvasCourseDetailsByCourseId/"
    : "https://examd.online/student/api/v1/fetchCanvasCourseDetailsByCourseId/";

const getLtiCVideoRef: string =
  env === "development"
    ? "https://examd-dev.uc.r.appspot.com/student/api/v1/getLtiCVideoRef"
    : "https://examd.online/student/api/v1/getLtiCVideoRef";

const getExceptions: string =
  env === "development"
    ? "https://examd.us/ai/db/excp/list/ex/"
    : "https://examd.online/ai/db/excp/list/ex/";

const saveLtiStudentProfile: string =
  env === "development"
    ? "https://examd.us/student/api/v1/saveLtiStudentProfile"
    : "https://examd.online/student/api/v1/saveLtiStudentProfile";

const getCanvasTokenUrl: string =
  env === "development"
    ? "https://examd.us/student/api/v1/getCanvasToken"
    : "https://examd.online/student/api/v1/getCanvasToken";

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
  getCanvasTokenUrl
};
