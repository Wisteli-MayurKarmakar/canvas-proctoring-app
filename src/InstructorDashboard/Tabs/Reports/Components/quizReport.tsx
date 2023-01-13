import "antd/dist/antd.min.css";
import { message, Table } from "antd";
import React, { FunctionComponent, useEffect, useState } from "react";
import axios from "axios";
import Report from "../../../../report";
import InfoModal from "../../../../infoModal";
import {
  getLtiCanvasConfigByGuidCourseIdQuizId,
  viewCanvasProfile,
  getExceptions as getExceptionsUrl,
  getLtiCVideoRef,
  fetchAccountsByCourseAndEnrollemntType,
  getCanvasAssignmentDetails,
  getLtiScheduleByQuizId,
  getLtiProctorJourney,
} from "../../../../apiConfigs";
import { useAppStore } from "../../../../store/AppSotre";
import moment from "moment";
import { useProcotorJourneyStore } from "../../../../store/ProctorJourneyStore";
import { StudentQuizReport } from "../../../../AppTypes";
import {
  useAssignmentStore,
  useCommonStudentDashboardStore,
} from "../../../../store/StudentDashboardStore";

const QuizReports: FunctionComponent = (): JSX.Element => {
  let [quizConfigs, setQuizConfigs] = useState<any>([]);
  let [row, setRow] = useState<any>(null);
  let [mediaFileName, setMediaFileName] = useState<string>("");
  let [exceptions, setExceptions] = useState<any>(null);
  let [currentRow, setCurrentRow] = useState<any>([]);
  let [profilePic, setProfilePic] = useState<any>(null);
  const [studentResultsByQuiz, setStudentResultsByQuiz] =
    useState<StudentQuizReport | null>(null);
  let [selectedQuizConfig, setSelectedQuizConfig] = useState<{
    [key: string]: boolean;
  }>({});
  const [schedules, setSchedules] = useState<any>(null);
  const [showRepModal, setShowRepModal] = useState<boolean>(false);
  const [studList, setStudList] = useState<any>(null);
  const [quizData, setQuizData] = useState<any[]>([]);
  const [isFetchingReport, setIsFetchingReport] = useState<boolean>(false);
  let [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const { urlParamsData, tokenData } = useAppStore((state) => state);
  const { getJourneyDetails } = useProcotorJourneyStore((state) => state);
  const { setAssignmentConfiguration } = useAssignmentStore((state) => state);

  const getCourseQuizesById = () => {
    axios
      .get(
        `${getCanvasAssignmentDetails}/${tokenData.instituteId}/${urlParamsData.guid}/${urlParamsData.courseId}/${tokenData.lmsAccessToken}/`
      )
      .then((res: any) => {
        let quizzes: any = [];
        res.data.forEach((item: any) => {
          if (item.id > 0) {
            item.key = item.quizId;
            item.id = item.quizId;
            quizzes.push(item);
          }
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
      setAssignmentConfiguration(config.data);
    } else {
      message.error("Failed to get configurations");
      return;
    }
  };

  const getAllProctorJourneyDetails = async () => {
    let payload = {
      guid: urlParamsData.guid,
      studentId: 0,
      proctorId: useCommonStudentDashboardStore.getState().enrollments?.user.id,
      quizId: 0,
      courseId: urlParamsData.courseId,
    };
    let response = await axios.post(`${getLtiProctorJourney}`, { ...payload });
    if (response.status === 200) {
      let reports: StudentQuizReport = {};
      let data = [...response.data];
      data.forEach((item: any) => {
        reports[item.quizId.toString()] = {
          [item.studentId.toString()]: {
            reportReviwed: item.reportReviwed,
            resultPass: item.reportPass,
          },
        };
      });
      setStudentResultsByQuiz(reports);
    }
  };

  useEffect(() => {
    getAllProctorJourneyDetails();
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

  const handleViewReport = (row: any) => {
    if (selectedQuizConfig.lockdownBrowser) {
      message.error(
        "This Quiz/Test is configured as as Lock Down Browser. No report is available. Thank you."
      );
      return;
    }
    getJourneyDetails(row.id);
    setRow(row);
    getUserProfilePicture(row.id);
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
      dataIndex: "",
      key: "scheduleDate",
      title: `Schedule Date`,
      render: (row: any) => {
        if (schedules) {
          let offsetTime: string = Math.abs(moment().utcOffset()).toString();
          let schedule = schedules.scheduleDate + `.${offsetTime}Z`;
          return moment(schedule).format("MM-DD-YYYY h:mm A");
        }
        if (schedules === false) {
          return "Not scheduled";
        }
        return "Getting schedule...";
      },
    },
    {
      dataIndex: "",
      key: "result",
      title: "Result",
      render: (row: any) => {
        if (!studentResultsByQuiz) {
          return "Not available";
        }
        if (selectedQuiz.quizId in studentResultsByQuiz) {
          if (row.id.toString() in studentResultsByQuiz[selectedQuiz.quizId]) {
            return studentResultsByQuiz[selectedQuiz.quizId][row.id.toString()]
              .resultPass ? (
              <p className="font-semibold text-green-600 text-lg">Pass</p>
            ) : (
              <p className="font-semibold text-red-500 text-lg">Fail</p>
            );
          }
          return "Not available";
        }
        return "Not available";
      },
    },
    {
      dataIndex: "",
      key: "action",
      title: `Action`,
      render: (row: any) => {
        if (!studentResultsByQuiz) {
          return (
            <button onClick={() => handleViewReport(row)}>
              <p className="font-semibold">View Report</p>
            </button>
          );
        }
        if (studentResultsByQuiz) {
          if (selectedQuiz.quizId.toString() in studentResultsByQuiz) {
            if (
              row.id.toString() in
              studentResultsByQuiz[selectedQuiz.quizId.toString()]
            ) {
              return studentResultsByQuiz[selectedQuiz.quizId.toString()][
                row.id.toString()
              ].reportReviwed ? (
                <button onClick={() => handleViewReport(row)}>
                  <p className="text-green-500 font-semibold">View Report</p>
                </button>
              ) : (
                <button onClick={() => handleViewReport(row)}>
                  <p className="font-semibold">View Report</p>
                </button>
              );
            }
          }
        }
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
      dataIndex: "quizName",
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

  const getAssignmentSchedule = (assignmentId: number, quizId: string) => {
    let data = {
      instituteId: tokenData.instituteId,
      assignmentId: assignmentId,
      quizId: quizId,
      courseId: parseInt(urlParamsData.courseId as any),
      status: 0,
      guid: urlParamsData.guid,
    };
    axios
      .post(`${getLtiScheduleByQuizId}`, { ...data })
      .then((response: any) => {
        setSchedules(response.data);
      })
      .catch((error: any) => {
        setSchedules(false);
        console.log(error);
      });
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
              rowExpandable: (record) => true,
              expandedRowKeys: currentRow,
              onExpand(expanded, record) {
                if (expanded) {
                  setSchedules(null);
                  getAssignmentSchedule(record.assignment_id, record.quizId);
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
        ) : (
          <p className="font-bold text-center mt-5">
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
            data={null}
            exceptions={exceptions}
            profilePic={profilePic}
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
