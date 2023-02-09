import "antd/dist/antd.min.css";
import { message, Table, Tooltip } from "antd";
import { FunctionComponent, useEffect, useState } from "react";
import axios from "axios";
import Report from "../../../../report";
import InfoModal from "../../../../infoModal";
import {
  getLtiCanvasConfigByGuidCourseIdQuizId,
  viewCanvasProfile,
  getExceptions as getExceptionsUrl,
  getCanvasQuizDetails,
  getLtiCanvasVideoCombRef,
  saveLtiVideoRef,
} from "../../../../apiConfigs";
import { useAppStore } from "../../../../store/AppSotre";
import moment from "moment";
import {

  StudentReportAndJourneyDetails,
} from "../../../../AppTypes";
import {
  useAssignmentStore,
} from "../../../../store/StudentDashboardStore";
import NoQuiz from "../../../../CommonUtilites/NoQuiz";
import { InfoCircleFilled } from "@ant-design/icons";

const QuizReports: FunctionComponent = (): JSX.Element => {
  let [quizConfigs, setQuizConfigs] = useState<any>([]);
  let [row, setRow] = useState<StudentReportAndJourneyDetails | null>(null);
  let [mediaFileName, setMediaFileName] = useState<string>("");
  let [exceptions, setExceptions] = useState<any>(null);
  let [currentRow, setCurrentRow] = useState<any>([]);
  let [profilePic, setProfilePic] = useState<any>(null);
  let [selectedQuizConfig, setSelectedQuizConfig] = useState<{
    [key: string]: boolean;
  }>({});
  const [schedules, setSchedules] = useState<any>(null);
  const [showRepModal, setShowRepModal] = useState<boolean>(false);
  const [studList, setStudList] = useState<any>(null);
  const [quizData, setQuizData] = useState<any[]>([]);
  const [isFetchingReport, setIsFetchingReport] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [noQuiz, setNoQuiz] = useState<boolean>(false);
  let [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const { urlParamsData, tokenData } = useAppStore((state) => state);
  const { setAssignmentConfiguration } = useAssignmentStore((state) => state);

  const getCourseQuizesById = () => {
    axios
      .get(
        `${getCanvasQuizDetails}/${tokenData.instituteId}/${urlParamsData.guid}/${urlParamsData.courseId}/${tokenData.lmsAccessToken}`
      )
      .then((res: any) => {
        if (res.data.length === 0) {
          setNoQuiz(true);
          setIsRefreshing(false);
          return;
        }
        let quizzes: any = [];
        res.data.forEach((item: any) => {
          if (item.id > 0) {
            item.key = item.id;
            // item.id = item.quizId;
            quizzes.push(item);
          }
        });
        setQuizData(quizzes);
        setIsRefreshing(false);
      })
      .catch((err) => {
        setNoQuiz(true);
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
      setAssignmentConfiguration(config.data);
    } else {
      message.error("Failed to get configurations");
      return;
    }
  };

  const updateJourneyDetails = async (result: string, comment: string) => {
    let payload = {
      idLtiVideoRef: row?.idLtiVideoRef,
      idUser: row?.idUser,
      idInstructor: urlParamsData.userId,
      idReference: row?.idReference,
      idExam: row?.idExam,
      courseId: row?.courseId,
      status: row?.status,
      examDate: row?.examDate,
      guid: row?.guid,
      examActualStartTime: row?.examActualStartTime,
      examActualEndTime: row?.examActualEndTime,
      authPictureFileName: "",
      authPictureFileIndex: "",
      passFail: result,
      comments: comment,
      violationCount: row?.violationCount,
    };
    try {
      let response = await axios.post(`${saveLtiVideoRef}`, { ...payload });
      if (response.status === 201) {
        message.success("Result updated successfully.");
        if (row) getStudentsByExamdIdGuidIdCourseId(row?.idExam);
      }
    } catch (e) {
      message.success("Failed to  updated result.");
    }
  };

  useEffect(() => {
    getCourseQuizesById();
  }, []);

  const getExceptions = async (fileId: string) => {
    let exceptions = await axios.get(`${getExceptionsUrl}${fileId}`, {
      headers: {
        Authorization: "Basic VEl4QXBaZTdNQ29zVzY6cFUxVVJ6akdrWThRVkM=",
      },
    });

    if (exceptions.data.data) {
      if (exceptions.data.data.length > 0) {
        exceptions.data.data.forEach((item: any) => {
          let timezoneOffset: string = Math.abs(
            moment().utcOffset()
          ).toString();
          let time: string = item[6].split(" ").join("T");
          item[6] = moment(time + `.${timezoneOffset}Z`).format(
            "MM-DD-YYYY hh:mm A"
          );
        });
      }

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

  const handleViewReport = (row: StudentReportAndJourneyDetails) => {
    if (selectedQuizConfig.lockdownBrowser) {
      message.error(
        "This Quiz/Test is configured as as Lock Down Browser. No report is available. Thank you."
      );
      return;
    }
    setRow(row);
    getUserProfilePicture(row.idUser);
    setMediaFileName(row.idReference);
    getExceptions(row.idReference);
    setShowRepModal(true);
  };

  const handleRefreshTable = () => {
    setRow(null);
    setIsRefreshing(true);
    getCourseQuizesById();
  };

  let studentColumns = [
    {
      dataIndex: "firstName",
      key: "firstName",
      title: `Name`,
    },
    // {
    //   dataIndex: "lastName",
    //   key: "lastName",
    //   title: `Last Name`,
    // },
    {
      dataIndex: "",
      key: "examDate",
      title: `Exam Date`,
      render: (row: StudentReportAndJourneyDetails) => {
        if ("examDate" in row) {
          let offsetTime: string = Math.abs(moment().utcOffset()).toString();
          let schedule = row.examDate + `.${offsetTime}Z`;
          return moment(schedule).format("MM-DD-YYYY h:mm A");
        }
        if (schedules === false) {
          return "Not scheduled";
        }
        return "Getting schedule...";
      },
    },
    {
      dataIndex: "violationCount",
      key: "violations",
      title: `Violation(s)`,
    },
    {
      dataIndex: "",
      key: "result",
      title: "Result",
      render: (row: StudentReportAndJourneyDetails) => {
        if (row.passFail === "N") {
          return "Not available";
        }
        if (row.passFail === "Y") {
          return (
            <div className="flex flex-row h-full items-center gap-4">
              <p className="font-semibold text-green-600 text-lg">Pass</p>
              <Tooltip placement="top" title={row.comments} className="pt-1">
                <InfoCircleFilled style={{ color: "rgb(96 165 250)" }} />
              </Tooltip>
            </div>
          );
        }
        if (row.passFail === "F") {
          return (
            <div className="flex flex-row h-full items-center gap-4">
              <p className="font-semibold text-red-500 text-lg">Fail</p>
              <Tooltip placement="top" title={row.comments} className="pt-1">
                <InfoCircleFilled style={{ color: "rgb(96 165 250)" }} />
              </Tooltip>
            </div>
          );
        }
      },
    },
    {
      dataIndex: "",
      key: "action",
      title: `Action`,
      render: (row: StudentReportAndJourneyDetails) => {
        return (
          <button onClick={() => handleViewReport(row)}>
            <p className="font-semibold">View Report</p>
          </button>
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
      dataIndex: "",
      key: "lock_at",
      title: `Available Until`,
      render: (row: any) => {
        if ("lock_at" in row) {
          let offsetTime: string = Math.abs(moment().utcOffset()).toString();
          let scheduleDate: string = row["lock_at"].replace("Z", "");
          return moment(scheduleDate + `.${offsetTime}Z`).format(
            "MM-DD-YYYY hh:mm a"
          );
        }
      },
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

  const getStudentsByExamdIdGuidIdCourseId = async (quizId: string) => {
    let payload = {
      idExam: quizId,
      courseId: urlParamsData.courseId,
      guid: urlParamsData.guid,
    };

    try {
      const response = await axios.post(`${getLtiCanvasVideoCombRef}`, {
        ...payload,
      });
      if (response.status === 200) {
        response.data.forEach(
          (item: StudentReportAndJourneyDetails, index: number) => {
            item.key = index.toString();
          }
        );
        setStudList(response.data);
      }
    } catch (e) {
      setStudList(false);
    }
  };

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
        {quizData.length > 0 ? (
          <Table
            columns={columns as Object[]}
            bordered={true}
            dataSource={quizData}
            pagination={{ position: ["bottomRight"] }}
            loading={isRefreshing}
            expandable={{
              expandedRowRender: (rowData: any) => {
                if (studList) {
                  return (
                    <>
                      <p className="text-center text-base font-bold underline">
                        Students violation messages and video report
                      </p>
                      <Table
                        bordered
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
                  if (studList === false) {
                    return (
                      <p className="text-center font-bold">
                        No reports available
                      </p>
                    );
                  }
                  return (
                    <p className="text-center font-bold">Getting students...</p>
                  );
                }
              },
              rowExpandable: (record) => true,
              expandedRowKeys: currentRow,
              onExpand(expanded, record) {
                if (expanded) {
                  setStudList(null);
                  getStudentsByExamdIdGuidIdCourseId(record.id);
                  setSelectedQuiz(record);
                  setCurrentRow([record.key]);
                } else {
                  setCurrentRow([]);
                }
              },
              onExpandedRowsChange: (row: any) => {
                if (row.length > 0) {
                  getQuizConfigs(row[row.length - 1]);
                }
              },
            }}
          />
        ) : noQuiz ? (
          <NoQuiz />
        ) : (
          <p className="text-center font-semibold">
            Fetching quizzes. Please wait...
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
            data={row}
            exceptions={exceptions}
            profilePic={profilePic}
            studentId={row.idUser}
            quizId={selectedQuiz.id}
            courseId={urlParamsData.courseId}
            guid={urlParamsData.guid}
            fileName={mediaFileName}
            updateReport={updateJourneyDetails}
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
