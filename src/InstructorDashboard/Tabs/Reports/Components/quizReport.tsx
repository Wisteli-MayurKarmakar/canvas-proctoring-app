import "antd/dist/antd.css";
import { message, Table } from "antd";
import React, { FunctionComponent, useEffect } from "react";
import axios from "axios";
import Report from "../../../../report";
import InfoModal from "../../../../infoModal";
import {
  getLtiCanvasConfigByGuidCourseIdQuizId,
  viewCanvasProfile,
  getExceptions as getExceptionsUrl,
  getLtiCVideoRef,
  fetchAccountsByCourseAndEnrollemntType,
  getGetCanvasQuizDetails,
} from "../../../../apiConfigs";
import { userAuthenticationStore } from "../../../../store/autheticationStore";
import { useAppStore } from "../../../../store/AppSotre";

const QuizReports: FunctionComponent = (): JSX.Element => {
  let [quizConfigs, setQuizConfigs] = React.useState<any>([]);
  let [row, setRow] = React.useState<any>(null);
  let [mediaFileName, setMediaFileName] = React.useState<string>("");
  let [exceptions, setExceptions] = React.useState<any>(null);
  let [currentRow, setCurrentRow] = React.useState<any>(null);
  let [profilePic, setProfilePic] = React.useState<any>(null);
  let [selectedQuizConfig, setSelectedQuizConfig] = React.useState<{
    [key: string]: boolean;
  }>({});
  const [courseDetails, setCourseDetails] = React.useState<any>(null);
  const [showRepModal, setShowRepModal] = React.useState<boolean>(false);
  const [studList, setStudList] = React.useState<any>(null);

  const [quizData, setQuizData] = React.useState<any[]>([]);
  const [isFetchingReport, setIsFetchingReport] =
    React.useState<boolean>(false);
  let [selectedQuiz, setSelectedQuiz] = React.useState<any>(null);
  const authenticationData = userAuthenticationStore(
    (state) => state.authenticationData
  );
  const { urlParamsData, tokenData } = useAppStore((state) => state);
  const userName = "ca6a42188e970ab77fab0e34";
  const password = "e5aa447e19ee4180b5ba1364";

  const getCourseQuizesById = () => {
    axios
      .get(
        `${getGetCanvasQuizDetails}/${tokenData.instituteId}/${urlParamsData.guid}/${urlParamsData.courseId}/${tokenData.lmsAccessToken}/`
      )
      .then((res: any) => {
        let quizzes: any = res.data.map((item: any) => {
          item.key = item.id;
          return item;
        });
        setQuizData(quizzes);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getStudentsByCourseId = () => {
    axios
      .get(
        `${fetchAccountsByCourseAndEnrollemntType}/${urlParamsData.courseId}/student/${tokenData.instituteId}/${tokenData.lmsAccessToken}`
      )
      .then((res: any) => {
        let data = res.data.map((item: any) => ({
          ...item,
          key: item.id,
          user_id: item.id,
          course_id: urlParamsData.courseId,
        }));

        setStudList(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getQuizConfigs = async (id: string) => {
    let config = await axios.get(
      `${getLtiCanvasConfigByGuidCourseIdQuizId}?guid=${[
        urlParamsData.guid,
      ]}&courseId=${urlParamsData.courseId}&quizId=${id}`
    );

    if (config.data) {
      setSelectedQuizConfig(config.data);
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
    getCourseQuizesById();
    getStudentsByCourseId();
  }, []);

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
    if (!selectedQuiz.due_at) {
      message.error("Something went wrong. Please try again later");
      return;
    }

    let ltiVidRefResponse = null;
    try {
      ltiVidRefResponse = await axios.post(
        getLtiCVideoRef,
        {
          idUser: id,
          idExam: quizId,
          examDate: new Date(quizDate).toISOString(),
          courseId: urlParamsData.courseId,
          toolConsumerInstanceGuid: urlParamsData.guid,
        },
        {
          headers: { Authorization: `Bearer ${tokenData.lmsAccessToken}` },
        }
      );
    } catch (e) {
      message.error("No report available");
      return;
    }

    if (ltiVidRefResponse && ltiVidRefResponse.data) {
      setMediaFileName(ltiVidRefResponse.data.idReference);
      getExceptions(ltiVidRefResponse.data.idReference);
      setShowRepModal(true);
    } else {
      console.log("error");
    }
  };

  const getExceptions = async (fileId: string) => {
    let exceptions = await axios.get(`${getExceptionsUrl}${fileId}`, {
      headers: {
        Authorization: "Basic VEl4QXBaZTdNQ29zVzY6cFUxVVJ6akdrWThRVkM=",
      },
    });

    if (exceptions.data.data) {
      setExceptions(exceptions.data.data);
    }
  };

  const getUserProfilePicture = async (studentId: string) => {
    let response = await axios.get(
      `${viewCanvasProfile}${urlParamsData.guid}/${studentId}`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.lmsAccessToken}`,
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
    if (selectedQuizConfig.lockdownBrowser) {
      message.error(
        "This Quiz/Test is configured as as Lock Down Browser. No report is available. Thank you."
      );
      return;
    }
    setRow(row);
    // getUserProfilePicture(row.user.id);
    getUserProfilePicture(row.id);
    // getVideoRefId(selectedQuiz.id, selectedQuiz.all_dates.due_at, row.user.id);
    getVideoRefId(selectedQuiz.id, selectedQuiz.due_at, row.id);
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
        return row.name;
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
      {quizData.length > 0 && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleRefreshTable}
            data-mdb-ripple="true"
            data-mdb-ripple-color="light"
            className="btn px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700  focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex items-center"
          >
            Refresh Table
          </button>
          <div className="flex space-x-2 justify-center"></div>
        </div>
      )}
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
      {showRepModal &&
        row &&
        exceptions &&
        selectedQuizConfig &&
        urlParamsData.courseId &&
        urlParamsData.guid && (
          <Report
            show={showRepModal}
            close={() => setShowRepModal(false)}
            title="Quiz Report"
            data={null}
            exceptions={exceptions}
            profilePic={profilePic}
            // studentId={row.user.id}
            studentId={row.id}
            quizId={selectedQuiz.id}
            courseId={urlParamsData.courseId}
            guid={urlParamsData.guid}
            fileName={mediaFileName}
            configuration={selectedQuizConfig}
          />
        )}
      {isFetchingReport && (
        <InfoModal title="" message="Fetching report. Please wait..." />
      )}
    </div>
  );
};

export default QuizReports;
