import { message, Modal, Timeline } from "antd";
import React, { SyntheticEvent, useState } from "react";

import { getMedia } from "./apiConfigs";
import { StudentReportAndJourneyDetails } from "./AppTypes";
import { useAppStore } from "./store/AppSotre";
import { useProcotorJourneyStore } from "./store/ProctorJourneyStore";

interface Props {
  show: boolean;
  close: () => void;
  title: string;
  data: StudentReportAndJourneyDetails;
  exceptions: any;
  profilePic: any;
  studentId: string;
  quizId: string;
  courseId: string;
  guid: string;
  fileName: string;
  updateReport: (result: string, comment: string) => void;
  configuration: { [key: string]: boolean };
}

const Report: React.FC<Props> = ({
  show,
  close,
  title,
  data,
  exceptions,
  profilePic,
  studentId,
  quizId,
  guid,
  courseId,
  fileName,
  updateReport,
  configuration,
}): JSX.Element => {
  const tokenData = useAppStore((state) => state.tokenData);
  const { setJourneyDetails } = useProcotorJourneyStore((state) => state);
  const [comment, setComment] = useState<string>(data.comments);
  const [result, setResult] = useState<string>(
    data.passFail === "N" ? "" : data.passFail
  );

  const handleReportResult = () => {
    if (comment.length === 0) {
      message.error("Please write a comment.");
      return;
    }
    updateReport(result, comment);
    setJourneyDetails(result, studentId, quizId);
  };

  const handleClose = () => {
    // updateReport();
    close();
  };

  let reportMessage: JSX.Element | null = null;

  if (data.passFail === "F" || result === "F") {
    reportMessage = (
      <p className="text-center text-red-400">
        This report has been marked as Fail.
      </p>
    );
  }

  if (data.passFail === "Y" || result === "Y") {
    reportMessage = (
      <p className="text-center text-green-400">
        This report has been marked as Pass.
      </p>
    );
  }

  return (
    <Modal
      visible={show}
      title={title}
      onCancel={handleClose}
      width={"70pc"}
      footer={[
        <button
          type="button"
          key="submit"
          onClick={handleReportResult}
          className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          Save
        </button>,
      ]}
    >
      <div className="flex flex-col w-full justify-center h-full">
        {data.passFail !== "N" && reportMessage}
        <div
          className="flex flex-col overflow-scroll overflow-x-hidden gap-6"
          style={{ maxHeight: "44pc" }}
        >
          <p className="text-lg text-center font-bold underline">
            Authentication
          </p>
          <div className="flex flex-row pl-3 gap-56 mx-auto">
            <div className="flex flex-col h-full">
              <div className="flex box-border h-56 justify-center items-center w-56 p-4 border-4 rounded">
                <p className="text-lg text-center font-semibold">
                  Not available
                </p>
              </div>
              <p className="text-sm text-center h-full w-full font-semibold">
                Picture taken during exam
              </p>
            </div>
            <div className="flex flex-col">
              <div className="box-border h-56 w-56 p-4 border-4 rounded">
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Not available"
                    className="h-full w-full rounded"
                  />
                ) : (
                  <p className="flex items-center justify-center text-center font-semibold">
                    Please wait...
                  </p>
                )}
              </div>
              <p className="text-sm text-center font-semibold">
                Picture from profile
              </p>
            </div>
          </div>
          <p className="text-lg text-center font-bold underline">
            Violation screen, video, messages
          </p>
          <div className={`flex flex-row pl-3 gap-8 mx-auto`}>
            <div className="flex flex-col">
              <div className="box-border h-64 w-80 p-4 border-4 rounded">
                {configuration.recordWebcam ? (
                  <video controls className="object-fill rounded">
                    <source src={`${getMedia}/${fileName}_vdo/webm`}></source>
                  </video>
                ) : (
                  <div className="flex items-center justify-center">
                    <h4 className="text-center">Option not configured</h4>
                  </div>
                )}
              </div>
              <p className="text-sm text-center font-semibold">
                Video recording
              </p>
            </div>
            <div className="flex flex-col h-full items-center justify-center">
              <div className="box-border h-64 w-80 p-4 border-4 rounded">
                {configuration.recordScreen ? (
                  <video controls className="object-fill rounded">
                    <source src={`${getMedia}/${fileName}_scr/webm`}></source>
                  </video>
                ) : (
                  <div className="flex items-center justify-center">
                    <h4 className="text-center">Option not configured</h4>
                  </div>
                )}
              </div>
              <p className="text-sm text-center font-semibold">
                Screen recording
              </p>
            </div>
            <div className="flex flex-col">
              <div className="box-border h-64 w-80 p-4 border-4 rounded">
                {configuration.roomScan ? (
                  <video controls className="object-fill rounded">
                    <source
                      src={`${getMedia}/${tokenData.instituteId}_${courseId}_${quizId}_${studentId}_rmvdo/webm`}
                    ></source>
                  </video>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <h4 className="text-center">Option not configured</h4>
                  </div>
                )}
              </div>
              <p className="text-sm text-center font-semibold">Room Scan</p>
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-lg text-center font-bold underline">
              Violation messages
            </p>
            <div className="flex flex-row h-full items-center gap-2">
              <div className="box-border mx-auto h-full w-11/12 p-4 rounded text-center mt-8 border-4">
                {exceptions && exceptions.length > 0 ? (
                  <div>
                    <Timeline
                      style={{
                        maxHeight: "50%",
                        height: 180,
                        overflowY: "scroll",
                        position: "relative",
                        padding: 5,
                      }}
                      mode="right"
                    >
                      {exceptions.map((exception: any, idx: number) => (
                        <Timeline.Item key={idx} label={exception[6]}>
                          {exception[5]}
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  </div>
                ) : (
                  <p className="text-lg font-semibold">No exceptions...</p>
                )}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="
                  form-control
                  block
                  w-full
                  mr-4
                  px-3
                  py-1.5
                  text-base
                  font-normal
                  text-black
                  bg-white bg-clip-padding
                  border-4 border-solid
                  rounded
                  transition
                  ease-in-out
                  m-0 focus:bg-white focus:outline-none
                "
                id="commentBox"
                rows={7}
                placeholder="Your comment"
              ></textarea>
            </div>
          </div>
          <div className="flex flex-row h-full w-full items-center justify-center gap-4">
            <div className="flex items-center mb-4">
              <input
                id="default-checkbox"
                type="checkbox"
                value=""
                checked={result === "F"}
                onChange={(e) => setResult("F")}
                className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="default-checkbox"
                className="ml-2 text-lg font-medium text-red-500"
              >
                FAIL
              </label>
            </div>
            <div className="flex items-center mb-4">
              <input
                id="default-checkbox"
                type="checkbox"
                value=""
                checked={result === "Y"}
                onChange={(e) => setResult("Y")}
                className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="default-checkbox"
                className="ml-2 text-lg font-medium text-green-500"
              >
                PASS
              </label>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Report;
