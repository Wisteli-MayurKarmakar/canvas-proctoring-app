import moment, { Moment } from "moment";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { useAppStore } from "./AppSotre";
import { useAssignmentStore } from "./StudentDashboardStore";

type WorkflowController = {
  showAuthButton: boolean;
  showAuthModal: boolean;
  authComplete: boolean;
  showProctoringButton: boolean;
  enableAuth: boolean;
  initWorkflow: () => void;
  handleAuthComplete: () => void;
};

export const useStudentWorflowControllerStore = create<WorkflowController>()(
  devtools(
    (set, get) => ({
      showAuthButton: false,
      showAuthModal: false,
      authComplete: false,
      showProctoringButton: false,
      enableAuth: false,
      initWorkflow: () => {
        const {
          isProctoredAssignment,
          scheduleExpired,
          selectedAssignmentSchedules,
          schedulesAvailable,
        } = useAssignmentStore.getState();
        const { urlParamsData } = useAppStore.getState();
        if (!urlParamsData.newTab) {
          if (!isProctoredAssignment) {
            if (urlParamsData.newTab) {
              set({
                showAuthButton: false,
                showProctoringButton: true,
              });
              if (!useAssignmentStore.getState().schedulesAvailable) {
                useAssignmentStore.setState({
                  gotoQuiz: true,
                });
              }
            } else {
              if (!useAssignmentStore.getState().isNewTabOpen) {
                set({
                  showAuthButton: true,
                  enableAuth: true,
                });
              }
            }
          } else {
            if (schedulesAvailable) {
              if (scheduleExpired) {
                set({
                  showAuthButton: false,
                });
              } else {
                const currentTime: Moment = moment();
                const timezoneOffset: string = `.${Math.abs(
                  moment().utcOffset()
                ).toString()}Z`;
                const scheduledDate: Moment = moment(
                  selectedAssignmentSchedules?.scheduleDate + timezoneOffset
                );
                if (
                  currentTime.isAfter(scheduledDate, "millisecond") ||
                  !currentTime.isSame(scheduledDate, "day")
                ) {
                  set({
                    showAuthButton: false,
                  });
                } else {
                  const minsDiff: number = currentTime.diff(
                    scheduledDate,
                    "minutes"
                  );
                  if (Math.abs(minsDiff) > 10) {
                    set({
                      showAuthButton: true,
                      enableAuth: false,
                    });
                  } else {
                    set({
                      showAuthButton: true,
                      enableAuth: true,
                    });
                  }
                  const checkInterval = setInterval(() => {
                    const diff: number = Math.abs(
                      moment().diff(scheduledDate, "minutes")
                    );
                    if (diff <= 10 && diff > 0) {
                      set({
                        enableAuth: true,
                        showAuthButton: true,
                      });
                      clearInterval(checkInterval);
                    }
                  }, 1000);
                  const expiryInterval = setInterval(() => {
                    if (moment().isSameOrAfter(scheduledDate, "milliseconds")) {
                      set({
                        showAuthButton: false,
                        showProctoringButton: false,
                      });
                      if (!urlParamsData.newTab) {
                        useAssignmentStore.setState({
                          scheduleExpired: true,
                        });
                      }
                      clearInterval(expiryInterval);
                    }
                  }, scheduledDate.milliseconds());
                }
              }
            } else {
              set({
                showAuthButton: false,
              });
            }
          }
        } else {
          set({
            showProctoringButton: true,
          });
        }
      },
      handleAuthComplete: () => {
        set({
          showAuthButton: false,
          showProctoringButton: true,
        });
      },
    }),
    { name: "StudentWorkflowController" }
  )
);
