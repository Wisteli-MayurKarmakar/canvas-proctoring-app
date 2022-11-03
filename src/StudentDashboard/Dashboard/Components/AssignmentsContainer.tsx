import { Tooltip } from "antd";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useAssignmentStore } from "../../../store/StudentDashboardStore";
import { useAppStore } from "../../../store/AppSotre";
import AuthenticationModal from "../../Modals/AuthenticationModal";
import { useCommonStudentDashboardStore } from "../../../store/StudentDashboardStore";
import VideoAndScreenRec from "../../../videoAndScreenRec";
import DateTimePicker from "../../../CommonUtilites/DateTimePicker";

type Props = {
  isNewTab: boolean;
};

const AssignmentsContainer: React.FC<Props> = (props): JSX.Element => {
  let [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const assignments = useAssignmentStore((state) => state.assignments);
  let [showDateTimePicker, setShowDateTimePicker] = useState<boolean>(false);
  const urlParamsData = useAppStore((state) => state.urlParamsData);
  const inputRef = useRef<any>();
  const tokenData = useAppStore((state) => state.tokenData);
  const enrollments = useCommonStudentDashboardStore(
    (state) => state.enrollments
  );
  const setStudentAuthed = useAssignmentStore(
    (state) => state.setStudentAuthed
  );
  const selectedAssignmentConfigurations = useAssignmentStore(
    (state) => state.selectedAssignmentConfigurations
  );
  const isProctoredAssignment = useAssignmentStore(
    (state) => state.isProctoredAssignment
  );
  const schedulesAvailable = useAssignmentStore(
    (state) => state.schedulesAvailable
  );
  const setSelectedAssignment = useAssignmentStore(
    (state) => state.setSelectedAssignment
  );
  const selectedAssignment = useAssignmentStore(
    (state) => state.selectedAssignment
  );

  const quizObj: any = {};

  const handleSelectAssignment = (assignment: any): void => {
    setSelectedAssignment(assignment);
  };

  const handleDateTimePicker = () => {
    setShowDateTimePicker(!showDateTimePicker);
  };

  const handleStudentAuthentication = () => {
    setStudentAuthed();
  };

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key == "m") {
        inputRef.current.focus();
      }
      // if (inputRef.current.value.length > 2) {
      //   let input: string = inputRef.current.value;
      //   let res = assignments?.map((item: any) => {
      //     if (item.name.includes(input)) {
      //       return item;
      //     }
      //   });
      //   setFilteredResult(res);
      // }
      // if (inputRef.current.value.length === 0) {
      //   setFilteredResult(assignments);
      // }
    });
  }, []);

  if (assignments) {
    return (
      <div className="flex flex-col gap-4 h-full w-full items-center">
        <div className="flex flex-col h-full w-full items-center box-border border-1 rounded bg-gray-200 gap-4">
          <div className="flex w-full justify-end">
            <div className="w-64">
              <div className="input-group relative flex items-stretch w-full mt-2 rounded">
                <input
                  type="search"
                  ref={inputRef}
                  className="form-control relative text-center flex-auto text-ellipsis min-w-0 block w-full text-base font-normal text-black bg-gray-200 border-2 border-gray-400  rounded transition ease-in-out focus:bg-white focus:border-gray-400 focus:outline-none"
                  placeholder="Search Assignment (Ctrl + m)"
                  aria-label="Search"
                  aria-describedby="button-addon2"
                />
                <span
                  className="input-group-text flex items-center px-3 py-1.5 text-base font-normal text-gray-700 text-center whitespace-nowrap rounded"
                  id="basic-addon2"
                >
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="search"
                    className="w-4"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="currentColor"
                      d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
                    ></path>
                  </svg>
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-row h-full w-full max-h-80 xl:max-h-full items-center justify-center self-center mx-auto flex-wrap gap-4  overflow-y-scroll p-2">
            {assignments.map((assignment: any, index: number) => {
              if (
                "due_at" in assignment &&
                moment(assignment.due_at).isBefore(moment())
              ) {
                return (
                  <Tooltip
                    key={index}
                    placement="top"
                    title={"Due date expired"}
                  >
                    <div className="flex flex-col gap-4" key={index}>
                      <div
                        style={{
                          cursor: "not-allowed",
                        }}
                        key={index}
                        onClick={(e: any) => e.preventDefault()}
                        className={`flex p-6 h-28 w-28 relative rounded-lg text-md shadow-lg border font-semibold items-center justify-center text-center ${
                          quizObj[assignment.id]
                            ? "bg-blue-400 text-white"
                            : "bg-white text-black"
                        } hover:bg-gray-100 dark:${
                          quizObj[assignment.id]
                            ? "bg-blue-400"
                            : "border-gray-200"
                        } dark:hover:bg-red-400 dark:hover:text-white`}
                      >
                        <h1>{assignment.name}</h1>
                      </div>
                    </div>
                  </Tooltip>
                );
              }
              return (
                <Tooltip
                  key={index}
                  placement="top"
                  title={`${
                    "due_at" in assignment
                      ? "Due date - " +
                        moment(assignment.due_at).format("MM/ DD/ YYYY HH:MM a")
                      : "No due date"
                  }`}
                >
                  <div className="flex flex-col gap-4" key={index}>
                    <div
                      style={{
                        cursor: "pointer",
                      }}
                      key={index}
                      onClick={() => handleSelectAssignment(assignment)}
                      className={`flex p-6 h-40 w-48 rounded-lg text-md shadow-lg border items-center justify-center font-semibold text-center ${
                        selectedAssignment?.id === assignment.id
                          ? "bg-blue-400 text-white"
                          : "bg-white text-black"
                      } hover:bg-blue-400 dark:${
                        selectedAssignment?.id === assignment.id
                          ? "bg-blue-400"
                          : "border-gray-200"
                      } dark:hover:bg-blue-400 dark:hover:text-white`}
                    >
                      <p className="text-ellipsis break-all">
                        {assignment.name}
                      </p>
                    </div>
                  </div>
                </Tooltip>
              );
            })}
          </div>

          {showAuthModal &&
            selectedAssignment &&
            selectedAssignmentConfigurations &&
            enrollments &&
            schedulesAvailable && (
              <AuthenticationModal
                view={true}
                quizTitle={selectedAssignment.name}
                close={() => setShowAuthModal(false)}
                quizId={selectedAssignmentConfigurations.quizId}
                quizConfig={selectedAssignmentConfigurations}
                userId={urlParamsData.userId as any}
                studentId={urlParamsData.studentId as any}
                courseId={urlParamsData.courseId as any}
                guid={urlParamsData.guid as any}
                authToken={tokenData.lmsAccessToken}
                userName={enrollments.user.name}
                authComplete={handleStudentAuthentication}
                student={enrollments}
              />
            )}
        </div>
        <div className="flex flex-row w-full justify-center gap-4">
          {selectedAssignment &&
            !urlParamsData.newTab &&
            selectedAssignmentConfigurations &&
            isProctoredAssignment &&
            !schedulesAvailable && (
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleDateTimePicker}
                  className={
                    "px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                  }
                >
                  Schedule
                </button>
              </div>
            )}
          {!selectedAssignment?.studentAuthed &&
          selectedAssignment &&
          selectedAssignmentConfigurations &&
          !isProctoredAssignment ? (
            <div className="flex items-center justify-center">
              <div className="flex space-x-2 justify-center">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(true)}
                  className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                >
                  Authenticate
                </button>
              </div>
            </div>
          ) : (
            !selectedAssignment?.studentAuthed &&
            selectedAssignment &&
            selectedAssignmentConfigurations &&
            isProctoredAssignment &&
            schedulesAvailable && (
              <div className="flex items-center justify-center">
                <div className="flex space-x-2 justify-center">
                  <button
                    type="button"
                    onClick={() => setShowAuthModal(true)}
                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                  >
                    Authenticate
                  </button>
                </div>
              </div>
            )
          )}
          {selectedAssignment?.studentAuthed &&
            selectedAssignment &&
            selectedAssignmentConfigurations &&
            enrollments && (
              <VideoAndScreenRec
                assignment={selectedAssignment}
                username={enrollments.user.name}
                pass={""}
                procData={{}}
                token={tokenData.lmsAccessToken as any}
                id={urlParamsData.userId as any}
                isNewTab={urlParamsData.newTab as any}
                courseId={urlParamsData.courseId as any}
                toolConsumerGuid={urlParamsData.guid as any}
                isAuthed={urlParamsData.isAuthed as any}
                studentId={urlParamsData.studentId as any}
                quizConfig={selectedAssignmentConfigurations}
                accountId={urlParamsData.accountId as any}
                invokeUrl={urlParamsData.invokeUrl as any}
                quizId={selectedAssignmentConfigurations.quizId}
              />
            )}
          {showDateTimePicker && (
            <DateTimePicker
              visible={showDateTimePicker}
              close={handleDateTimePicker}
              assignment={selectedAssignment}
              // handleDateTimeSelect={handleSchedule}
              assignmentConfig={selectedAssignmentConfigurations}
            />
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-row h-screen w-full gap-4 items-center justify-center">
      {props.isNewTab ? (
        <p className="text-center text-lg">
          Setting up proctoring. Please wait...
        </p>
      ) : (
        <p className="text-center text-lg">Fetching assignments...</p>
      )}
      <div role="status">
        <svg
          className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-green-500 "
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default AssignmentsContainer;
