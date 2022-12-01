import { Badge, Button, message, Table } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect } from "react";
import { getWebSocketUrl } from "../../APIs/apiservices";
import LiveSreaming from "../Modals/LiveStreaming";
import {
  fetchAccountsByCourseAndEnrollemntType,
  getCanvasAssignmentDetails,
  getLtiScheduleByQuizId,
} from "../../apiConfigs";
import { useAppStore } from "../../store/AppSotre";
import { QuizTypeProctoringByQuiz } from "../../AppTypes";
import { useSocketStore } from "../../store/SocketStore";

type QuizStatus = {
  [key: string]: { ongoing: boolean };
};

const ProcotoringByQuiz: React.FC = (): JSX.Element => {
  const [quizzes, setQuizzes] = React.useState<any>(null);
  const [qzSelectTrack, setQzSelectTrack] = React.useState<any>(null);
  const [enrollments, setEnrollments] = React.useState<any>(null);
  const [selectedQuizSchedules, setSelectedQuizSchedules] =
    React.useState<any>(null);
  let [selectedQuiz, setSelectedQuiz] =
    React.useState<QuizTypeProctoringByQuiz | null>(null);
  let [showLiveStream, setShowLiveStream] = React.useState<boolean>(false);
  let [selectedStudent, setSelectedStudent] = React.useState<any>(null);
  const [enrollmentLiveStatus, setEnrollmentLiveStatus] =
    React.useState<any>(null);
  const { urlParamsData, tokenData } = useAppStore((state) => state);
  const [socketRoom, setSocketRoom] = React.useState<any>(null);
  const [socketUser, setSocketUser] = React.useState<any>(
    "chat_" + urlParamsData.userId
  );
  const [quizzesStatus, setQuizzesStatus] = React.useState<QuizStatus>({});
  const socket = getWebSocketUrl();
  const { createConnection, messagesIncoming } = useSocketStore(
    (state) => state
  );

  const studentCols = [
    {
      dataIndex: "",
      key: "name",
      title: "Name",
      render: (row: any) => {
        return row.name;
      },
    },
    {
      dataIndex: "",
      key: "schedule",
      title: "Schedule Date",
      render: (row: any) => {
        if (!quizzes) {
          return "Fetching quizzes...";
        }
        if (selectedQuiz) {
          if (selectedQuizSchedules) {
            return moment(selectedQuizSchedules.scheduleDate).format(
              "MM-DD-YYYY hh:mm a"
            );
          }
          if (selectedQuizSchedules === false) {
            return "Not Scheduled";
          }
          return "Getting schedules...";
        }
        return "Please select a quiz";
      },
    },
    {
      dataIndex: "",
      key: "action",
      title: "Action",
      render: (row: any) => {
        if (Object.keys(quizzesStatus).length > 0) {
          return (
            <Button
              type="link"
              disabled={
                row.id in quizzesStatus && quizzesStatus[row.id].ongoing
                  ? false
                  : true
              }
              onClick={() => showLiveStreamModal(row)}
            >
              Live Stream
            </Button>
          );
        }
        return (
          <Button type="link" disabled={true}>
            Live Stream
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    axios
      .get(
        `${getCanvasAssignmentDetails}/${tokenData.instituteId}/${urlParamsData.guid}/${urlParamsData.courseId}/${tokenData.lmsAccessToken}/`
      )
      .then((res) => {
        let temp: any = {};
        let quizzesStatus: QuizStatus = {};
        let quizzes = res.data.filter((item: any) => {
          if (item.id > 0) {
            temp[item.id] = false;
            quizzesStatus[item.id] = { ongoing: false };
            return item;
          }
        });
        setQuizzesStatus(quizzesStatus);
        setQzSelectTrack(temp);
        setQuizzes(quizzes);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(
        `${fetchAccountsByCourseAndEnrollemntType}/${urlParamsData.courseId}/student/${tokenData.instituteId}/${tokenData.lmsAccessToken}`
      )
      .then((res) => {
        let temp: any = {};
        res.data.forEach((item: any) => {
          temp[item.id] = 0;
        });
        let enrollments = res.data.map((enrollment: any) => ({
          ...enrollment,
          user_id: enrollment.id,
          course_id: urlParamsData.courseId,
          key: enrollment.id,
        }));
        setEnrollmentLiveStatus(temp);
        setEnrollments(enrollments);
      })
      .catch((err) => {
        console.log(err);
      });
    let roomName: string = `${urlParamsData.guid}_${urlParamsData.courseId}_assgn_status`;
    let userName: string = `${urlParamsData.studentId}_instr_assgn_status`;
    let messagType: string = "ASSGN_STAT_REQ";
    let dataToSend: any = {};
    createConnection(roomName, userName, messagType, dataToSend);
  }, []);

  const connectSocket = () => {
    socket.connect();
    socket.emit("validate", {
      evt: "chat",
      room: socketRoom,
      user: socketUser,
    });

    socket.on("chat", (data: any) => {});
  };

  useEffect(() => {
    if (socketRoom) {
      connectSocket();
    }
  }, [socketRoom]);

  useEffect(() => {
    if (selectedQuiz) {
      setSocketRoom(
        "rm_" + urlParamsData.courseId + "_" + selectedQuiz.id + "rtc"
      );
    }
  }, [selectedQuiz]);

  const getQuizSchedules = (quizId: number, assignmentId: string) => {
    let data = {
      instituteId: tokenData.instituteId,
      assignmentId: parseInt(assignmentId),
      quizId: quizId,
      courseId: parseInt(urlParamsData.courseId as any),
      status: 0,
      guid: urlParamsData.guid,
    };
    axios
      .post(`${getLtiScheduleByQuizId}`, { ...data })
      .then((response: any) => {
        let offsetTime: string = Math.abs(moment().utcOffset()).toString();
        let schedule = {
          ...response.data,
          scheduleDate: response.data.scheduleDate + `.${offsetTime}Z`,
        };
        setSelectedQuizSchedules(schedule);
      })
      .catch((error: any) => {
        setSelectedQuizSchedules(false);
        console.log(error);
      });
  };

  const handleQuizClick = (quizz: any) => {
    let temp = { ...qzSelectTrack };
    Object.keys(temp).forEach((key) => {
      temp[key] = false;
    });
    if (quizz.quizId) {
      setSelectedQuiz({ ...quizz, id: quizz.quizId });
      setSelectedQuizSchedules(null);
      getQuizSchedules(quizz.quizId, quizz.id);
      temp[quizz.id.toString()] = true;
      setQzSelectTrack(temp);
      socket.disconnect();
    }
  };

  const showLiveStreamModal = (enrollment: any) => {
    setSelectedStudent(enrollment);
    setShowLiveStream(!showLiveStream);
  };

  useEffect(() => {
    if (messagesIncoming) {
      let data = { ...quizzesStatus };
      Object.keys(messagesIncoming).forEach((key: string) => {
        if (key in data) {
          data[key].ongoing = true;
        }
      });
      setQuizzesStatus(data);
    }
  }, [messagesIncoming]);

  return (
    <div className="flex items-center flex-col justify-center w-full h-full gap-4">
      {quizzes ? (
        <div className="flex flex-row flex-wrap gap-6 justify-center h-5/6 w-full xl:h-full max-h-96 overflow-y-scroll">
          {quizzes.map((quizz: any, index: number) => {
            if (quizzesStatus[quizz.id].ongoing) {
              return (
                <Badge.Ribbon
                  text="Proctoring started"
                  color="volcano"
                  key={index}
                >
                  <div
                    className={
                      qzSelectTrack[quizz.id]
                        ? `box-border h-32 w-48 border  p-4 rounded bg-blue-400 shadow-lg text-white hover:bg-blue-400`
                        : `transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-110 duration-200 box-border h-32 w-48 border  p-4 rounded text-black shadow-lg bg-white hover:bg-blue-400 hover:text-white`
                    }
                    style={{ cursor: "pointer" }}
                    onClick={() => handleQuizClick(quizz)}
                  >
                    <div
                      className="flex flex-col h-full w-full items-center justify-center"
                      key={index.toString() + "a"}
                    >
                      {"quizName" in quizz ? (
                        <p className="text-xl font-semibold">
                          {quizz.quizName}
                        </p>
                      ) : (
                        <p className="text-xl font-semibold">{quizz.id}</p>
                      )}

                      <p className="font-semibold">
                        {"lock_at" in quizz
                          ? moment(quizz.lock_at).format("MM-DD-YYYY h:mm A")
                          : "Date - N/A"}
                      </p>
                    </div>
                  </div>
                </Badge.Ribbon>
              );
            }
            return (
              <div
                className={
                  qzSelectTrack[quizz.id]
                    ? `box-border h-32 w-48 border  p-4 rounded bg-blue-400 shadow-lg text-white hover:bg-blue-400`
                    : `transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-110 duration-200 box-border h-32 w-48 border  p-4 rounded text-black shadow-lg bg-white hover:bg-blue-400 hover:text-white`
                }
                style={{ cursor: "pointer" }}
                onClick={() => handleQuizClick(quizz)}
              >
                <div
                  className="flex flex-col h-full w-full items-center justify-center"
                  key={index.toString() + "a"}
                >
                  {"quizName" in quizz ? (
                    <p className="text-xl font-semibold">{quizz.quizName}</p>
                  ) : (
                    <p className="text-xl font-semibold">{quizz.id}</p>
                  )}

                  <p className="font-semibold">
                    {"lock_at" in quizz
                      ? moment(quizz.lock_at).format("MM-DD-YYYY h:mm A")
                      : "Date - N/A"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center font-semibold">
          Fetching quizzes. Please wait ...
        </p>
      )}
      {quizzes && enrollments && (
        <div className="inline-flex justify-center items-center w-full">
          <hr className="my-8 w-full h-1 bg-gray-200 rounded border-0" />
          <div className="absolute left-1/2 px-4 bg-white -translate-x-1/2">
            <p className="text-lg font-semibold">Students</p>
          </div>
        </div>
      )}
      <div className="flex flex-row flex-wrap w-full gap-8 h-full items-center justify-center">
        {enrollments && quizzes && (
          <Table
            dataSource={enrollments}
            columns={studentCols}
            bordered={true}
          />
        )}
        {/* {enrollments ? (
          enrollments.map((enrollment: any, index: number) => {
            return (
              <div
                className="box-border border rounded shadow-lg w-40 h-40 bg-gray-100 text-black"
                key={index}
              >
                <div className="flex flex-col w-full h-full items-center justify-center gap-4 p-2">
                  <p className="text-lg text-center truncate w-full font-semibold">
                    {enrollment.name}
                  </p>
                  <button
                    type="button"
                    onClick={() => showLiveStreamModal(enrollment)}
                    className={`inline-block px-6 py-2.5 font-medium text-xs 
                    leading-tight rounded-full ${
                      selectedStudent && selectedStudent.id === enrollment.id
                        ? "bg-blue-400 text-white"
                        : "bg-gray-300 text-black border border-blue-400  hover:bg-blue-400 hover:text-white transition duration-150 ease-in-out"
                    } 
                      `}
                  >
                    Live Stream
                  </button>
                  {selectedQuiz && selectedQuizSchedules ? (
                    <p className="text-center font-semibold">
                      {moment(selectedQuizSchedules.scheduleDate).format(
                        "MM-DD-YYYY hh:mm a"
                      )}
                    </p>
                  ) : (
                    selectedQuiz && (
                      <p className="text-center font-semibold">Not scheduled</p>
                    )
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center font-semibold">
            Fetching students. Please wait...
          </p>
        )} */}
      </div>

      {showLiveStream && selectedStudent && selectedQuiz && (
        <LiveSreaming
          view={showLiveStream}
          close={() => setShowLiveStream(false)}
          quiz={selectedQuiz}
          student={selectedStudent}
        />
      )}
    </div>
  );
};

export default ProcotoringByQuiz;
