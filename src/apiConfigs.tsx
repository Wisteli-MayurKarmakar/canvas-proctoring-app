let baseUrl: string | undefined = process.env.REACT_APP_BASE_URL;

const baseAiUrl: string = process.env.REACT_APP_BASE_AI_URL as string

const baseApiUrl: string = baseUrl + "canvaslms/api/v1";

const getEndPoints: string = `${baseUrl}cdn/urls/xproctor/1`;

const newTabQuizUrl: string = `${baseUrl}lti/config/index.html?`;

const sendEmail: string = `${baseUrl}notification/api/v1/mail/sendEmail`;

const aiMatch: string = `${baseAiUrl}ai/frame/match`;

const getExceptions: string = `${baseAiUrl}ai/db/excp/list/ex/`;

const getMedia: string = `${baseAiUrl}media`;

const canvasEnrollmentsByCourseId: string = `${baseApiUrl}/fetchCanvasEnrollmentsByCourseId/`;
const autoCompleteSetup: string = `${baseApiUrl}/autoCompleteSetup/`;
const saveLtiCanvasConfig: string = `${baseApiUrl}/saveLtiCanvasConfig`;
const getLtiCanvasConfigByGuidCourseIdQuizId: string = `${baseApiUrl}/getLtiCanvasConfigByGuidCourseIdQuizId`;
const fetchCanvasQuizzesByCourseId: string = `${baseApiUrl}/fetchCanvasQuizzesByCourseId/`;
const viewCanvasProfile: string = `${baseApiUrl}/downloadUserProfileImage/`;
const downloadDL: string = `${baseApiUrl}/downloadUserDL/`;
const saveLtiVideoRef: string = `${baseApiUrl}/saveLtiVideoRef`;
const getQuizSubmissionsStateFromCanvas: string = `${baseApiUrl}/getQuizSubmissionsStateFromCanvas/`;
const completeCanvasQuizSubmission: string = `${baseApiUrl}/completeCanvasQuizSubmission/1/`;
const fetchCanvasEnrollmentsByCourseId: string = `${baseApiUrl}/fetchCanvasEnrollmentsByCourseId/`;
const generateOtpForCanvasQuiz: string = `${baseApiUrl}/generateOtpForCanvasQuiz/`;
const validateOtpForCanvasQuiz: string = `${baseApiUrl}/validateOtpForCanvasQuiz/`;
const getLtiStudentProfileDetails: string = `${baseApiUrl}/getLtiStudentProfileDetails/`;
const uploadCanvasProfile: string = `${baseApiUrl}/uploadUserProfileImage/`;
const uploadCanvasDL: string = `${baseApiUrl}/uploadUserDL/`;
const fetchCanvasCourseDetailsByCourseId: string = `${baseApiUrl}/fetchCanvasCourseDetailsByCourseId`;
const getLtiCVideoRef: string = `${baseApiUrl}/getLtiCanvasVideoRef`;
const saveLtiStudentProfile: string = `${baseApiUrl}/saveLtiStudentProfile`;
const getCanvasTokenUrl: string = `${baseApiUrl}/getCanvasToken`;
const fetchAccountsByIdAndEnrollemntType: string = `${baseApiUrl}/fetchAccountsByIdAndEnrollemntType`;
const submitAssignment: string = `${baseApiUrl}/submitAssignment`;
const fetchCanvasAssignmentsByCourseId: string = `${baseApiUrl}/fetchCanvasAssignmentsByCourseId`;
const getLtiCanvasConfigByAssignment: string = `${baseApiUrl}/getLtiCanvasConfigByAssignment`;
const saveScheduling: string = `${baseApiUrl}/saveLtiSchedule`;
const getScheduling: string = `${baseApiUrl}/getLtiSchedule`;
const getCanvasAssignmentDetails: string = `${baseApiUrl}/getCanvasAssignmentDetails`;
const fetchAccountsByCourseAndEnrollemntType: string = `${baseApiUrl}/fetchAccountsByCourseAndEnrollemntType`;
const fetchCanvasEnrollmentsByInstituteForThreeHours: string = `${baseApiUrl}/fetchCanvasEnrollmentsByInstituteForThreeHours`;
const fetchCanvasEnrollmentsByInstituteForTwentyFourHours: string = `${baseApiUrl}/fetchCanvasEnrollmentsByInstituteForTwentyFourHours`;
const fetchCanvasEnrollmentsByInstituteForSevenDays: string = `${baseApiUrl}/fetchCanvasEnrollmentsByInstituteForSevenDays`;
const getCanvasQuizDetails: string = `${baseApiUrl}/getCanvasQuizDetails`;
const saveLtiAccessibility: string = `${baseApiUrl}/saveLtiAccessibility`;
const getLtiAccessibility: string = `${baseApiUrl}/getLtiAccessibility`;
const saveLtiAccessibilityApproval: string = `${baseApiUrl}/saveLtiAccessibilityApproval`;
const getLtiAccessibilityApproval: string = `${baseApiUrl}/getLtiAccessibilityApproval`;
const getLtiScheduleByQuizId: string = `${baseApiUrl}/getLtiScheduleByQuizId`;
const saveLtiBillingRate: string = `${baseApiUrl}/saveLtiBillingRate`;
const getLtiBillingRate: string = `${baseApiUrl}/getLtiBillingRate`;
const saveLtiProctorJourney: string = `${baseApiUrl}/saveLtiProctorJourney`;
const getLtiProctorJourney: string = `${baseApiUrl}/getLtiProctorJourney`;
const saveLtiStudentJourney: string = `${baseApiUrl}/saveLtiStudentJourney`;
const getLtiStudentJourney: string = `${baseApiUrl}/getLtiStudentJourney`;
const getLtiInstitute: string = `${baseApiUrl}/getLtiInstitute`;
const saveLtiInstitute: string = `${baseApiUrl}/saveLtiInstitute`;
const saveLtiPayments: string = `${baseApiUrl}/saveLtiPayments`;
const getLtiPayments: string = `${baseApiUrl}/getLtiPayments`;
const saveLtiConsumptions: string = `${baseApiUrl}/saveLtiConsumptions`;
const getLtiConsumptions: string = `${baseApiUrl}/getLtiConsumptions`;
const recoverQuiz: string = `${baseApiUrl}/recoverQuiz`;
const updateLtiAccessRecord: string = `${baseApiUrl}/lti-access`;
const createSampleQuiz: string = `${baseApiUrl}/createQuiz`
const deleteQuizConfig: string = `${baseApiUrl}/deleteQuiz`
// const getLtiAccessByGuid: string = `http://canvaslmsdev.eba-9ambmmcn.us-east-1.elasticbeanstalk.com/canvaslms/api/v1/lti-access-guid`
// const ltiEmailNotificationTypes: string =
//   "http://canvaslmsdev.eba-9ambmmcn.us-east-1.elasticbeanstalk.com/canvaslms/api/v1/lti-email-notification-types";
// const ltiDefaultEmailTemplate: string =
//   "http://canvaslmsdev.eba-9ambmmcn.us-east-1.elasticbeanstalk.com/canvaslms/api/v1/lti-default-email-template";
// const ltiTestEmail: string =
//   "http://canvaslmsdev.eba-9ambmmcn.us-east-1.elasticbeanstalk.com/canvaslms/api/v1/lti-test-email";
// const createLtiEmailTopic: string = "http://canvaslmsdev.eba-9ambmmcn.us-east-1.elasticbeanstalk.com/canvaslms/api/v1/lti-email-topic"
const getLtiCanvasConfigByGuidCourseId: string = `${baseApiUrl}/getLtiCanvasConfigByGuidCourseId`
const getLtiAccessByGuid: string = `${baseApiUrl}/lti-access-guid`;
const ltiEmailNotificationTypes: string = `${baseApiUrl}/lti-email-notification-types`;
const ltiDefaultEmailTemplate: string = `${baseApiUrl}/lti-default-email-template`;
const ltiTestEmail: string = `${baseApiUrl}/lti-test-email`;
const createLtiEmailTopic: string = `${baseApiUrl}/lti-email-topic`;
const createQuiz: string =`${baseApiUrl}/createQuiz`
const addSampleQuestion: string = `${baseApiUrl}/createOneQuestion`
const getLtiCanvasVideoCombRef: string = `${baseApiUrl}/getLtiCanvasVideoCombRef`

export {
  getEndPoints,
  createSampleQuiz,
  getLtiCanvasVideoCombRef,
  deleteQuizConfig,
  addSampleQuestion,
  createQuiz,
  fetchAccountsByCourseAndEnrollemntType,
  saveScheduling,
  updateLtiAccessRecord,
  getCanvasAssignmentDetails,
  getLtiProctorJourney,
  saveLtiPayments,
  getLtiAccessByGuid,
  saveLtiInstitute,
  getLtiPayments,
  getLtiStudentJourney,
  saveLtiConsumptions,
  recoverQuiz,
  getLtiInstitute,
  getLtiConsumptions,
  saveLtiProctorJourney,
  ltiDefaultEmailTemplate,
  saveLtiStudentJourney,
  ltiEmailNotificationTypes,
  createLtiEmailTopic,
  getCanvasQuizDetails,
  saveLtiAccessibility,
  getLtiCanvasConfigByGuidCourseId,
  ltiTestEmail,
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
