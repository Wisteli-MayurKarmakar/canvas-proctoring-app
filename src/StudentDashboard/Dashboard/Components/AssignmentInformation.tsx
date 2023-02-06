import React from "react";
import { useAssignmentStore } from "../../../store/StudentDashboardStore";
import { useAppStore } from "../../../store/AppSotre";
import Timer from "../../../CommonUtilites/Timer";
import moment, { Moment } from "moment";

const AssignmentsInfo: React.FC = (): JSX.Element | null => {
  const isNewTab = useAppStore((state) => state.urlParamsData.newTab);
  const assignmentId = useAppStore((state) => state.urlParamsData.assignmentId);
  const marginTop: string = "4";
  const {
    selectedAssignment,
    selectedAssignmentConfigurations,
    schedulesAvailable,
    isProctoredAssignment,
    selectedAssignmentSchedules,
    isNewTabOpen,
    scheduleExpired,
    gotoQuiz,
    instructorSchedulesAvailable,
  } = useAssignmentStore((state) => state);

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
            {instructorSchedulesAvailable && (
              <span className="text-lg font-medium break-before-right text-center text-red-500">
                This assignment is scheduled by your instructor and can't be reshceduled. Please contact your instructor.
              </span>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    switch (isNewTab) {
      case false:
        if (isProctoredAssignment) {
          if (schedulesAvailable) {
            if (selectedAssignment && selectedAssignmentConfigurations) {
              if (selectedAssignment.studentAuthed) {
                if (!scheduleExpired) {
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
                        <div className="flex flex-col w-full justify-center">
                          <p className="text-lg font-semibold text-center">
                            Assignment selected: {selectedAssignment.name}.
                          </p>
                          {selectedAssignment.studentAuthed &&
                            !isNewTabOpen && (
                              <div className="flex flex-col w-full justify-center">
                                <div className="flex flex-row h-full w-full items-center justify-center gap-1">
                                  <p className="text-center text-lg w-ful font-semibold">
                                    Please start proctoring within
                                  </p>
                                  <Timer />
                                </div>
                                <p className="text-center text-lg font-semibold">
                                  To start proctoring please click{" "}
                                  <b>Start Proctoring</b> button. Thanks
                                </p>
                              </div>
                            )}
                        </div>
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
                        <div className="flex flex-col w-full justify-center">
                          <p className="text-lg font-semibold text-center">
                            Assignment selected: {selectedAssignment.name}.
                          </p>
                          {instructorSchedulesAvailable ? (
                            <p className="text-lg font-semibold text-center">
                              The schedule date/ time set by the instructor has
                              expired. Please contact your instructor. Thanks
                            </p>
                          ) : (
                            <p className="text-lg font-semibold text-center">
                              The schedule date/ time is expired. Please click{" "}
                              <b>Reschedule</b> button to re-schedule the
                              assignment. Thanks
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }
              } else {
                if (!scheduleExpired) {
                  let scheduleDate: Moment = moment(
                    selectedAssignmentSchedules?.scheduleDate +
                      `.${Math.abs(moment().utcOffset())}Z`
                  );
                  let timeDiff: number = moment().diff(scheduleDate, "minutes");
                  if (timeDiff < -10) {
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
                          <div className="flex flex-col w-full justify-center">
                            <p className="text-lg font-semibold text-center">
                              Assignment selected: {selectedAssignment.name}.
                            </p>
                            <p className="text-lg font-semibold text-center">
                              Authentication can only be started at{" "}
                              {scheduleDate
                                .subtract(10, "minutes")
                                .format("MM-DD-YYYY hh:mm a")}
                              .
                            </p>
                            <p className="text-lg font-semibold text-center">
                              Please click <b>Authentication for proctoring</b>{" "}
                              button to continue.
                            </p>
                          </div>
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
                          <div className="flex flex-col w-full justify-center">
                            <p className="text-lg font-semibold text-center">
                              Assignment selected: {selectedAssignment.name}.
                            </p>
                            <p className="text-lg font-semibold text-center">
                              Please click <b>Authentication for proctoring</b>{" "}
                              button to continue.
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }
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
                        <div className="flex flex-col w-full justify-center">
                          <p className="text-lg font-semibold text-center">
                            Assignment selected: {selectedAssignment.name}.
                          </p>
                          {/* <p className="text-lg font-semibold text-center">
                            The schedule date/ time is expired. Please click{" "}
                            <b>Reschedule</b> button to re-schedule the
                            assignment. Thanks
                          </p> */}
                          {instructorSchedulesAvailable ? (
                            <p className="text-lg font-semibold text-center">
                              The schedule date/ time set by the instructor has
                              expired. Please contact your instructor. Thanks
                            </p>
                          ) : (
                            <p className="text-lg font-semibold text-center">
                              The schedule date/ time is expired. Please click{" "}
                              <b>Reschedule</b> button to re-schedule the
                              assignment. Thanks
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }
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
              if (schedulesAvailable) {
                if (scheduleExpired) {
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
                        <div className="flex flex-col w-full justify-center">
                          <p className="text-lg font-semibold text-center">
                            Assignment selected: {selectedAssignment.name}.
                          </p>
                          {!isNewTabOpen && (
                            <p className="text-lg font-semibold text-center">
                              Please click <b>Start Proctoring</b> button to
                              continue.
                            </p>
                          )}
                        </div>
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
                        <div className="flex flex-col w-full justify-center">
                          <p className="text-lg font-semibold text-center">
                            Assignment selected: {selectedAssignment.name}.
                          </p>
                          {selectedAssignment.studentAuthed &&
                            !isNewTabOpen && (
                              <div className="flex flex-col w-full justify-center">
                                <div className="flex flex-row h-full w-full items-center justify-center gap-1">
                                  <p className="text-center text-lg w-ful font-semibold">
                                    Please start proctoring within
                                  </p>
                                  <Timer />
                                </div>
                                <p className="text-center text-lg font-semibold">
                                  To start proctoring please click{" "}
                                  <b>Start Proctoring</b> button. Thanks
                                </p>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  );
                }
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
                      <div className="flex flex-col w-full justify-center">
                        <p className="text-lg font-semibold text-center">
                          Assignment selected: {selectedAssignment.name}.
                        </p>
                        {!isNewTabOpen && (
                          <p className="text-lg font-semibold text-center">
                            Please click <b>Start Proctoring</b> button to
                            continue.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
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
                    <div className="flex flex-col w-full justify-center">
                      <p className="text-lg font-semibold text-center">
                        Assignment selected: {selectedAssignment.name}.
                      </p>
                      <p className="text-lg font-semibold text-center">
                        Please click <b>Authentication for proctoring</b> button
                        to continue.
                      </p>
                    </div>
                  </div>
                </div>
              );
            }
          }
        }
        break;
      case true:
        if (selectedAssignment && selectedAssignmentSchedules) {
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
                  <div className="flex flex-col w-full justify-center gap-2">
                    <p className="text-lg font-semibold">
                      Assignment selected: {selectedAssignment.name}. Proctoring
                      is in progress.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-blue-100 p-2">
                <div className="flex flex-col w-full justify-center gap-2">
                  {!gotoQuiz && (
                    <div className="flex flex-row h-full w-full items-center justify-center gap-1">
                      <p className="text-xl text-center font-bold text-blue-500">
                        Please start the quiz after
                      </p>
                      <Timer />
                    </div>
                  )}
                  <p className="text-xl font-bold text-center text-blue-500">
                    To take the quiz please click "Go to Quiz" button.
                  </p>
                </div>
              </div>
            </div>
          );
        } else {
          if (selectedAssignment && !isProctoredAssignment) {
            if (schedulesAvailable) {
              if (scheduleExpired && !scheduleExpired) {
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
                      <div className="flex flex-col w-full justify-center">
                        <p className="text-lg font-semibold text-center">
                          Assignment selected: {selectedAssignment.name}.
                        </p>
                        {selectedAssignment.studentAuthed && isNewTabOpen && (
                          <div className="flex flex-col w-full justify-center">
                            <div className="flex flex-row h-full w-full items-center justify-center gap-1">
                              <p className="text-center text-lg w-ful font-semibold">
                                Please start proctoring within
                              </p>
                              <Timer />
                            </div>
                            <p className="text-center text-lg font-semibold">
                              To start proctoring please click{" "}
                              <b>Start Proctoring</b> button. Thanks
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              } else {
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
                        <div className="flex flex-col w-full justify-center gap-2">
                          <p className="text-lg font-semibold">
                            Assignment selected: {selectedAssignment.name}.
                            Proctoring is in progress.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg bg-blue-100 p-2">
                      <div className="flex flex-col w-full justify-center gap-2">
                        <p className="text-xl font-bold text-center text-blue-500">
                          To take the quiz please click "Go to Quiz" button.
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }
            } else {
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
                      <div className="flex flex-col w-full justify-center gap-2">
                        <p className="text-lg font-semibold">
                          Assignment selected: {selectedAssignment.name}.
                          Proctoring is in progress.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg bg-blue-100 p-2">
                    <div className="flex flex-col w-full justify-center gap-2">
                      <p className="text-xl font-bold text-center text-blue-500">
                        To take the quiz please click "Go to Quiz" button.
                      </p>
                    </div>
                  </div>
                </div>
              );
            }
          }
        }
        break;
      default:
        break;
    }
  }

  return assignmentInfo;
};

export default AssignmentsInfo;
