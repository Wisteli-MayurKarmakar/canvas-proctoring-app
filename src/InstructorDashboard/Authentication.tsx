import React, { useEffect } from "react";
import Grid from "../CommonUtilites/Grid";
import axios from "axios";
import AuthenticateUser from "./AuthenticateUser";
import Modal from "antd/lib/modal/Modal";
import { Button } from "antd";
import { getWebSocketUrl } from "../APIs/apiservices";
import InfoModal from "../infoModal";
import {
  viewCanvasProfile,
  downloadDL,
  fetchCanvasQuizzesByCourseId,
  fetchAccountsByIdAndEnrollemntType,
} from "../apiConfigs";
import { userAuthenticationStore } from "../store/autheticationStore";

interface Props {
  courseId: string;
  authData: any;
  userId: string;
  guid: string;
  studentId: string;
  accountId: string;
}

const Authentication: React.FC<Props> = (props): JSX.Element => {
  let [quizzes, setQuizzes] = React.useState<Object | null>(null);
  const [enrollments, setEnrollments] = React.useState<Object | null>(null);
  const [showAuthModal, setShowAuthModal] = React.useState<boolean>(false);
  const [authForQuizId, setAuthForQuizId] = React.useState<string | null>(null);
  let [studentPhoto, setStudentPhoto] = React.useState<any>(null);
  const [studentAvailableForAuth, setStudentAvailableForAuth] =
    React.useState<boolean>(false);
  let [studentId, setStudentId] = React.useState<any>(null);
  const [quizId, setQuizId] = React.useState<string | null>(null);
  const [selectedRow, setSelectedRow] = React.useState<any>(null);
  let [showWait, setShowWait] = React.useState<boolean>(false);
  let [doAuth, setDoAuth] = React.useState<any>(null);
  let [stuLiveStatusObj, setStuLiveStatusObj] = React.useState<any>(null);
  const [selectedQuizTitle, setSelectedQuizTitle] = React.useState<
    string | null
  >(null);
  let checkAvailabilityInterval: any = null;
  const socket = getWebSocketUrl();
  const authenticationData = userAuthenticationStore(
    (state) => state.authenticationData
  );

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
        return row.name;
      },
    },
    {
      dataIndex: "type",
      key: "type",
      title: `Enrollment Type`,
      render: (row: any) => {
        return "Student";
      },
    },
    {
      dataIndex: "status",
      key: "enrollment_state",
      title: `Status`,
      render: (row: any) => {
        return row;
      },
    },
    {
      dataIndex: "",
      key: "liveStat",
      title: `Live Status`,
      render: (row: any) => {
        if (Object.keys(row).length > 0) {
          return <span>{stuLiveStatusObj[row.id]}</span>;
        } else {
          return false;
        }
      },
    },
    {
      dataIndex: "",
      key: "action",
      title: `Action`,
      render: "",
    },
  ];

  const getStudentProofs = async (studentId: string) => {
    let picProof = await axios.get(
      `${viewCanvasProfile}${props.guid}/${studentId}`,
      {
        headers: {
          Authorization: `Bearer ${props.authData.data.access_token}`,
        },
        responseType: "arraybuffer",
      }
    );

    if (
      picProof.headers["content-type"] === "image/jpeg" ||
      picProof.headers["content-type"] === "image/png" ||
      picProof.headers["content-type"] === "image/svg" ||
      picProof.headers["content-type"] === "image/webp" ||
      picProof.headers["content-type"] === "image/jpg"
    ) {
      let blob = new Blob([picProof.data], {
        type: picProof.headers["content-type"],
      });
      setStudentPhoto(URL.createObjectURL(blob));
    }

    let idProof = await axios.get(`${downloadDL}${props.guid}/${studentId}`, {
      headers: {
        Authorization: `Bearer ${props.authData.data.access_token}`,
      },
      responseType: "arraybuffer",
    });

    if (
      idProof.headers["content-type"] === "image/jpeg" ||
      idProof.headers["content-type"] === "image/png" ||
      idProof.headers["content-type"] === "image/svg" ||
      idProof.headers["content-type"] === "image/webp" ||
      idProof.headers["content-type"] === "image/jpg"
    ) {
      let blob = new Blob([idProof.data], {
        type: idProof.headers["content-type"],
      });
      setStudentId(URL.createObjectURL(blob));
    }
    setShowWait(false);
    setShowAuthModal(true);
  };

  const handleEnrollmentAuthentication = (
    row: any,
    selectedQuizTitle: any,
    quizId: string
  ) => {
    setSelectedQuizTitle(selectedQuizTitle);
    setSelectedRow(row);
    setQuizId(quizId);
    setShowWait(true);
    getStudentProofs(row.id);
  };

  const fetchQuizzesByCourseId = async (courseId: string): Promise<void> => {
    axios
      .get(
        fetchCanvasQuizzesByCourseId +
          courseId +
          "/" +
          props.authData.data.access_token +
          "/" +
          authenticationData?.instituteId
      )
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
      .get(
        `${fetchAccountsByIdAndEnrollemntType}/${props.accountId}/student/${authenticationData?.instituteId}/${props.authData.data.access_token}`
      )
      .then((response) => {
        let temp: any = {};

        let enrollments = response.data.map((enrollment: any) => {
          temp[enrollment.id] = "NOT JOINED";
          return {
            ...enrollment,
            user_id: enrollment.id,
            course_id: props.courseId,
          };
        });

        setStuLiveStatusObj(temp);
        setEnrollments(enrollments);
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
      );
      socket.emit("chat", {
        evt: "chat",
        room: room,
        text: JSON.stringify({
          msgType: "STU_LIVE_REQ",
          msg: { stuIds: [...ids], quizId: id },
        }),
      });

      if (!studentAvailableForAuth) {
        checkAvailabilityInterval = setInterval(() => {
          if (studentAvailableForAuth) {
            clearInterval(checkAvailabilityInterval);
          } else {
            socket.emit("chat", {
              evt: "chat",
              room: room,
              text: JSON.stringify({
                msgType: "STU_LIVE_REQ",
                msg: { stuIds: [...ids], quizId: id },
              }),
            });
          }
        }, 2000);
      }
    }

    socket.on("chat", (data: any) => {
      if (data.type === "chat") {
        let msg = JSON.parse(data.message);

        if (msg.msg.quizId) {
          setAuthForQuizId(msg.msg.quizId);
        }

        if (msg.msgType === "STU_LIVE_REP") {
          let stuId = msg.msg.stuId;
          let stage = msg.msg.status;
          let temp = { ...stuLiveStatusObj };
          temp[stuId] = stage;
          setStuLiveStatusObj(temp);
        }

        if (msg.msgType === "EXAM_SESS_JOIN") {
          let stuId = msg.msg.stuId;
          let step = msg.msg.stepName;
          let temp = { ...stuLiveStatusObj };
          temp[stuId] = "JOINED";
          setStuLiveStatusObj(temp);
        }
        if (msg.msgType === "STU_AUTH_STEP") {
          let stuId = msg.msg.stuId;
          let step = msg.msg.stepName;
          let temp = { ...stuLiveStatusObj };
          temp[stuId] = step;
          setStudentAvailableForAuth(true);
          setStuLiveStatusObj(temp);

          if (step === "Authentication") {
            setDoAuth({ step: step, studId: stuId });
          }
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
          authQuizId={authForQuizId}
          enableAuth={doAuth}
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
      {showWait && <InfoModal title="" message="Please wait..." />}
      {showAuthModal &&
        quizId &&
        selectedRow &&
        selectedQuizTitle &&
        !showWait && (
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
              studentPhoto={studentPhoto}
              studentId={studentId}
              quizId={quizId}
              selectedRow={selectedRow}
              userId={props.userId}
              guid={props.guid}
            />
          </Modal>
        )}
    </div>
  );
};

export default Authentication;
