import React, { useEffect } from "react";
import Grid from "../CommonUtilites/Grid";
import axios from "axios";
import { COURSES_BY_QUIZ_ID_URL } from "../APIs/Constants";
import { ENROLLMENTS_BY_COURSE_ID_URL } from "../APIs/Constants";
import AuthenticateUser from "./AuthenticateUser";
import Modal from "antd/lib/modal/Modal";
import { Button } from "antd";
import { getWebSocketUrl } from "../APIs/apiservices";

interface Props {
  courseId: string;
  authData: any;
  userId: string;
}

const Authentication: React.FC<Props> = (props): JSX.Element => {
  let [quizzes, setQuizzes] = React.useState<Object | null>(null);
  const [enrollments, setEnrollments] = React.useState<Object | null>(null);
  const [showAuthModal, setShowAuthModal] = React.useState<boolean>(false);
  const [quizId, setQuizId] = React.useState<string | null>(null);
  const [selectedRow, setSelectedRow] = React.useState<any>(null);
  let [stuLiveStatusObj, setStuLiveStatusObj] = React.useState<any>(null);
  const [selectedQuizTitle, setSelectedQuizTitle] = React.useState<
    string | null
  >(null);
  const socket = getWebSocketUrl();

  const quizzesColumns = [
    {
      dataIndex: "title",
      key: "title",
      title: `Quiz Name`,
    },
    {
      dataIndex: "quiz_type",
      key: "quiz_type",
      title: `Quiz Type`,
    },
    {
      dataIndex: "allowed_attempts",
      key: "allowed_attempts",
      title: "Attempts allowed",
    },
    {
      dataIndex: "question_count",
      key: "question_count",
      title: "Questions",
    },
    {
      dataIndex: "time_limit",
      key: "time_limit",
      title: `Duration`,
    },
  ];

  const enrollmentsColumns = [
    {
      dataIndex: "",
      key: "name",
      title: `Name`,
      render: (row: any) => {
        return row.user.name;
      },
    },
    {
      dataIndex: "type",
      key: "type",
      title: `Enrollment Type`,
    },
    {
      dataIndex: "enrollment_state",
      key: "enrollment_state",
      title: `Status`,
      render: (row: any) => {
        if (row === "active") {
          return <span>Active</span>;
        } else {
          return <span>Inactive</span>;
        }
      },
    },
    {
      dataIndex: "",
      key: "liveStat",
      title: `Live Status`,
      render: (row: any) => {
        return <span>{stuLiveStatusObj[row.user.id]}</span>;
      },
    },
    {
      dataIndex: "",
      key: "action",
      title: `Action`,
      //   render: (row: any) => {
      //     return (
      //       <button onClick={() => handleViewReport(row)}>View Report</button>
      //     );
      //   },
      render: "",
    },
  ];

  const handleEnrollmentAuthentication = (
    row: any,
    selectedQuizTitle: any,
    quizId: string
  ) => {
    console.log(
      "handleEnrollmentAuthentication",
      row,
      selectedQuizTitle,
      quizId
    );
    setSelectedQuizTitle(selectedQuizTitle);
    setSelectedRow(row);
    setQuizId(quizId);
    setShowAuthModal(true);
  };

  const fetchQuizzesByCourseId = async (courseId: string): Promise<void> => {
    axios
      .get(COURSES_BY_QUIZ_ID_URL + "16", {
        headers: {
          Authorization: `Bearer ${props.authData.data.access_token}`,
        },
      })
      .then((response) => {
        response.data.forEach((quiz: any) => {
          quiz.key = quiz.id;
        });
        setQuizzes(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchCourseEnrollments = async (courseId: string): Promise<void> => {
    axios
      .get(ENROLLMENTS_BY_COURSE_ID_URL + props.courseId, {
        headers: {
          Authorization: `Bearer ${props.authData.data.access_token}`,
        },
      })
      .then((response) => {
        let temp: any = {};
        response.data.forEach((enrollment: any) => {
          temp[enrollment.user_id] = "NOT JOINED";
        });
        setStuLiveStatusObj(temp);
        setEnrollments(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const connectSocket = (id: any) => {
    let room = "rm_" + props.courseId + "_" + id;
    let user = "chat_" + props.userId + "_" + "instr";

    if (!socket.connected) {
      socket.connect();
      socket.emit("validate", {
        evt: "chat",
        room: room,
        user: user,
      });
    }

    if (enrollments) {
      let ids = Object.entries(enrollments).map(
        (enrollment: any) => enrollment[1].user_id
      )
      socket.emit("chat", {
        evt: "chat",
        room: room,
        text: JSON.stringify({
          msgType: "STU_LIVE_REQ",
          msg: {stuIds: [...ids], quizId: id},
        }),
      });
    }

    socket.on("chat", (data: any) => {
      if (data.type === "chat") {
        let msg = JSON.parse(data.message);
        if (msg.msgType === "STU_LIVE_REP") {
          let stuId = msg.msg.stuId;
          let stage = msg.msg.status;
          let temp = { ...stuLiveStatusObj };
          temp[stuId] = stage;
          setStuLiveStatusObj(temp);
        }
      }
    });
  };

  const getExpandedRow = (row: any) => {
    connectSocket(row.id);
  };

  useEffect(() => {
    fetchQuizzesByCourseId(props.courseId);
    fetchCourseEnrollments(props.courseId);
  }, []);

  return (
    <div className="flex flex-col mx-auto w-4/5">
      <h2 className="text-center text-2xl underline">Live Authentication</h2>
      {quizzes && enrollments && stuLiveStatusObj ? (
        <Grid
          data={quizzes}
          nestedTable={true}
          nestedTableData={enrollments}
          pagination={true}
          mainTableColumns={quizzesColumns}
          nestedTableColumns={enrollmentsColumns}
          childTableActions={{ Authenticate: handleEnrollmentAuthentication }}
          mainTableActions={null}
          expandedRow={getExpandedRow}
        />
      ) : (
        <div className="flex flex-col gap-6 justify-center items-center h-screen">
          <h2 className="text-sm">Fetching Quizzes. Please wait...</h2>
        </div>
      )}
      {showAuthModal && quizId && selectedRow && selectedQuizTitle && (
        <Modal
          visible={showAuthModal}
          onCancel={() => setShowAuthModal(false)}
          maskClosable={false}
          width={"60pc"}
          destroyOnClose={true}
          title={
            <span>
              <p>{selectedQuizTitle} - Authentication</p>
            </span>
          }
          footer={[
            <Button key="back" onClick={() => setShowAuthModal(false)}>
              Close
            </Button>,
          ]}
        >
          <AuthenticateUser
            authConfigs={props.authData}
            quizTitle={selectedQuizTitle}
            courseId={props.courseId}
            quizId={quizId}
            selectedRow={selectedRow}
            userId={props.userId}
          />
        </Modal>
      )}
    </div>
  );
};

export default Authentication;
