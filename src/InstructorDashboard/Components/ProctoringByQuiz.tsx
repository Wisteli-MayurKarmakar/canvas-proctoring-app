import { Col, message, Row } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect } from "react";
import { getWebSocketUrl } from "../../APIs/apiservices";
import LiveSreaming from "../Modals/LiveStreaming";
import {
  fetchAccountsByCourseAndEnrollemntType,
  getGetCanvasQuizDetails,
  getScheduling,
  getCanvasAssignmentDetails,
} from "../../apiConfigs";
import { userAuthenticationStore } from "../../store/autheticationStore";
import { useAppStore } from "../../store/AppSotre";
import { QuizTypeProctoringByQuiz } from "../../AppTypes";

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
  const authenticationData = userAuthenticationStore(
    (state) => state.authenticationData
  );
  const socket = getWebSocketUrl();

  useEffect(() => {
    axios
      .get(
        `${getCanvasAssignmentDetails}/${tokenData.instituteId}/${urlParamsData.guid}/${urlParamsData.courseId}/${tokenData.lmsAccessToken}/`
      )
      .then((res) => {
        let temp: any = {};
        let quizzes = res.data.filter((item: any) => {
          if (item.id > 0) {
            temp[item.id] = false;
            return item;
          }
        });
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
        }));
        setEnrollmentLiveStatus(temp);
        setEnrollments(enrollments);
      })
      .catch((err) => {
        console.log(err);
      });
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
      assignmentId: assignmentId,
      quizId: quizId,
      studentId: urlParamsData.studentId,
      courseId: urlParamsData.courseId,
      guid: urlParamsData.guid,
      status: "0",
    };
    axios
      .post(`${getScheduling}`, { ...data })
      .then((response: any) => {
        setSelectedQuizSchedules(response);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const handleQuizClick = (quizz: any) => {
    let temp = { ...qzSelectTrack };
    Object.keys(temp).forEach((key) => {
      temp[key] = false;
    });
    if (quizz.id) {
      setSelectedQuiz(quizz);
      setSelectedQuizSchedules(null);
      getQuizSchedules(quizz.quizId, quizz.id);
      temp[quizz.id.toString()] = true;
      setQzSelectTrack(temp);
      socket.disconnect();
    }
  };

  const showLiveStreamModal = (enrollment: any) => {
    if (!selectedQuiz) {
      message.error("Please select a quiz");
      return;
    }
    setSelectedStudent(enrollment);
    setShowLiveStream(!showLiveStream);
  };

  return (
    <div className="flex items-center flex-col justify-center w-full h-full gap-4">
      {quizzes ? (
        <div className="flex flex-row flex-wrap gap-6 justify-center h-5/6 w-full xl:h-full max-h-96 overflow-y-scroll">
          {quizzes.map((quizz: any, index: number) => {
            return (
              <div
                className={
                  qzSelectTrack[quizz.id]
                    ? `box-border h-32 w-48 border  p-4 rounded bg-blue-400 shadow-lg text-white hover:bg-blue-400`
                    : `transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-110 duration-200 box-border h-32 w-48 border  p-4 rounded text-black shadow-lg bg-white hover:bg-blue-400 hover:text-white`
                }
                key={index}
                style={{ cursor: "pointer" }}
                onClick={() => handleQuizClick(quizz)}
              >
                <div
                  className="flex flex-col h-full w-full items-center justify-center"
                  key={index.toString() + "a"}
                >
                  {"name" in quizz ? (
                    <p className="text-xl font-semibold">
                      {quizz.name.split("-")[1]}
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
            );
          })}
        </div>
      ) : (
        <p className="text-center font-semibold">
          Fetching quizzes. Please wait ...
        </p>
      )}
      <div className="inline-flex justify-center items-center w-full">
        <hr className="my-8 w-full h-1 bg-gray-200 rounded border-0" />
        <div className="absolute left-1/2 px-4 bg-white -translate-x-1/2">
          <p className="text-lg font-semibold">Students</p>
        </div>
      </div>
      <div className="flex flex-row flex-wrap w-full gap-8 h-full items-center justify-center">
        {enrollments ? (
          enrollments.map((enrollment: any, index: number) => {
            return (
              <div
                className="box-border border rounded shadow-lg w-36 h-36 bg-gray-100 text-black"
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
                  {selectedQuiz && selectedQuizSchedules && (
                    <p className="text-center">
                      {moment(selectedQuizSchedules.scheduleDate).format(
                        "MM-DD-YYYY hh:mm a"
                      )}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center font-semibold">
            Fetching students. Please wait...
          </p>
        )}
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
