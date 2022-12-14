//URLS
let env = process.env.NODE_ENV;
export const URL_BASE =
  env === "development"
    ? "https://examd-dev.uc.r.appspot.com/student/api/v1/"
    : "https://examd.online/student/api/v1/";
export const COURSES_BY_QUIZ_ID_URL =
  URL_BASE + "fetchCanvasQuizzesByCourseId/";
export const ENROLLMENTS_BY_COURSE_ID_URL =
  URL_BASE + "fetchCanvasEnrollmentsByCourseId/";

// export default {
//     URL_BASE,
//     COURSES_BY_QUIZ_ID_URL,
//     ENROLLMENTS_BY_COURSE_ID_URL
// }
