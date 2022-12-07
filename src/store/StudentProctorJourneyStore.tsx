import axios from "axios";
import create from "zustand";
import { devtools } from "zustand/middleware";
import {
  getLtiProctorJourney,
  getLtiStudentJourney,
  saveLtiProctorJourney,
  saveLtiStudentJourney,
} from "../apiConfigs";
import {
  ProctorJourney,
  ProctorJourneyStore,
  StudentJourney,
  StudentJourneyStore,
} from "../AppTypes";
import { useAppStore } from "./AppSotre";
import {
  useAssignmentStore,
  useCommonStudentDashboardStore,
} from "./StudentDashboardStore";

const { urlParamsData } = useAppStore.getState();
const { selectedAssignmentConfigurations } = useAssignmentStore.getState();

const getStudentJourneyDetails = async (
  courseId: number,
  guid: string,
  quizId: number,
  studentId: number,
  assignmentId: number
): Promise<StudentJourney[] | null> => {
  let data = {
    guid: guid,
    studentId: studentId,
    assignmentId: assignmentId,
    quizId: quizId,
    status: 0,
    courseId: courseId,
  };
  let response = await axios.post(`${getLtiStudentJourney}`, { ...data });
  if (response.status === 200) {
    return response.data;
  }
  return null;
};

const updateJourneyDetails = async (data: StudentJourney) => {
  let response = await axios.post(`${saveLtiStudentJourney}`, { ...data });
};

export const useStudentJourneyStore = create<StudentJourneyStore>()(
  devtools(
    (set, get) => ({
      journeyDetails: {
        guid: urlParamsData.guid as string,
        studentId: parseInt(urlParamsData.studentId as string),
        assignmentId: parseInt(urlParamsData.assignmentId as string),
        quizId: parseInt(selectedAssignmentConfigurations?.quizId as string),
        status: 0,
        systemCheck: false,
        privacyCheck: false,
        examRules: false,
        cameraAccess: false,
        microphoneAccess: false,
        screenShare: false,
        assignmentSubmitted: false,
        quizSubmitted: false,
        courseId: parseInt(urlParamsData.courseId as string),
      },
      getJourneyDetails: async () => {
        const { urlParamsData } = useAppStore.getState();
        const { selectedAssignmentConfigurations } =
          useAssignmentStore.getState();
        const courseId = parseInt(urlParamsData.courseId as string);
        const guid = urlParamsData.guid;
        const quizId = parseInt(
          selectedAssignmentConfigurations?.quizId as string
        );
        const studentId = parseInt(urlParamsData.studentId as string);
        const assignmentId = parseInt(urlParamsData.assignmentId as string);

        if (courseId && guid) {
          let details: StudentJourney[] | null = await getStudentJourneyDetails(
            courseId,
            guid,
            quizId,
            studentId,
            assignmentId
          );
          if (details && details.length > 0) {
            set({
              journeyDetails: details[0],
            });
          }
        }
      },
      setJourneyDetails: async (stepName: string) => {
        const { urlParamsData } = useAppStore.getState();
        const { selectedAssignmentConfigurations } =
          useAssignmentStore.getState();
        let details: any = get().journeyDetails;
        details.assignmentId = parseInt(urlParamsData.assignmentId as string);
        details.courseId = parseInt(urlParamsData.courseId as string);
        details.guid = urlParamsData.guid as string;
        details.quizId = parseInt(
          selectedAssignmentConfigurations?.quizId as string
        );
        details[stepName] = true;
        details.studentId = parseInt(urlParamsData.studentId as string);
        await updateJourneyDetails(details);
        set({
          journeyDetails: { ...get().journeyDetails, [stepName]: true },
        });
      },
    }),
    { name: "Student Journey Store" }
  )
);


