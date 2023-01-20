import { Modal, Timeline } from "antd";
import React, { useState } from "react";

import { getMedia } from "./apiConfigs";
import { useAppStore } from "./store/AppSotre";
import { useProcotorJourneyStore } from "./store/ProctorJourneyStore";

interface Props {
  show: boolean;
  close: () => void;
  title: string;
  data: Object | null;
  exceptions: any;
  profilePic: any;
  studentId: string;
  quizId: string;
  courseId: string;
  guid: string;
  fileName: string;
  updateReport: () => void;
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

  const handleReportResult = (result: string) => {
    setJourneyDetails(result, studentId, quizId);
  };

  const handleClose = () => {
    updateReport();
    close();
  };

  return (
    <Modal
      visible={show}
      title={title}
      onCancel={handleClose}
      width={"70pc"}
      footer={null}
    >
      <div
        className="flex flex-col overflow-scroll overflow-x-hidden gap-6"
        style={{ maxHeight: "44pc" }}
      >
        <p className="text-lg text-center font-bold underline">
          Authentication
        </p>
        <div className="flex flex-row pl-3 gap-56 mx-auto">
          <div className="flex flex-col">
            <div className="flex box-border h-56 justify-center items-center w-56 p-4 border-4 rounded">
              <p className="text-lg text-center font-semibold">Not available</p>
            </div>
            <p className="text-sm text-center font-semibold">
              Picture taken during exam
            </p>
          </div>
          <div className="flex flex-col">
            <div className="box-border h-56 w-56 p-4 border-4 rounded">
              {profilePic && (
                <img
                  src={profilePic}
                  alt="Not available"
                  className="h-full w-full rounded"
                />
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
            <p className="text-sm text-center font-semibold">Video recording</p>
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
        </div>
        <div className="flex flex-row h-full w-full items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => handleReportResult("fail")}
            className="inline-block px-6 py-2.5 bg-red-500 text-white font-medium text-xs leading-tight rounded shadow-md transition duration-150 ease-in-out"
          >
            Fail
          </button>
          <button
            type="button"
            onClick={() => handleReportResult("pass")}
            className="inline-block px-6 py-2.5 bg-green-500 text-white font-medium text-xs leading-tight rounded shadow-md transition duration-150 ease-in-out"
          >
            Pass
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default Report;
