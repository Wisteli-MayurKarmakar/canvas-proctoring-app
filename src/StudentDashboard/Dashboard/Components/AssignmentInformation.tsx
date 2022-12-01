import React from "react";
import { useAssignmentStore } from "../../../store/StudentDashboardStore";
import { useAppStore } from "../../../store/AppSotre";

const AssignmentsInfo: React.FC = (): JSX.Element => {
  const isNewTab = useAppStore((state) => state.urlParamsData.newTab);
  const marginTop: string = "4";
  const selectedAssignment = useAssignmentStore(
    (state) => state.selectedAssignment
  );
  const selectedAssignmentConfigurations = useAssignmentStore(
    (state) => state.selectedAssignmentConfigurations
  );
  const schedulesAvailable = useAssignmentStore(
    (state) => state.schedulesAvailable
  );
  const isProctoredAssignment = useAssignmentStore(
    (state) => state.isProctoredAssignment
  );
  const assignmentId = useAppStore((state) => state.urlParamsData.assignmentId);
  let assignmentInfo: JSX.Element | null = null;

  if (!assignmentId) {
    assignmentInfo = (
      <div className={`flex flex-row justify-center gap-4 mt-${marginTop}`}>
        <div
          className="flex justify-center p-4 text-sm text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-200 dark:text-blue-800"
          role="alert"
        >
          <svg
            aria-hidden="true"
            className="flex items-center justify-center flex-shrink-0 w-8 h-8 mr-3"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            ></path>
          </svg>
          <div className="flex flex-col w-full justify-center gap-2">
            <span className="text-lg font-medium break-before-right text-start">
              You can do all the actions at the left tool menu and also
              schedule/ reschedule the quiz. But you cannot start the proctoring
              for any quiz from here.
            </span>
            <span className="text-lg font-medium break-before-right text-start">
              To start the proctoring for a quiz please visit the corresponding
              assignment from the left hand side menu of canvas page or through
              the corresponding module.
            </span>
          </div>
        </div>
      </div>
    );
  } else {
    assignmentInfo = (
      <div className={`flex flex-row justify-center gap-4 mt-${marginTop}`}>
        <div
          className="flex justify-center p-4 text-sm text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-200 dark:text-blue-800"
          role="alert"
        >
          <svg
            aria-hidden="true"
            className="flex-shrink-0 inline w-8 h-8 mr-3"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span className="text-lg font-medium">
            Please select an assignment
          </span>
        </div>
      </div>
    );

    switch (isNewTab) {
      case false:
        if (isProctoredAssignment) {
          if (schedulesAvailable) {
            if (selectedAssignment && selectedAssignmentConfigurations) {
              if (selectedAssignment.studentAuthed) {
                assignmentInfo = (
                  <div
                    className={`flex flex-row w-full justify-center gap-4 mt-${marginTop}`}
                  >
                    <div
                      className="flex flex-row h-18 items-center p-4 mb-4 text-medium text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-200 dark:text-blue-800"
                      role="alert"
                    >
                      <svg
                        aria-hidden="true"
                        className="flex-shrink-0 inline w-8 h-8 mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <span className="text-lg font-semibold">
                        Assignment selected: {selectedAssignment.name}. Please
                        click <b>Start Proctoring button</b> to continue.
                      </span>
                    </div>
                  </div>
                );
              } else {
                assignmentInfo = (
                  <div
                    className={`flex flex-row w-full justify-center gap-4 mt-${marginTop}`}
                  >
                    <div
                      className="flex flex-row h-18 items-center p-4 mb-4 text-medium text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-200 dark:text-blue-800"
                      role="alert"
                    >
                      <svg
                        aria-hidden="true"
                        className="flex-shrink-0 inline w-8 h-8 mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <span className="text-lg font-semibold">
                        Assignment selected: {selectedAssignment.name}. Please
                        click <b>Authentication for proctoring button</b> to
                        continue.
                      </span>
                    </div>
                  </div>
                );
              }
            } else if (
              selectedAssignment &&
              !selectedAssignmentConfigurations
            ) {
              assignmentInfo = (
                <div
                  className={`flex flex-row w-full justify-center gap-4 mt-${marginTop}`}
                >
                  <div
                    className="flex p-4 mb-4 h-18 items-center text-medium text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-200 dark:text-blue-800"
                    role="alert"
                  >
                    <svg
                      aria-hidden="true"
                      className="flex-shrink-0 inline w-8 h-8 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="text-lg font-semibold">
                      Assignment selected: {selectedAssignment.name}. This
                      assignment is not proctored. Please go to quizzes and
                      continue.
                    </span>
                  </div>
                </div>
              );
            } else {
              assignmentInfo = (
                <div
                  className={`flex flex-row justify-center gap-4 mt-${marginTop}`}
                >
                  <div
                    className="flex justify-center p-4 text-sm text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-200 dark:text-blue-800"
                    role="alert"
                  >
                    <svg
                      aria-hidden="true"
                      className="flex-shrink-0 inline w-8 h-8 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="sr-only">Info</span>
                    <div>
                      <span className="text-lg font-medium">
                        Please Select an assignment
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
          } else {
            if (selectedAssignment) {
              assignmentInfo = (
                <div
                  className={`flex flex-row w-full justify-center gap-4 mt-${marginTop}`}
                >
                  <div
                    className="flex flex-row h-18 items-center p-4 mb-4 text-medium text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-200 dark:text-blue-800"
                    role="alert"
                  >
                    <svg
                      aria-hidden="true"
                      className="flex-shrink-0 inline w-8 h-8 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="text-lg font-semibold">
                      Assignment selected: {selectedAssignment.name}. Please
                      schedule the assignment first to continue.
                    </span>
                  </div>
                </div>
              );
            }
          }
        } else {
          if (selectedAssignment) {
            if (selectedAssignment.studentAuthed) {
              assignmentInfo = (
                <div
                  className={`flex flex-row w-full justify-center gap-4 mt-${marginTop}`}
                >
                  <div
                    className="flex flex-row h-18 items-center p-4 mb-4 text-medium text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-200 dark:text-blue-800"
                    role="alert"
                  >
                    <svg
                      aria-hidden="true"
                      className="flex-shrink-0 inline w-8 h-8 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="text-lg font-semibold">
                      Assignment selected: {selectedAssignment.name}. Please
                      click <b>Start Proctoring button</b> to continue.
                    </span>
                  </div>
                </div>
              );
            } else {
              assignmentInfo = (
                <div
                  className={`flex flex-row w-full justify-center gap-4 mt-${marginTop}`}
                >
                  <div
                    className="flex flex-row h-18 items-center p-4 mb-4 text-medium text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-200 dark:text-blue-800"
                    role="alert"
                  >
                    <svg
                      aria-hidden="true"
                      className="flex-shrink-0 inline w-8 h-8 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="text-lg font-semibold">
                      Assignment selected: {selectedAssignment.name}. Please
                      click <b>Authentication for proctoring button</b> to
                      continue.
                    </span>
                  </div>
                </div>
              );
            }
          }
        }
        break;
      case true:
        if (selectedAssignment) {
          assignmentInfo = (
            <div className="flex flex-col w-full justify-center gap-8">
              <div
                className={`flex flex-row w-full justify-center gap-4 mt-${marginTop}`}
              >
                <div
                  className="flex flex-row h-18 items-center p-4 mb-4 text-medium text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-200 dark:text-blue-800"
                  role="alert"
                >
                  <svg
                    aria-hidden="true"
                    className="flex-shrink-0 inline w-8 h-8 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="font-lg font-semibold">
                    Assignment selected: {selectedAssignment.name}. Proctoring
                    is in progress.
                  </span>
                </div>
              </div>
              <div className="rounded-lg bg-blue-100 p-2">
                {/* <p className="text-xl font-bold text-center text-blue-500">
                  This is the proctoring tab, please do not close this tab or
                  click "End Proctoring" button up until you submit the quiz.
                </p> */}
                <p className="text-xl font-bold text-center text-blue-500">
                  To take the quiz please click "Go to Quiz" button.
                </p>
              </div>
            </div>
          );
        }
        break;
      default:
        break;
    }
  }

  return assignmentInfo;
};

export default AssignmentsInfo;
