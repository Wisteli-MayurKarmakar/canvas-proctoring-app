let baseUrl: string | undefined = process.env.REACT_APP_BASE_URL;

const gcpUrl: string = baseUrl + "student/api/v1";
const vpsUrl: string = baseUrl + "canvaslms/api/v1";

const getEndPoints: string = `${baseUrl}cdn/urls/xproctor/1`;

const newTabQuizUrl: string = `${baseUrl}lti/config/index.html?`;

const sendEmail: string = `${baseUrl}notification/api/v1/mail/sendEmail`;

const aiMatch: string = `${baseUrl}ai/frame/match`;

const getExceptions: string = `${baseUrl}ai/db/excp/list/ex/`;

const getMedia: string = `${baseUrl}media`;

const canvasEnrollmentsByCourseId: string = `${vpsUrl}/fetchCanvasEnrollmentsByCourseId/`;
const autoCompleteSetup: string = `${vpsUrl}/autoCompleteSetup/`;
const saveLtiCanvasConfig: string = `${vpsUrl}/saveLtiCanvasConfig`;
const getLtiCanvasConfigByGuidCourseIdQuizId: string = `${vpsUrl}/getLtiCanvasConfigByGuidCourseIdQuizId`;
const fetchCanvasQuizzesByCourseId: string = `${vpsUrl}/fetchCanvasQuizzesByCourseId/`;
const viewCanvasProfile: string = `${vpsUrl}/viewCanvasProfile/`;
const downloadDL: string = `${vpsUrl}/downloadDL/`;
const saveLtiVideoRef: string = `${vpsUrl}/saveLtiVideoRef`;
const getQuizSubmissionsStateFromCanvas: string = `${vpsUrl}/getQuizSubmissionsStateFromCanvas/`;
const completeCanvasQuizSubmission: string = `${vpsUrl}/completeCanvasQuizSubmission/1/`;
const fetchCanvasEnrollmentsByCourseId: string = `${vpsUrl}/fetchCanvasEnrollmentsByCourseId/`;
const generateOtpForCanvasQuiz: string = `${vpsUrl}/generateOtpForCanvasQuiz/`;
const validateOtpForCanvasQuiz: string = `${vpsUrl}/validateOtpForCanvasQuiz/`;
const getLtiStudentProfileDetails: string = `${vpsUrl}/getLtiStudentProfileDetails/`;
const uploadCanvasProfile: string = `${vpsUrl}/uploadCanvasProfile/`;
const uploadCanvasDL: string = `${vpsUrl}/uploadCanvasDL/`;
const fetchCanvasCourseDetailsByCourseId: string = `${vpsUrl}/fetchCanvasCourseDetailsByCourseId/`;
const getLtiCVideoRef: string = `${vpsUrl}/getLtiCanvasVideoRef`;
const saveLtiStudentProfile: string = `${vpsUrl}/saveLtiStudentProfile`;
const getCanvasTokenUrl: string = `${vpsUrl}/getCanvasToken`;
const fetchAccountsByIdAndEnrollemntType: string = `${vpsUrl}/fetchAccountsByIdAndEnrollemntType`;
const submitAssignment: string = `${vpsUrl}/submitAssignment`;
const fetchCanvasAssignmentsByCourseId: string = `${vpsUrl}/fetchCanvasAssignmentsByCourseId`;
const getLtiCanvasConfigByAssignment: string = `${vpsUrl}/getLtiCanvasConfigByAssignment`;
const saveScheduling: string = `${vpsUrl}/saveLtiSchedule`;
const getScheduling: string = `${vpsUrl}/getLtiSchedule`;
const getCanvasAssignmentDetails: string = `${vpsUrl}/getCanvasAssignmentDetails`;
const fetchAccountsByCourseAndEnrollemntType: string = `${vpsUrl}/fetchAccountsByCourseAndEnrollemntType`;
const fetchCanvasEnrollmentsByInstituteForThreeHours: string = `${vpsUrl}/fetchCanvasEnrollmentsByInstituteForThreeHours`;
const fetchCanvasEnrollmentsByInstituteForTwentyFourHours: string = `${vpsUrl}/fetchCanvasEnrollmentsByInstituteForTwentyFourHours`;
const fetchCanvasEnrollmentsByInstituteForSevenDays: string = `${vpsUrl}/fetchCanvasEnrollmentsByInstituteForSevenDays`;
const getGetCanvasQuizDetails: string = `${vpsUrl}/getGetCanvasQuizDetails`;
const saveLtiAccessibility: string = `${vpsUrl}/saveLtiAccessibility`;
const getLtiAccessibility: string = `${vpsUrl}/getLtiAccessibility`;
const saveLtiAccessibilityApproval: string = `${vpsUrl}/saveLtiAccessibilityApproval`;
const getLtiAccessibilityApproval: string = `${vpsUrl}/getLtiAccessibilityApproval`;
const getLtiScheduleByQuizId: string = `${vpsUrl}/getLtiScheduleByQuizId`;
const saveLtiBillingRate: string = `${vpsUrl}/saveLtiBillingRate`;
const getLtiBillingRate: string = `${vpsUrl}/getLtiBillingRate`;
const saveLtiProctorJourney: string = `${vpsUrl}/saveLtiProctorJourney`;
const getLtiProctorJourney: string = `${vpsUrl}/getLtiProctorJourney`;
const saveLtiStudentJourney: string = `${vpsUrl}/saveLtiStudentJourney`;
const getLtiStudentJourney: string = `${vpsUrl}/getLtiStudentJourney`;

export {
  getEndPoints,
  fetchAccountsByCourseAndEnrollemntType,
  saveScheduling,
  getCanvasAssignmentDetails,
  getLtiProctorJourney,
  getLtiStudentJourney,
  saveLtiProctorJourney,
  saveLtiStudentJourney,
  getGetCanvasQuizDetails,
  saveLtiAccessibility,
  saveLtiAccessibilityApproval,
  saveLtiBillingRate,
  getLtiBillingRate,
  getLtiAccessibilityApproval,
  getLtiAccessibility,
  getScheduling,
  getLtiScheduleByQuizId,
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
