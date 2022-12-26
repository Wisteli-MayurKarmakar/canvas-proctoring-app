import axios from "axios";
import moment, { Moment } from "moment";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { getLtiCanvasConfigByAssignment, getScheduling } from "../apiConfigs";
import { useAppStore } from "./AppSotre";
import { useStudentWorflowControllerStore } from "./StudentWorkflowControllerStore";

type Assignment = {
  id: number;
  name: string;
  due_at: string;
  lock_at: string;
  unlock_at: string;
  allowed_attempts: number;
  question_count: number;
  time_limit: number;
  studentAuthed: boolean;
};

type AssignmentConfiguration = {
  assignmentId: number;
  availableFrom: string;
  availableUntil: string;
  calculatorAllowed: boolean;
  cellPhone: boolean;
  chat: boolean;
  courseId: string;
  disableCopyPaste: boolean;
  disablePrinting: boolean;
  dueDate: string;
  examdLiveLaunch: boolean;
  examdProctored: boolean;
  idLtiCanvasConfig: string;
  idUser: string;
  instructorProctored: false;
  liveHelp: boolean;
  lockdownBrowser: boolean;
  moduleId: number;
  multiplePerson: boolean;
  noPersonInRoom: boolean;
  otp: boolean;
  postExamReview: boolean;
  quizId: string;
  recordAudio: boolean;
  recordScreen: boolean;
  recordWebcam: boolean;
  roomScan: boolean;
  scratchPadAllowed: boolean;
  speaking: boolean;
  studentIdDl: boolean;
  studentPicture: boolean;
  toolConsumerInstanceGuid: string;
  whitelistPages: boolean;
};

export type StudentEnrollments = {
  course_id: string;
  enrollment_state: string;
  id: string;
  role: string;
  status: string;
  type: string;
  idApprovalStatus?: boolean;
  user: { id: string; name: string; login_id: string };
  user_id: string;
};

type CommonStudentDashboardStore = {
  enrollments?: StudentEnrollments;
  loggedInUserEnrollmentType: string;
  setEnrollments: (data: StudentEnrollments) => void;
  setLoggedInUserEnrollmentType: (type: string) => void;
  updateEnrollmentWithIdApprovalStatus: (data: StudentEnrollments) => void;
};

type Schedule = {
  assignmentId: number;
  courseId: number;
  instituteId: number;
  quizId: number;
  scheduleDate: string;
  scheduleId: string;
  status: number;
  studentId: number;
};

type AssignmentStore = {
  assignments?: Assignment[];
  selectedAssignment?: Assignment;
  showAuth: boolean;
  disableAuth: boolean;
  selectedAssignmentConfigurations?: AssignmentConfiguration;
  selectedAssignmentSchedules: Schedule | null;
  schedulesAvailable: boolean;
  gotoQuiz: boolean;
  scheduleExpired?: boolean;
  assignmentSubmitted: boolean;
  isProctoredAssignment?: boolean;
  isNewTabOpen?: boolean;
  checkAssignmentSchedules: () => void;
  setAssignments: (assignments: Assignment[]) => void;
  setSelectedAssignment: (assignment: Assignment) => void;
  setAssignmentConfiguration: (configuration: AssignmentConfiguration) => void;
  setStudentAuthed: () => void;
  setAssignmentSubmitted: (flag: boolean) => void;
};

const getQuizConfigs = async (assignmentId: number, guid: string) => {
  let response = await axios.get(
    `${getLtiCanvasConfigByAssignment}/${guid}/${assignmentId}`
  );

  if (response.status === 200) {
    return response.data;
  }

  return null;
};

const getAssignmentSchedule = async (isProctoredAssignment: boolean) => {
  let res: boolean = false;

  const assignmentId = useAssignmentStore.getState().selectedAssignment?.id;
  const instituteId = useAppStore.getState().tokenData.instituteId;
  const quizId =
    useAssignmentStore.getState().selectedAssignmentConfigurations?.quizId;
  const courseId = useAppStore.getState().urlParamsData.courseId;
  const studentId = useAppStore.getState().urlParamsData.studentId;
  const guid = useAppStore.getState().urlParamsData.guid;

  let data = {
    scheduleId: "",
    instituteId: instituteId,
    assignmentId: assignmentId,
    quizId: quizId,
    studentId: studentId,
    courseId: courseId,
    scheduleDate: "",
    guid: guid,
    status: "0",
  };

  try {
    let response: any = await axios.post(
      `${getScheduling}`,
      {
        ...data,
      },
      {
        headers: {
          Authorization: `Bearer ${
            useAppStore.getState().tokenData.lmsAccessToken
          }`,
        },
      }
    );

    if (response.status === 200) {
      const today: Moment = moment();
      const timezoneOffset: string = `.${Math.abs(
        moment().utcOffset()
      ).toString()}Z`;
      const scheduleDate: Moment = moment(
        response.data.scheduleDate + timezoneOffset
      );
      let scheduleExpired: boolean = false;
      if (
        today.diff(scheduleDate, "minutes") > 0 ||
        today.diff(scheduleDate, "days")
      ) {
        scheduleExpired = true;
      }
      useAssignmentStore.setState({
        selectedAssignmentSchedules: response.data,
        scheduleExpired: scheduleExpired,
      });
      if (Object.keys(data).length > 0) {
        res = true;
      }
      if (!isProctoredAssignment && scheduleExpired) {
        useAssignmentStore.setState({
          gotoQuiz: true,
        });
      }
      if (isProctoredAssignment && scheduleExpired) {
        useAssignmentStore.setState({
          gotoQuiz: true,
        });
      }
    }
    useAssignmentStore.setState({ schedulesAvailable: res });
  } catch (err) {
    if (!isProctoredAssignment) {
      useAssignmentStore.setState({
        selectedAssignmentSchedules: null,
        gotoQuiz: true,
      });
      useStudentWorflowControllerStore.setState({
        showAuthButton: true,
        enableAuth: true,
      });
    } else {
      useAssignmentStore.setState({
        schedulesAvailable: false,
        scheduleExpired: true,
        selectedAssignmentSchedules: null,
      });
    }
  }
};

