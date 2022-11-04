import axios from "axios";
import produce from "immer";
import moment from "moment";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { getLtiCanvasConfigByAssignment, getScheduling } from "../apiConfigs";
import { useAppStore } from "./AppSotre";

type Assignment = {
  due_at: string;
  id: number;
  name: string;
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

type StudentEnrollments = {
  course_id: string;
  enrollment_state: string;
  id: string;
  role: string;
  status: string;
  type: string;
  user: { id: string; name: string; login_id: string };
  user_id: string;
};

type CommonStudentDashboardStore = {
  enrollments?: StudentEnrollments;
  setEnrollments: (data: StudentEnrollments) => void;
};

type AssignmentStore = {
  assignments?: Assignment[];
  selectedAssignment?: Assignment;
  selectedAssignmentConfigurations?: AssignmentConfiguration;
  schedulesAvailable: boolean;
  isProctoredAssignment: boolean;
  checkAssignmentSchedules: () => void;
  setAssignments: (assignments: Assignment[]) => void;
  setSelectedAssignment: (assignment: Assignment) => void;
  setAssignmentConfiguration: (configuration: AssignmentConfiguration) => void;
  setStudentAuthed: () => void;
};

const getQuizConfigs = async (assignmentId: number) => {
  let response = await axios.get(
    `${getLtiCanvasConfigByAssignment}/${assignmentId}`
  );

  if (response.status === 200) {
    return response.data;
  }

  return null;
};

const getAssignmentSchedule = async () => {
  let res: boolean = false;

  const assignmentId = useAssignmentStore.getState().selectedAssignment?.id;
  const instituteId = useAppStore.getState().tokenData.instituteId;
  const quizId = useAppStore.getState().urlParamsData.quizId;
  const courseId = useAppStore.getState().urlParamsData.courseId;
  const studentId = useAppStore.getState().urlParamsData.studentId;

  let data = {
    scheduleId: "",
    instituteId: instituteId,
    assignmentId: assignmentId,
    quizId: quizId,
    studentId: studentId,
    courseId: courseId,
    scheduleDate: "",
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
      if (Object.keys(data).length > 0) {
        res = true;
      }
    }
    useAssignmentStore.setState({ schedulesAvailable: true });
  } catch (err) {}
};

const checkIfProctored = async (
  assignmentConfig: AssignmentConfiguration
) => {
  let resProctoring: boolean = false;

  if (assignmentConfig.instructorProctored || assignmentConfig.examdLiveLaunch) {
    resProctoring = true;
    useAssignmentStore.setState({ isProctoredAssignment: resProctoring });

    await getAssignmentSchedule();
  }
};

export const useAssignmentStore = create<AssignmentStore>()(
  devtools(
    (set, get) => ({
      isProctoredAssignment: false,
      schedulesAvailable: false,
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
        });
        get().assignments?.forEach((item: Assignment) => {
          if (item.id === assignment.id) {
            set({
              selectedAssignment: item,
              selectedAssignmentConfigurations: undefined,
            });
          }
        });
        let res = await getQuizConfigs(assignment.id);

        set({
          selectedAssignmentConfigurations: res,
        });
        await checkIfProctored(res);
        // if (res) {
        //   let flag: {
        //     resProctoring: boolean;
        //     resSchedule: boolean;
        //   } = await checkIfProctored(res);
        //   console.log("here", flag);

        //   set({
        //     isProctoredAssignment: flag.resProctoring,
        //     schedulesAvailable: flag.resSchedule,
        //   });
        // } else {
        //   set({
        //     selectedAssignmentConfigurations: undefined,
        //   });
        // }
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
        await getAssignmentSchedule();
      },
    }),
    { name: "Assignment Store" }
  )
);

export const useCommonStudentDashboardStore =
  create<CommonStudentDashboardStore>()(
    devtools(
      (set) => ({
        setEnrollments: (studentEnrollments: StudentEnrollments) => {
          set({
            enrollments: studentEnrollments,
          });
        },
        setStudentAuthed: (flag: boolean) => {
          set({});
        },
      }),
      { name: "Common Student_Dashboard_Store" }
    )
  );
