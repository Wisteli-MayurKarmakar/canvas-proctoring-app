import { Col, Divider, message, Row } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect } from "react";
import { getWebSocketUrl } from "../../APIs/apiservices";
import LiveSreaming from "../Modals/LiveStreaming";

interface Props {
  authData: any;
  courseId: string;
  userId: string;
}

const LiveProctoring: React.FC<Props> = (props): JSX.Element => {
  const [quizzes, setQuizzes] = React.useState<any>(null);
  const [qzSelectTrack, setQzSelectTrack] = React.useState<any>(null);
  const [enrollments, setEnrollments] = React.useState<any>(null);
  let [selectedQuiz, setSelectedQuiz] = React.useState<any>(null);
  let [showLiveStream, setShowLiveStream] = React.useState<boolean>(false);
  let [selectedStudent, setSelectedStudent] = React.useState<any>(null);
  const [enrollmentLiveStatus, setEnrollmentLiveStatus] =
    React.useState<any>(null);
  const [socketRoom, setSocketRoom] = React.useState<any>(null);
  const [socketUser, setSocketUser] = React.useState<any>(
    "chat_" + props.userId
  );
  const socket = getWebSocketUrl();
  const onJoinColorCode = "border-green-400";
  const onNotJoinColorCode = "border-yellow-400";
  const onViolationsColorCode = "border-red-400";

  useEffect(() => {
    axios
      .get(
        `https://examd-dev.uc.r.appspot.com/student/api/v1/fetchCanvasQuizzesByCourseId/${props.courseId}`,
        {
          headers: {
            Authorization: `Bearer ${props.authData.data.access_token}`,
          },
        }
      )
      .then((res) => {
        let temp: any = {};
        res.data.forEach((item: any) => {
          temp[item.id] = false;
        });
        setQzSelectTrack(temp);
        setQuizzes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(
        `https://examd.us/student/api/v1/fetchCanvasEnrollmentsByCourseId/${props.courseId}`,
        {
          headers: {
            Authorization: `Bearer ${props.authData.data.access_token}`,
          },
        }
      )
      .then((res) => {
        let temp: any = {};
        res.data.forEach((item: any) => {
          temp[item.user.id] = 0;
        });
        setEnrollmentLiveStatus(temp);
        setEnrollments(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const sendDataViaSocket = (channel: any, data: any) => {
    socket.emit(channel, data);
  };

  const connectSocket = () => {
    socket.connect();
    socket.emit("validate", {
      evt: "chat",
      room: socketRoom,
      user: socketUser,
    });

    socket.on("chat", (data: any) => {
      console.log("chat data", data);
    });
  };

  useEffect(() => {
    if (socketRoom) {
      connectSocket();
    }
  }, [socketRoom]);

  useEffect(() => {
    if (selectedQuiz) {
      setSocketRoom("rm_" + props.courseId + "_" + selectedQuiz.id + "rtc");
    }
  }, [selectedQuiz]);

  const handleQuizClick = (quizz: any) => {
    setSelectedQuiz(quizz);
    let temp = { ...qzSelectTrack };
    Object.keys(temp).forEach((key) => {
      temp[key] = false;
    });
    temp[quizz.id] = true;
    setQzSelectTrack(temp);
    socket.disconnect();
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
    <div className="flex items-center flex-col justify-center w-5/5">
      <div className="flex flex-row flex-wrap gap-6 justify-center">
        {quizzes &&
          quizzes.map((quizz: any, index: number) => {
            return (
              <div
                className={
                  qzSelectTrack[quizz.id]
                    ? `box-border h-32 w-48  p-4 border-4 rounded hover:bg-slate-300 border-blue-800`
                    : `box-border h-32 w-48  p-4 border-4 rounded hover:bg-slate-300 border-slate-300`
                }
                key={index}
                style={{ cursor: "pointer" }}
              >
                <div
                  className="flex flex-col text-center"
                  onClick={() => handleQuizClick(quizz)}
                >
                  <p className="text-xl font-semibold">{quizz.title}</p>
                  <p className="font-semibold">
                    {moment(quizz.all_dates.due_at).format("MM-DD-YYYY h:mm A")}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
      <br />
      <div className="box-border border-4 p-10 rounded h-full w-full">
        <Row gutter={24}>
          <Col
            span={24}
            style={{ overflowY: "scroll", height: 500, maxHeight: 500 }}
          >
            <div className="grid grid-cols-3 gap-3 h-full content-between">
              {enrollments ? (
                enrollments.map((enrollment: any, index: number) => {
                  return (
                    <div
                      className={`box-border h-56 w-56 text-center p-2 border-2 ${
                        enrollmentLiveStatus[enrollment.user.id] === 0
                          ? onNotJoinColorCode
                          : enrollmentLiveStatus[enrollment.user.id] === 1
                          ? onJoinColorCode
                          : onViolationsColorCode
                      } rounded`}
                    >
                      <div className="flex flex-col justify-center items-center">
                        <p className="text-center font-semibold">
                          {enrollment.user.name}
                        </p>
                        <div className="box-border h-28 mb-3 w-48 border-2 rounded border-blue-400 overflow-y-scroll"></div>
                        <button
                          type="button"
                          onClick={() => showLiveStreamModal(enrollment)}
                          className="justify-center px-8 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                        >
                          Stream Live
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center font-semibold">
                  Preparing student tiles...
                </p>
              )}
            </div>
          </Col>
          {/* <Col span={10}>
            <div className="grid grid-cols-3 h-full gap-3 content-center">
              {enrollments ? (
                enrollments.map((item: any, index: number) => {
                  return (
                    <button
                      key={index}
                      type="button"
                      style={{ cursor: "none" }}
                      className="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                    >
                      {item.user.name}
                    </button>
                  );
                })
              ) : (
                <p className="text-center text-xl font-semibold">
                  Fetching students...
                </p>
              )}
            </div>
          </Col> */}
        </Row>
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

export default LiveProctoring;
