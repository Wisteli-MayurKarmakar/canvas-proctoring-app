import "antd/dist/antd.css";
import { Button, message, Space, Table } from "antd";
import React, { FunctionComponent, useEffect } from "react";
import axios from "axios";
import Report from "./report";
import InfoModal from "./infoModal";

interface Props {
  userId: string;
  courseId: string;
  reqToken: string;
  toolConsumerGuid: string;
}

const ProctoringExam: FunctionComponent<Props> = (props): JSX.Element => {
  const [noOfStudentsOfExam, setNoOfStudentsOfExam] = React.useState<
    number | null
  >(0);
  let [activeExpRow, setActiveExpRow] = React.useState<any>([]);
  const [fullVideo, setFullVideo] = React.useState<any>(null);
  const [scrVideo, setScrVideo] = React.useState<any>(null);
  const [exceptions, setExceptions] = React.useState<any>(null);

  let [token, setToken] = React.useState<string | null>(
    "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb2huIiwibmJmIjoxNjU3MjY5MDA4LCJyb2xlcyI6WyJTVFUiXSwiaXNzIjoidXNlcnMiLCJleHAiOjE2NTcyNzI2MDgsImlhdCI6MTY1NzI2OTAwOH0.H2_o6ttkmBiar5GgzpA2Z1SnSpwTddCUW4K4BFDdhM0"
  );
  let [apiEndPoints, setApiEndPoints] = React.useState<string | null>(null);
  let [authData, setAuthData] = React.useState<Object | null>(null);
  const [instructorId, setInstructorId] = React.useState<string | null>(
    "17c292b5-4d2c-451a-9e1c-e6393a5aa77e"
  );
  const [courseDetails, setCourseDetails] = React.useState<any>(null);
  const [showRepModal, setShowRepModal] = React.useState<boolean>(false);
  const [studentsCompletedExam, setStudentsCompletedExam] = React.useState<
    any | null
  >({});
  const [studList, setStudList] = React.useState<any>(null);

  const [quizData, setQuizData] = React.useState<any[]>([]);
  const [isFetchingReport, setIsFetchingReport] = React.useState<boolean>(false);
  let selectedQuiz = "";
  let quizDate = "";
  const userName = "ca6a42188e970ab77fab0e34";
  const password = "e5aa447e19ee4180b5ba1364";

  const getCourseQuizesById = () => {
    axios
      .get(
        `https://examd.us/student/api/v1/fetchCanvasQuizzesByCourseId/${props.courseId}`,
        {
          headers: { Authorization: `Bearer ${props.reqToken}` },
        }
      )
      .then((res: any) => {
        let data = res.data.map((item: any) => ({
          ...item,
          key: item.id,
        }));
        setQuizData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const getEndPoints = (): void => {
  //   axios
  //     .get("https://examd.us/cdn/urls/xproctor/1")
  //     .then((res: any) => {
  //       setApiEndPoints(res.data);
  //       authenticateUser(res.data.auth_url as string);
  //     })
  //     .catch((err) => {});
  // };

  const getStudentsByCourseId = () => {
    axios
      .get(
        `https://examd.us/student/api/v1/fetchCanvasEnrollmentsByCourseId/${props.courseId}`,
        {
          headers: { Authorization: `Bearer ${props.reqToken}` },
        }
      )
      .then((res: any) => {
        let data = res.data.map((item: any) => ({
          ...item,
          key: item.id,
        }));
        setStudList(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const authenticateUser = (url: string) => {
    axios
      .post(url, {
        username: userName,
        password: password,
      })
      .then((res) => {
        setAuthData(res.data);
        getCourseDetails();
        getCourseQuizesById();
        getStudentsByCourseId();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCourseDetails = () => {
    axios
      .get(
        `https://examd.us/student/api/v1/fetchCanvasCourseDetailsByCourseId/${props.courseId}`,
        {
          headers: { Authorization: `Bearer ${props.reqToken}` },
        }
      )
      .then((res: any) => {
        setCourseDetails(res.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (fullVideo || scrVideo || exceptions) {
      setIsFetchingReport(false);
      setShowRepModal(true);
    }
  }, [fullVideo, scrVideo]);

  useEffect(() => {
    // getEndPoints();
    getCourseDetails();
    getCourseQuizesById();
    getStudentsByCourseId();
  }, []);

  const getFullVideoAndScreenCap = (fileName: string) => {
    axios
      .get(`https://examd.us/media/${fileName}_vdo/webm`, {
        headers: {
          "Content-type": "video/webm",
        },
        responseType: "arraybuffer",
      })
      .then((resp: any) => {
        const blobUrl = URL.createObjectURL(
          new Blob([resp.data], { type: "video/mp4" })
        );
        setFullVideo(blobUrl);
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(`https://examd.us/media/${fileName}_scr/webm`, {
        headers: {
          "Content-type": "video/webm",
        },
        responseType: "arraybuffer",
      })
      .then((resp: any) => {
        const blobUrl = URL.createObjectURL(
          new Blob([resp.data], { type: "video/mp4" })
        );
        setScrVideo(blobUrl);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getVideoRefId = (quizId: string, quizDate: string, id: string) => {
    axios
      .post(
        "https://examd-dev.uc.r.appspot.com/student/api/v1/getLtiCVideoRef",
        {
          idUser: id,
          idExam: quizId,
          examDate: new Date(quizDate).toISOString(),
          courseId: props.courseId,
          toolConsumerInstanceGuid: props.toolConsumerGuid,
        },
        {
          headers: { Authorization: `Bearer ${props.reqToken}` },
        }
      )
      .then((resp) => {
        getFullVideoAndScreenCap(resp.data.idReference);
        getExceptions(resp.data.idReference);
      })
      .catch((error) => {
        console.log(error);
        alert("No report available");
      });
  };

  const getExceptions = (fileId: string) => {
    axios.get(`https://examd.online/ai/db/excp/list/ex/${fileId}`, {
      headers: { Authorization: "Basic VEl4QXBaZTdNQ29zVzY6cFUxVVJ6akdrWThRVkM=" },
    }).then((res) => {
      setExceptions(res.data.data);
    }).catch((err) => {
      message.error("Error fetching exceptions");
    })
  }

  const handleViewReport = (row: any) => {
    setIsFetchingReport(true);
    getVideoRefId(selectedQuiz, quizDate, props.userId);
    
  };

  const handleRefreshTable = () => {
    setQuizData([]);
    getCourseQuizesById();
  };

  let studentColumns = [
    {
      dataIndex: "",
      key: "",
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
      key: "action",
      title: `Action`,
      render: (row: any) => {
        return (
          <button onClick={() => handleViewReport(row)}>View Report</button>
        );
      },
    },
  ];

  let columns = [
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
  return (
    <div className="container mx-auto mt-3">
      <p className="font-sans font-bold text-2xl underline text-center">
        {!courseDetails ? (
          <svg
            role="status"
            className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
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
        ) : (
          courseDetails.name
        )}
        {"   "}-{"   "}Quizzes reports
      </p>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleRefreshTable}
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          className="btn px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700  focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex items-center"
        >
          Refresh Table
        </button>
        <div className="flex space-x-2 justify-center"></div>
      </div>
      <div className="mt-4">
        {quizData.length !== 0 ? (
          <Table
            columns={columns as Object[]}
            bordered={true}
            dataSource={quizData}
            pagination={{ position: ["bottomRight"] }}
            expandable={{
              expandedRowRender: (rowData: any) => {
                selectedQuiz = rowData.id;
                quizDate = rowData.all_dates.due_at;
                if (studList) {
                  return (
                    <>
                      <p className="text-center text-base font-bold underline">
                        Students violation messages and video report
                      </p>
                      <Table
                        columns={studentColumns}
                        dataSource={studList}
                        pagination={
                          studList && studList.length > 10
                            ? { position: ["bottomRight"] }
                            : false
                        }
                      />
                    </>
                  );
                } else {
                  return <p className="font-bold">Getting students...</p>;
                }
              },
              defaultExpandedRowKeys: [],
            }}
          />
        ) : (
          <p className="font-bold text-center mt-5">
            Fetching data. Please wait...
          </p>
        )}
      </div>
      {showRepModal && (fullVideo || scrVideo || exceptions) && (
        <Report
          show={showRepModal}
          close={() => setShowRepModal(false)}
          title="Quiz Report"
          data={null}
          fullVideoUrl={fullVideo}
          scrVideo={scrVideo}
          exceptions={exceptions}
        />
      )}
      {!fullVideo && !scrVideo && isFetchingReport && (
        <InfoModal title="" message="Fetching report. Please wait..." />
      )}
    </div>
  );
};

export default ProctoringExam;
