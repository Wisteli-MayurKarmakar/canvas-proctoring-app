import axios from "axios";
import moment, { Moment } from "moment";
import React, { useEffect, useState } from "react";
import { fetchCanvasEnrollmentsByInstituteForThreeHours } from "../../apiConfigs";
import { useAppStore } from "../../store/AppSotre";
import LiveStreaming from "../Modals/LiveStreaming";

type Props = {};

type Student = {
  email: string;
  name: string;
  quizId: number;
  schedule: string;
};

const StudentProctoringFor3Hrs: React.FC<Props> = (props): JSX.Element => {
  const [studentFirstBatch, setStudentFirstBatch] = useState<Student[]>([]);
  const [studentSecondBatch, setStudentSecondBatch] = useState<Student[]>([]);
  const [studentThirdBatch, setStudentThirdBatch] = useState<Student[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [fetchingStudents, setFetchingStudents] = useState<boolean>(true);
  const [selectedStudent, setSelectedStudent] = useState<Student>();
  const [showLiveStream, setShowLiveStream] = useState<boolean>(false);
  const [errorFetchingStudents, setErrorFetchingStudents] =
    useState<boolean>(false);
  const urlParamsData = useAppStore((state) => state.urlParamsData);
  const tokenData = useAppStore((state) => state.tokenData);
  const currentTime: Moment = moment().set("minutes", 0);
  currentTime.set("seconds", 0);
  const timeAfOneHrs: Moment = moment(currentTime).set(
    "hours",
    currentTime.hours() + 1
  );
  const timeAfTwoHrs: Moment = moment(currentTime).set(
    "hours",
    currentTime.hours() + 2
  );
  const timeAfThreeHrs: Moment = moment(currentTime).set(
    "hours",
    currentTime.hours() + 3
  );
  const date: string = currentTime.format("Do MMM");

  const fetchStudentsForNextThreeHrsQuiz = async () => {
    let response = await axios.get(
      `${fetchCanvasEnrollmentsByInstituteForThreeHours}/${tokenData.instituteId}/${urlParamsData.courseId}/student/${urlParamsData.accountId}/${urlParamsData.guid}/${tokenData.lmsAccessToken}`
    );

    if (response.status === 200) {
      let firstBatchStu: Student[] = [];
      let secondBatchStu: Student[] = [];
      let thirdBatchStu: Student[] = [];

      if (response.data.length === 0) {
        setFetchingStudents(false);
        return;
      }

      response.data.forEach((item: Student) => {
        if (
          moment(item.schedule + "Z").isSameOrAfter(timeAfOneHrs) &&
          moment(item.schedule + "Z").isSameOrBefore(timeAfTwoHrs)
        ) {
          firstBatchStu.push(item);
        }

        if (
          moment(item.schedule + "Z").isSameOrAfter(timeAfTwoHrs) &&
          moment(item.schedule + "Z").isSameOrBefore(timeAfThreeHrs)
        ) {
          secondBatchStu.push(item);
        }

        if (moment(item.schedule + "Z").isSameOrAfter(timeAfThreeHrs)) {
          thirdBatchStu.push(item);
        }
      });
      setStudentFirstBatch(firstBatchStu);
      setStudentSecondBatch(secondBatchStu);
      setStudentThirdBatch(thirdBatchStu);
      setStudents(response.data);
    } else {
      setErrorFetchingStudents(true);
    }
    setFetchingStudents(false);
  };

  useEffect(() => {
    if (
      studentFirstBatch.length > 0 ||
      studentSecondBatch.length > 0 ||
      studentThirdBatch.length > 0
    ) {
      setErrorFetchingStudents(false);
    }
  }, [studentFirstBatch, studentSecondBatch, studentThirdBatch]);

  useEffect(() => {
    fetchStudentsForNextThreeHrsQuiz();
  }, []);

  const showLiveStreamModal = (student: Student) => {
    setSelectedStudent(student);
    setShowLiveStream(true);
  };

  if (!fetchingStudents) {
    if (!errorFetchingStudents) {
      if (students.length > 0) {
        if (
          studentFirstBatch.length > 0 ||
          studentSecondBatch.length > 0 ||
          studentThirdBatch.length > 0
        ) {
          return (
            <>
              <div className="flex flex-col w-full justify-start gap-4">
                <p className="text-lg font-semibold">
                  Proctoring for {date} ~ {timeAfOneHrs.format("hh:mm a")}
                </p>
                <div className="flex flex-row flex-wrap w-full gap-8 h-full items-center justify-start">
                  {studentFirstBatch.length > 0 ? (
                    studentFirstBatch.map((student: Student, index: number) => {
                      return (
                        <div
                          className="box-border border rounded shadow-lg w-40 h-40 bg-gray-100 text-black"
                          key={index}
                        >
                          <div className="flex flex-col w-full h-full items-center justify-center gap-4 p-2">
                            <p className="text-lg text-center truncate w-full font-semibold">
                              {student.name}
                            </p>
                            <p className="text-sm text-center break-before-right font-semibold">
                              {moment(student.schedule + "Z").format(
                                "MM/DD/YYYY hh:mm a"
                              )}
                            </p>
                            <button
                              type="button"
                              onClick={() => showLiveStreamModal(student)}
                              className={`inline-block px-6 py-2.5 font-medium text-xs 
                      leading-tight rounded-full ${
                        selectedStudent && selectedStudent.name === student.name
                          ? "bg-blue-400 text-white"
                          : "bg-gray-300 text-black border border-blue-400  hover:bg-blue-400 hover:text-white transition duration-150 ease-in-out"
                      } 
                        `}
                            >
                              Live Stream
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-semibold mt-2">
                      No students available for proctoring
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col w-full justify-start">
                <p className="text-lg font-semibold">
                  Proctoring for {date} ~ {timeAfTwoHrs.format("hh:mm a")}
                </p>
                <div className="flex flex-row flex-wrap w-full gap-8 h-full items-center justify-start">
                  {studentSecondBatch.length > 0 ? (
                    studentSecondBatch.map(
                      (student: Student, index: number) => {
                        return (
                          <div
                            className="box-border border rounded shadow-lg w-36 h-40 bg-gray-100 text-black"
                            key={index}
                          >
                            <div className="flex flex-col w-full h-full items-center justify-center gap-4 p-2">
                              <p className="text-lg text-center truncate w-full font-semibold">
                                {student.name}
                              </p>
                              <p className="text-sm text-center break-before-right font-semibold">
                                {moment(student.schedule + "Z").format(
                                  "MM/DD/YYYY hh:mm a"
                                )}
                              </p>
                              <button
                                type="button"
                                onClick={() => showLiveStreamModal(student)}
                                className={`inline-block px-6 py-2.5 font-medium text-xs 
                    leading-tight rounded-full ${
                      selectedStudent && selectedStudent.name === student.name
                        ? "bg-blue-400 text-white"
                        : "bg-gray-300 text-black border border-blue-400  hover:bg-blue-400 hover:text-white transition duration-150 ease-in-out"
                    } 
                      `}
                              >
                                Live Stream
                              </button>
                            </div>
                          </div>
                        );
                      }
                    )
                  ) : (
                    <p className="text-semibold mt-2">
                      No students available for proctoring
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col w-full justify-start">
                <p className="text-lg font-semibold">
                  Proctoring for {date} ~ {timeAfThreeHrs.format("hh:mm a")}
                </p>
                <div className="flex flex-row flex-wrap w-full gap-8 h-full items-center justify-start">
                  {studentThirdBatch.length > 0 ? (
                    studentThirdBatch.map((student: Student, index: number) => {
                      return (
                        <div
                          className="box-border border rounded shadow-lg w-36 h-40 bg-gray-100 text-black"
                          key={index}
                        >
                          <div className="flex flex-col w-full h-full items-center justify-center gap-4 p-2">
                            <p className="text-lg text-center truncate w-full font-semibold">
                              {student.name}
                            </p>
                            <p className="text-sm text-center break-before-right font-semibold">
                              {moment(student.schedule + "Z").format(
                                "MM/DD/YYYY hh:mm a"
                              )}
                            </p>
                            <button
                              type="button"
                              onClick={() => showLiveStreamModal(student)}
                              className={`inline-block px-6 py-2.5 font-medium text-xs 
                    leading-tight rounded-full ${
                      selectedStudent && selectedStudent.name === student.name
                        ? "bg-blue-400 text-white"
                        : "bg-gray-300 text-black border border-blue-400  hover:bg-blue-400 hover:text-white transition duration-150 ease-in-out"
                    } 
                      `}
                            >
                              Live Stream
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-semibold mt-2">
                      No students available for proctoring
                    </p>
                  )}
                </div>
              </div>
              {showLiveStream && selectedStudent && (
                <LiveStreaming
                  view={showLiveStream}
                  close={() => setShowLiveStream(false)}
                  quiz={{ id: selectedStudent.quizId }}
                  student={selectedStudent}
                />
              )}
            </>
          );
        }
      } else {
        return (
          <p className="text-semibold mt-2 text-center">
            No students available for proctoring
          </p>
        );
      }
    } else {
      return (
        <p className="flex items-center justify-between text-red-600 text-center font-bold text-xl">
          Could not fetch students. Please refresh the page.
        </p>
      );
    }
  }
  return (
    <p className="text-blue-500 text-center font-bold text-xl">
      Fetching Students. Please wait...
    </p>
  );
};

export default StudentProctoringFor3Hrs;
