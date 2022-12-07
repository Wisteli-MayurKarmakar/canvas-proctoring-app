import axios from "axios";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { getLtiProctorJourney, saveLtiProctorJourney } from "../apiConfigs";
import { ProctorJourneyStore } from "../AppTypes";
import { useAppStore } from "./AppSotre";
import {
  useCommonStudentDashboardStore,
  useAssignmentStore,
} from "./StudentDashboardStore";

const getProctorJourneyDetails = async (
  guid: string,
  studentId: number,
  quizId: number,
  courseId: number,
  proctorId: number
) => {
  let data = {
    guid: guid as string,
    studentId: studentId,
    proctorId: proctorId,
    quizId: quizId,
    courseId: courseId,
  };

  let response = await axios.post(`${getLtiProctorJourney}`, { ...data });

  if (response.status === 200) {
    if (response.data.length > 0) {
      useProcotorJourneyStore.setState({
        journeyDetails: response.data[0],
      });
    }
  }
};

const updateProctorJourneyDetails = async (
  stepName: string,
  studentId: number,
  quizId: number
) => {
  const { urlParamsData } = useAppStore.getState();
  const { enrollments } = useCommonStudentDashboardStore.getState();
  let { journeyDetails } = useProcotorJourneyStore.getState();
  if (!journeyDetails) {
    journeyDetails = {
      proctorUser: enrollments?.user.name as string,
      authenticatedBy: enrollments?.user.name as string,
      reportReviwer: enrollments?.user.name as string,
      guid: urlParamsData.guid as string,
      studentId: studentId,
      proctorId: parseInt(enrollments?.user.id as string),
      quizId: quizId,
      courseId: parseInt(urlParamsData.courseId as string),
      status: 0,
      aiAuthentication: false,
      reportReviwed: false,
      reportPass: false,
    };
    if (stepName === "fail" || stepName === "pass") {
      journeyDetails.reportPass = stepName === "fail" ? false : true;
    }
    if (stepName === "reportReviwed") {
      journeyDetails.reportReviwed = true;
    }
    if (stepName === "aiAuthentication") {
      journeyDetails.aiAuthentication = true;
    }
  } else {
    if (stepName === "fail" || stepName === "pass") {
      journeyDetails.reportPass = stepName === "fail" ? false : true;
    }
    if (stepName === "reportReviwed") {
      journeyDetails.reportReviwed = true;
    }
    if (stepName === "aiAuthentication") {
      journeyDetails.aiAuthentication = true;
    }
  }
  let response = await axios.post(`${saveLtiProctorJourney}`, {
    ...journeyDetails,
  });
  if (response.status === 200) {
    if (response.data.length > 0) {
      useProcotorJourneyStore.setState({
        journeyDetails: response.data[0],
      });
    }
  }
};

export const useProcotorJourneyStore = create<ProctorJourneyStore>()(
  devtools(
    (set, get) => ({
      getJourneyDetails: (studentId: string) => {
        set({ journeyDetails: null });
        const { urlParamsData } = useAppStore.getState();
        const { selectedAssignmentConfigurations } =
          useAssignmentStore.getState();
        const { enrollments } = useCommonStudentDashboardStore.getState();
        const guid = urlParamsData.guid;
        const quizId = parseInt(
          selectedAssignmentConfigurations?.quizId as string
        );
        const courseId = parseInt(urlParamsData.courseId as string);
        const proctorId = parseInt(enrollments?.user_id as string);
        if (guid) {
          getProctorJourneyDetails(
            guid,
            parseInt(studentId),
            quizId,
            courseId,
            proctorId
          );
        }
      },
      setJourneyDetails: async (
        stepName: string,
        studentId: string,
        quizId: string
      ) => {
        updateProctorJourneyDetails(
          stepName,
          parseInt(studentId),
          parseInt(quizId)
        );
      },
    }),
    { name: "Proctor Journey Store" }
  )
);
