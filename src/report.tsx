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
}

const Report: React.FC<Props> = ({
  show,
  close,
  title,
  data,
  fullVideoUrl,
  scrVideo,
  exceptions,
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
        className="flex flex-col overflow-scroll overflow-x-hidden"
        style={{ maxHeight: "44pc" }}
      >
        <p className="text-lg">Authentication</p>
        <div className="flex flex-row pl-3 gap-56 mx-auto">
          <div className="flex flex-col">
            <div className="box-border h-72 w-72 p-4 border-4"></div>
            <p className="text-sm text-center">Picture taken during exam</p>
          </div>
          <div className="flex flex-col">
            <div className="box-border h-72 w-72 p-4 border-4"></div>
            <p className="text-sm text-center">Picture from profile</p>
          </div>
        </div>
        <p className="text-lg pt-8">Violation screen, video, messages</p>
        <div className="flex flex-row pl-3 gap-56 mx-auto">
          <div className="flex flex-col">
            <div className="box-border h-72 w-72 p-4 border-4">
              <video controls style={{ height: "100%" }}>
                <source src={fullVideoUrl}></source>
              </video>
            </div>
            <p className="text-sm text-center">Video recording</p>
          </div>
          <div className="flex flex-col">
            <div className="box-border h-72 w-72 p-4 border-4">
              {scrVideo ? (
                <video controls style={{ height: "100%" }}>
                  <source src={scrVideo}></source>
                </video>
              ) : (
                <div className="flex items-center justify-center">
                  <h4 className="text-center">Option not configured</h4>
                </div>
              )}
            </div>
            <p className="text-sm text-center">Screen recording</p>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="box-border mx-auto h-full w-11/12 p-4 text-center mt-8 border-4">
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
              <p>No exceptions</p>
            )}
          </div>
          <p className="text-sm text-center">Violation messages</p>
        </div>
      </div>
    </Modal>
  );
};

export default Report;
