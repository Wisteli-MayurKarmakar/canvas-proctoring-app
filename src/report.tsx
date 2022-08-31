import { Modal, Timeline } from "antd";
import { useEffect } from "react";

interface Props {
  show: boolean;
  close: () => void;
  title: string;
  data: Object | null;
  fullVideoUrl: any;
  scrVideo: any;
  exceptions: any;
  profilePic: any;
}

const Report: React.FC<Props> = ({
  show,
  close,
  title,
  data,
  fullVideoUrl,
  scrVideo,
  exceptions,
  profilePic,
}): JSX.Element => {

  return (
    <Modal
      visible={show}
      title={title}
      onCancel={close}
      width={"70pc"}
      footer={null}
    >
      <div
        className="flex flex-col overflow-scroll overflow-x-hidden gap-6"
        style={{ maxHeight: "44pc" }}
      >
        <p className="text-lg text-center font-bold underline">Authentication</p>
        <div className="flex flex-row pl-3 gap-56 mx-auto">
          <div className="flex flex-col">
            <div className="flex box-border h-56 justify-center items-center w-56 p-4 border-4 rounded">
              <p className="text-lg text-center font-semibold">Not available</p>
            </div>
            <p className="text-sm text-center font-semibold">Picture taken during exam</p>
          </div>
          <div className="flex flex-col">
            <div className="box-border h-56 w-56 p-4 border-4 rounded">
              {profilePic && <img src={profilePic} alt="Not available" className="h-full w-full rounded"/>}
            </div>
            <p className="text-sm text-center font-semibold">Picture from profile</p>
          </div>
        </div>
        <p className="text-lg text-center font-bold underline">Violation screen, video, messages</p>
        <div className="flex flex-row pl-3 gap-56 mx-auto">
          <div className="flex flex-col">
            <div className="box-border h-64 w-80 p-4 border-4 rounded">
              <video controls className="object-fill rounded">
                <source src={fullVideoUrl}></source>
              </video>
            </div>
            <p className="text-sm text-center font-semibold">Video recording</p>
          </div>
          <div className="flex flex-col h-full items-center justify-center">
            <div className="box-border h-64 w-80 p-4 border-4 rounded">
              {scrVideo ? (
                <video controls className="object-fill rounded">
                  <source src={scrVideo}></source>
                </video>
              ) : (
                <div className="flex items-center justify-center">
                  <h4 className="text-center">Option not configured</h4>
                </div>
              )}
            </div>
            <p className="text-sm text-center font-semibold">Screen recording</p>
          </div>
        </div>
        <div className="flex flex-col">
            <p className="text-lg text-center font-bold underline">Violation messages</p>
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
      </div>
    </Modal>
  );
};

export default Report;
