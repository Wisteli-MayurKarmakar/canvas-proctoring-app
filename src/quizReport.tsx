import "antd/dist/antd.css";
import { Button, message, Space, Table } from "antd";
import React, { FunctionComponent, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
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
  let [quizConfigs, setQuizConfigs] = React.useState<any>([]);
  let [activeExpRow, setActiveExpRow] = React.useState<any>([]);
  const [fullVideo, setFullVideo] = React.useState<any>(null);
  const [scrVideo, setScrVideo] = React.useState<any>(null);
  let [exceptions, setExceptions] = React.useState<any>(null);
  let [currentRow, setCurrentRow] = React.useState<any>(null);
  let [profilePic, setProfilePic] = React.useState<any>(null);
  let [authData, setAuthData] = React.useState<Object | null>(null);
  const [instructorId, setInstructorId] = React.useState<string | null>(
    "17c292b5-4d2c-451a-9e1c-e6393a5aa77e"
  );
  const [courseDetails, setCourseDetails] = React.useState<any>(null);
  const [showRepModal, setShowRepModal] = React.useState<boolean>(false);
  const [studList, setStudList] = React.useState<any>(null);

  const [quizData, setQuizData] = React.useState<any[]>([]);
  const [isFetchingReport, setIsFetchingReport] =
    React.useState<boolean>(false);
  let [selectedQuiz, setSelectedQuiz] = React.useState<any>(null);

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

  const getQuizConfigs = async (id: string) => {
    let config = await axios.get(
      `https://examd-dev.uc.r.appspot.com/student/api/v1/getLtiCanvasConfigByGuidCourseIdQuizId?guid=${[
        props.toolConsumerGuid,
      ]}&courseId=${props.courseId}&quizId=${id}`
    );

    if (config.data) {
      let configurations = [...quizConfigs];
      let obj: {
        [key: string]: Object;
      } = {};
      obj.quizId = id;
      obj.config = config.data;
      configurations.push(obj);
      setQuizConfigs(configurations);
    } else {
      message.error("Failed to get configurations");
      return;
    }
  };

  useEffect(() => {
    // getEndPoints();
    getCourseDetails();
    getCourseQuizesById();
    getStudentsByCourseId();
  }, []);

  const getFullVideo = async (fileName: string): Promise<boolean> => {
    let response = await axios.get(
      `https://examd.us/media/${fileName}_vdo/webm`,
      {
        headers: {
          "Content-type": "video/webm",
        },
        responseType: "arraybuffer",
      }
    );
    if (response.headers["content-type"] !== "application/json") {
      const blobUrl = URL.createObjectURL(
        new Blob([response.data], { type: response.headers["content-type"] })
      );
      setFullVideo(blobUrl);
      return true;
    }
    return false;
  };

  const getScreenCap = async (fileName: string): Promise<boolean> => {
    let response = await axios.get(
      `https://examd.us/media/${fileName}_scr/webm`,
      {
        headers: {
          "Content-type": "video/webm",
        },
        responseType: "arraybuffer",
      }
    );

    if (response.headers["content-type"] !== "application/json") {
      const blobUrl = URL.createObjectURL(
        new Blob([response.data], { type: response.headers["content-type"] })
      );
      setScrVideo(blobUrl);
      return true;
    }
    return false;
  };

  const getFullVideoAndScreenCap = async (
    fileName: string
  ): Promise<boolean> => {
    let fullVideo: any = getFullVideo(fileName);

    let scrVideo: any = getScreenCap(fileName);

    let [res1, res2] = await Promise.all([fullVideo, scrVideo]);

    if (res1 && res2) {
      return true;
    }

    return false;
  };

  const getVideoRefId = async (
    quizId: string,
    quizDate: string,
    id: string
  ) => {
    let configObj: any = null;
    quizConfigs.forEach((config: any) => {
      if (config.quizId === selectedQuiz.id) {
        configObj = config.config;
      }
    });
    if (!selectedQuiz.all_dates.due_at) {
      message.error("Something went wrong. Please try again later");
      return;
    }

    let ltiVidRefResponse = null;
    try {
      ltiVidRefResponse = await axios.post(
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
      );
    } catch (e) {
      message.error("Failed to fetch result");
      return;
    }

    if (ltiVidRefResponse && ltiVidRefResponse.data) {
      setIsFetchingReport(true);
      if (configObj.recordScreen && configObj.recordWebcam) {
        let isMediaAvailable = getFullVideoAndScreenCap(
          ltiVidRefResponse.data.idReference
        );
        let exceptions = getExceptions(ltiVidRefResponse.data.idReference);

        let [res1, res2] = await Promise.all([isMediaAvailable, exceptions]);

        if (res1 && res2) {
          setShowRepModal(true);
        } else {
          message.error("Something went wrong. Please try again later");
        }
      }

      if (configObj.recordScreen && !configObj.recordWebcam) {
        let screenCap = getScreenCap(ltiVidRefResponse.data.idReference);
        let exceptions = getExceptions(ltiVidRefResponse.data.idReference);

        let [res1, res2] = await Promise.all([screenCap, exceptions]);

        if (res1 && res2) {
          setShowRepModal(true);
        } else {
          message.error("Something went wrong. Please try again later");
        }
      }

      if (!configObj.recordScreen && configObj.recordWebcam) {
        let fullVideo = getFullVideo(ltiVidRefResponse.data.idReference);
        let exceptions = getExceptions(ltiVidRefResponse.data.idReference);
        let [res1, res2] = await Promise.all([fullVideo, exceptions]);

        if (res1 && res2) {
          setShowRepModal(true);
        } else {
          message.error("Something went wrong. Please try again later");
        }
      }
      if (!configObj.recordScreen && !configObj.recordWebcam) {
        let exceptions = await getExceptions(
          ltiVidRefResponse.data.idReference
        );
        if (exceptions) {
          setShowRepModal(true);
        } else {
          message.error("Something went wrong. Please try again later");
        }
      }

      setIsFetchingReport(false);
    } else {
      console.log("error");
    }
  };

  const getExceptions = async (fileId: string): Promise<boolean> => {
    let exceptions = await axios.get(
      `https://examd.online/ai/db/excp/list/ex/${fileId}`,
      {
        headers: {
          Authorization: "Basic VEl4QXBaZTdNQ29zVzY6cFUxVVJ6akdrWThRVkM=",
        },
      }
    );

    if (exceptions.data.data) {
      setExceptions(exceptions.data.data);
      return true;
    }
    return false;
  };

  const getUserProfilePicture = async (studentId: string) => {
    let response = await axios.get(
      `https://examd-dev.uc.r.appspot.com/student/api/v1/viewCanvasProfile/${props.toolConsumerGuid}/${studentId}`,
      {
        headers: {
          Authorization: `Bearer ${props.reqToken}`,
        },
        responseType: "arraybuffer",
      }
    );

    if (
      response.headers["content-type"] === "image/jpeg" ||
      response.headers["content-type"] === "image/png" ||
      response.headers["content-type"] === "image/svg" ||
      response.headers["content-type"] === "image/webp" ||
      response.headers["content-type"] === "image/jpg"
    ) {
      let blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      setProfilePic(URL.createObjectURL(blob));
    }
  };

  const handleViewReport = (row: any) => {
    getUserProfilePicture(row.user.id);
    getVideoRefId(selectedQuiz.id, selectedQuiz.all_dates.due_at, row.user.id);
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
              // expandedRowKeys: [currentRow],
              onExpand(expanded, record) {
                if (expanded) {
                  setSelectedQuiz(record);
                  setCurrentRow(record.key);
                }
              },
              onExpandedRowsChange: (row: any) => {
                if (row.length > 0) {
                  getQuizConfigs(row[row.length - 1]);
                }
              },
            }}
          />
        ) : (
          <p className="font-bold text-center mt-5">
            Fetching data. Please wait...
          </p>
        )}
      </div>
      {showRepModal && (
        <Report
          show={showRepModal}
          close={() => setShowRepModal(false)}
          title="Quiz Report"
          data={null}
          fullVideoUrl={fullVideo}
          scrVideo={scrVideo}
          exceptions={exceptions}
          profilePic={profilePic}
        />
      )}
      {isFetchingReport && (
        <InfoModal title="" message="Fetching report. Please wait..." />
      )}
    </div>
  );
};

export default ProctoringExam;