const checkIfProctored = async (assignmentConfig: AssignmentConfiguration) => {
  let resProctoring: boolean = false;

  if (
    assignmentConfig.instructorProctored ||
    assignmentConfig.examdLiveLaunch ||
    assignmentConfig.examdProctored
  ) {
    resProctoring = true;
  }
  useAssignmentStore.setState({ isProctoredAssignment: resProctoring });
  await getAssignmentSchedule(resProctoring);
};

export const useAssignmentStore = create<AssignmentStore>()(
  devtools(
    (set, get) => ({
      // isProctoredAssignment: false,
      showAuth: false,
      disableAuth: true,
      schedulesAvailable: false,
      assignmentSubmitted: false,
      gotoQuiz: false,
      selectedAssignmentSchedules: null,
      isNewTabOpen: false,
      setAssignments: (assignments: Assignment[]) => {
        let assignmentsWithStudentAuthStatus = assignments.map(
          (assignment: Assignment) => {
            return {
              ...assignment,
              studentAuthed: false,
            };
          }
        );
        set({
          assignments: assignmentsWithStudentAuthStatus,
        });
      },
      setSelectedAssignment: async (assignment: Assignment) => {
        set({
          isProctoredAssignment: false,
          schedulesAvailable: false,
          selectedAssignmentConfigurations: undefined,
          selectedAssignmentSchedules: null,
        });
        get().assignments?.forEach((item: Assignment) => {
          if (item.id === assignment.id) {
            set({
              selectedAssignment: item,
              selectedAssignmentConfigurations: undefined,
            });
          }
        });
        const { urlParamsData } = useAppStore.getState();
        let res = await getQuizConfigs(
          assignment.id,
          urlParamsData.guid as string
        );

        set({
          selectedAssignmentConfigurations: res,
        });
        await checkIfProctored(res);
      },
      setAssignmentConfiguration: (configuration: AssignmentConfiguration) => {
        set({
          selectedAssignmentConfigurations: configuration,
        });
      },
      setStudentAuthed: () => {
        let assignments: Assignment[] = get().assignments as any;
        let selectedAssgn: Assignment = get().selectedAssignment as any;
        let res: Assignment[] = assignments.map((item: Assignment) => {
          if (item.id === get().selectedAssignment?.id) {
            item.studentAuthed = true;
          }
          return item;
        });
        if (selectedAssgn) {
          set({
            selectedAssignment: { ...selectedAssgn, studentAuthed: true },
          });
        }
        set({
          assignments: res,
        });
      },
      checkAssignmentSchedules: async () => {
        const isProctoredAssignment = get().isProctoredAssignment;
        if (isProctoredAssignment) {
          await getAssignmentSchedule(isProctoredAssignment);
        }
      },
      setAssignmentSubmitted: (flag: boolean) => {
        set({
          assignmentSubmitted: flag,
        });
      },
    }),
    { name: "Assignment Store" }
  )
);

export const useCommonStudentDashboardStore =
  create<CommonStudentDashboardStore>()(
    devtools(
      (set) => ({
        loggedInUserEnrollmentType: "",
        setEnrollments: (studentEnrollments: StudentEnrollments) => {
          set({
            enrollments: studentEnrollments,
          });
        },
        setStudentAuthed: (flag: boolean) => {
          set({});
        },
        setLoggedInUserEnrollmentType: (type: string) => {
          set({
            loggedInUserEnrollmentType: type,
          });
        },
        updateEnrollmentWithIdApprovalStatus: (data: StudentEnrollments) => {
          set({
            enrollments: data
          })
        },
      }),
      { name: "Common Student_Dashboard_Store" }
    )
  );
