import axios from "axios";

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

const getLtiCanvasConfigByAssignment: string = `${baseUrl}student/api/v1/getLtiCanvasConfigByAssignment`;

const getMedia: string = `${baseUrl}media`;

const saveScheduling: string = `${baseUrl}student/api/v1/saveLtiSchedule`;

const getScheduling: string = `${baseUrl}student/api/v1/getLtiSchedule`;

const getCanvasAssignmentDetails: string = `${baseUrl}student/api/v1/getCanvasAssignmentDetails`;

const fetchAccountsByCourseAndEnrollemntType: string = `${baseUrl}student/api/v1/fetchAccountsByCourseAndEnrollemntType`;

const fetchCanvasEnrollmentsByInstituteForThreeHours: string = `${baseUrl}student/api/v1/fetchCanvasEnrollmentsByInstituteForThreeHours`;

const fetchCanvasEnrollmentsByInstituteForTwentyFourHours: string = `${baseUrl}student/api/v1/fetchCanvasEnrollmentsByInstituteForTwentyFourHours`;

const fetchCanvasEnrollmentsByInstituteForSevenDays: string = `${baseUrl}student/api/v1/fetchCanvasEnrollmentsByInstituteForSevenDays`;

const getGetCanvasQuizDetails: string = `${baseUrl}student/api/v1/getGetCanvasQuizDetails`;

const saveLtiAccessibility: string = `${baseUrl}student/api/v1/saveLtiAccessibility`;

const getLtiAccessibility: string = `${baseUrl}student/api/v1/getLtiAccessibility`;

const saveLtiAccessibilityApproval: string = `${baseUrl}student/api/v1/saveLtiAccessibilityApproval`;

const getLtiAccessibilityApproval: string = `${baseUrl}student/api/v1/getLtiAccessibilityApproval`;

export {
  getEndPoints,
  fetchAccountsByCourseAndEnrollemntType,
  saveScheduling,
  getCanvasAssignmentDetails,
  getGetCanvasQuizDetails,
  saveLtiAccessibility,
  saveLtiAccessibilityApproval,
  getLtiAccessibilityApproval,
  getLtiAccessibility,
  getScheduling,
  canvasEnrollmentsByCourseId,
  fetchCanvasEnrollmentsByInstituteForThreeHours,
  fetchCanvasEnrollmentsByInstituteForTwentyFourHours,
  fetchCanvasEnrollmentsByInstituteForSevenDays,
  autoCompleteSetup,
  saveLtiCanvasConfig,
  getLtiCanvasConfigByGuidCourseIdQuizId,
  fetchCanvasQuizzesByCourseId,
  downloadDL,
  getMedia,
  viewCanvasProfile,
  saveLtiVideoRef,
  getLtiCanvasConfigByAssignment,
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
  fetchCanvasAssignmentsByCourseId,
};
