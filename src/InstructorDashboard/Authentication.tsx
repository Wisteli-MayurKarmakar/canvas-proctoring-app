import React, { useEffect, useState } from "react";
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
  getCanvasAssignmentDetails,
  fetchAccountsByCourseAndEnrollemntType,
  getLtiScheduleByQuizId,
} from "../apiConfigs";
import { useAppStore } from "../store/AppSotre";
import moment from "moment";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const Authentication: React.FC = (): JSX.Element => {
  let [quizzes, setQuizzes] = React.useState<Object | null>(null);
  const [enrollments, setEnrollments] = React.useState<any>(null);
  const [showAuthModal, setShowAuthModal] = React.useState<boolean>(false);
  const [authForQuizId, setAuthForQuizId] = React.useState<any>(null);
  let [studentPhoto, setStudentPhoto] = React.useState<any>(null);
  const [studentAuthed, setStudentAuthed] = React.useState<boolean>(false);
  const [assingmentSchedules, setAssignmentSchedules] = useState<any>(null);
  const [studentAvailableForAuth, setStudentAvailableForAuth] =
    React.useState<boolean>(false);
  let [studentId, setStudentId] = React.useState<any>(null);
  const [quizId, setQuizId] = React.useState<string | null>(null);
  const [selectedRow, setSelectedRow] = React.useState<any>(null);
  let [showWait, setShowWait] = React.useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);
  let [doAuth, setDoAuth] = React.useState<any>(null);
  let [stuLiveStatusObj, setStuLiveStatusObj] = React.useState<any>(null);
  const [selectedQuizTitle, setSelectedQuizTitle] = React.useState<
    string | null
  >(null);

  const socket = getWebSocketUrl();
  const { urlParamsData, tokenData, courseDetails } = useAppStore(
    (state) => state
  );

  const quizzesColumns = [
    {
      dataIndex: "name",
      key: "Name",
      title: `Assignment Name`,
    },
    {
      dataIndex: "",
      key: "instructorProctored",
      title: `By Examd`,
      render: (row: any) => {
        if (row.examdLiveLaunch === "Y") {
          return <CheckCircleOutlined style={{color: "green", fontSize: 20}}/>;
        }
        return <CloseCircleOutlined style={{color: "red", fontSize: 20}}/>;
      },
    },
    {
      dataIndex: "",
      key: "lock_at",
      title: `Available Until`,
      render: (row: any) => {
        if ("lock_at" in row) {
          let timezoneOffset: string = `.${Math.abs(
            moment().utcOffset()
          ).toString()}Z`;
          return moment(row.lock_at.replace("Z", timezoneOffset)).format(
            "DD/MM/YYYY hh:mm a"
          );
        }
        return "N/A";
      },
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
      dataIndex: "",
      key: "scheduleDate",
      title: `Schedule Date`,
      render: (row: any) => {
        if (assingmentSchedules) {
          let timezoneOffset: string = `.${Math.abs(
            moment().utcOffset()
          ).toString()}Z`;
          return moment(row.scheduleDate + timezoneOffset).format(
            "MM-DD-YYYY hh:mm a"
          );
        }
        if (assingmentSchedules === false) {
          return "Not scheduled";
        }
        return "Getting schedule...";
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
      `${viewCanvasProfile}${urlParamsData.guid}/${studentId}`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.lmsAccessToken}`,
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

    let idProof = await axios.get(
      `${downloadDL}${urlParamsData.guid}/${studentId}`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.lmsAccessToken}`,
        },
        responseType: "arraybuffer",
      }
    );

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

  const fetchQuizzesByCourseId = async (): Promise<void> => {
    axios
      .get(
        `${getCanvasAssignmentDetails}/${tokenData.instituteId}/${urlParamsData.guid}/${urlParamsData.courseId}/${tokenData.lmsAccessToken}`
      )
      .then((response) => {
        let assignments = response.data.filter((assignment: any) => {
          if (assignment.id !== 0) {
            if (
              assignment.instructorProctored === "Y" ||
              assignment.examdLiveLaunch === "Y"
            ) {
              assignment.key = assignment.id;
              return assignment;
            }
          }
        });
        // setQuizzes(response.data);
        setQuizzes(assignments);
        setIsRefreshing(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchCourseEnrollments = async (courseId: string): Promise<void> => {
    axios
      .get(
        `${fetchAccountsByCourseAndEnrollemntType}/${urlParamsData.courseId}/student/${tokenData?.instituteId}/${tokenData.lmsAccessToken}`
      )
      .then((response) => {
        let temp: any = {};

        let enrollments = response.data.map((enrollment: any) => {
          temp[enrollment.id] = "NOT JOINED";

          return {
            ...enrollment,
            key: enrollment.id,
            user_id: enrollment.id,
            course_id: urlParamsData.courseId,
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
    let room = "rm_" + urlParamsData.courseId + "_" + id;
    let user = "chat_" + urlParamsData.userId + "_" + "instr";

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
          msg: { stuIds: [...ids], assignmentId: id },
        }),
      });
    }

    socket.on("chat", (data: any) => {
      if (data.type === "chat") {
        let msg = JSON.parse(data.message);

        if (msg.msg.assignmentId) {
          setAuthForQuizId(msg.msg.assignmentId);
        }

        if (msg.msgType === "STU_LIVE_REP") {
          let assignmentId = msg.msg.assignmentId;
          if (id === assignmentId) {
            let stuId = msg.msg.stuId;
            let stage = msg.msg.status;
            let temp = { ...stuLiveStatusObj };
            temp[stuId] = stage;
            setStuLiveStatusObj(temp);
          }
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

          if (step === "LIVE_AUTH") {
            setDoAuth({ step: step, studId: stuId });
          }
        }
        if (msg.msgType === "LIVE_AUTH") {
          let assgnId = msg.msg.assignmentId;
          if (id === parseInt(assgnId)) {
            let stuId = msg.msg.stuId;
            let step = msg.msg.stepName;
            let temp = { ...stuLiveStatusObj };
            temp[stuId] = step;
            setAuthForQuizId(assgnId);
            setStudentAvailableForAuth(true);
            setStuLiveStatusObj(temp);
            setDoAuth({ step: step, studId: stuId });
          }
        }
      }
    });
  };

  useEffect(() => {
    if (assingmentSchedules) {
      let students: any = [...enrollments];
      students.forEach((student: any) => {
        student.scheduleDate = assingmentSchedules.scheduleDate;
      });
      setEnrollments(students);
    }
  }, [assingmentSchedules]);

  const getAssignmentSchedules = (quizId: string) => {
    let payload = {
      instituteId: tokenData.instituteId,
      quizId: quizId,
      courseId: urlParamsData.courseId,
      status: 0,
      guid: urlParamsData.guid,
    };
    axios
      .post(`${getLtiScheduleByQuizId}`, { ...payload })
      .then((response: any) => {
        setAssignmentSchedules(response.data);
      })
      .catch((error: any) => {
        setAssignmentSchedules(false);
      });
  };

  const getExpandedRow = (row: any) => {
    getAssignmentSchedules(row.quizId);
    setAssignmentSchedules(null);
    connectSocket(row.id);
  };

  const getStudentAuthStat = (data: any) => {
    if (
      data.courseId === urlParamsData.courseId &&
      data.assignmentId === authForQuizId &&
      urlParamsData.studentId === data.studentId
    ) {
      setStudentAuthed(true);
    }
  };

  const handleRefreshTable = () => {
    setIsRefreshing(true);
    fetchQuizzesByCourseId();
  };

  useEffect(() => {
    if (urlParamsData.courseId) {
      fetchQuizzesByCourseId();
      fetchCourseEnrollments(urlParamsData.courseId);
    }
  }, [urlParamsData.courseId]);

  let courseName: string = "";
  if (courseDetails) {
    courseName = courseDetails.name;
  }

  return (
    <div className="flex flex-col mx-auto w-4/5 gap-4">
      {courseName !== "" && (
        <h2 className="text-center text-2xl underline">
          Course Name - {courseName}
        </h2>
      )}
      <div className="flex space-x-2 justify-end">
        <button
          type="button"
          onClick={handleRefreshTable}
          className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          Refresh Table
        </button>
      </div>
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
          studentAuthStatus={studentAuthed}
          loading={isRefreshing}
        />
      ) : (
        <div className="flex flex-col gap-6 justify-center items-center h-full">
          <h2 className="text-sm">Fetching assignments. Please wait...</h2>
        </div>
      )}
      {showWait && <InfoModal title="" message="Please wait..." />}
      {showAuthModal &&
        quizId &&
        selectedRow &&
        selectedQuizTitle &&
        urlParamsData.courseId &&
        urlParamsData.userId &&
        urlParamsData.guid &&
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
              authConfigs={tokenData}
              quizTitle={selectedQuizTitle}
              courseId={urlParamsData.courseId}
              studentPhoto={studentPhoto}
              studentId={studentId}
              quizId={quizId}
              selectedRow={selectedRow}
              userId={urlParamsData.userId}
              guid={urlParamsData.guid}
              updateStudentAuthStatus={getStudentAuthStat}
            />
          </Modal>
        )}
    </div>
  );
};

export default Authentication;
