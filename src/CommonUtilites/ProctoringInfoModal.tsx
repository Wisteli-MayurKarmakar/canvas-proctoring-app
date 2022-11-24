import { Button, Modal } from "antd";
import React from "react";
import ScreenShot from "../assets/images/screen-share.jpg";
import WebCam from "../assets/images/webcam-share.jpg";

interface Props {
  visible: boolean;
  close: () => void;
  quizConfig: {
    [key: string]: boolean;
  };
  onSeb: boolean;
}

const ProctoringInfoModal: React.FC<Props> = (props): JSX.Element => {
  let promptInfo: JSX.Element | null = null;

  let screenshareText: string =
    "You will be asked to allow screen share. A prompt similar to the above will pop-up, please allow screen share from prompt.";
  let webcamshareText: string =
    "You will be asked to allow share webcamera. A prompt similar to the above may pop-up, please allow sharing webcamera from prompt.";

  let webcamScreenText: string =
    "You will be asked to allow both screen and webcamera share. Prompts similar to the above may pop-up, please allow both.";

  if (props.quizConfig.recordScreen && !props.quizConfig.recordWebcam) {
    promptInfo = (
      <div className="flex flex-col h-3/5 w-3/5 items-center justify-center">
        <img
          src={ScreenShot}
          alt="Not found"
          className="drop-shadow-2xl rounded"
        ></img>
        <p className="text-medium font-semibold text-center">
          {screenshareText}
        </p>
      </div>
    );
  }

  if (!props.quizConfig.recordScreen && props.quizConfig.recordWebcam) {
    promptInfo = (
      <div className="flex flex-col h-3/5 w-3/5 items-center justify-center">
        <img
          src={WebCam}
          alt="Not found"
          className="drop-shadow-2xl rounded"
        ></img>
        <p className="text-medium font-semibold text-center">
          {webcamshareText}
        </p>
      </div>
    );
  }

  if (props.quizConfig.recordScreen && props.quizConfig.recordWebcam) {
    promptInfo = (
      <div className="flex flex-row gap-20 justify-center mt-2">
        <img
          src={ScreenShot}
          alt="Not found"
          className="h-2/5 w-2/5 drop-shadow-2xl rounded"
        ></img>
        <img
          src={WebCam}
          alt="Not found"
          className="h-2/5 w-2/5 drop-shadow-2xl rounded mt-12"
        ></img>
        {/* <div className="flex flex-col gap-2 items-center justify-center h-2/5 w-2/5">
        </div>
        <div className="flex flex-col gap-2 items-center justify-center h-2/5 w-2/5">
        </div> */}
      </div>
    );
  }

  return (
    <Modal
      visible={props.visible}
      width={"80pc"}
      title="Attention"
      destroyOnClose
      onCancel={props.close}
      maskClosable={false}
      footer={[
        <Button key="close" onClick={() => props.close()}>
          Close
        </Button>,
      ]}
    >
      <div className="flex flex-col h-full w-full items-center justify-center">
        <p className="text-xl font-bold uppercase">Proctoring has started</p>
        <p className="text-xl font-bold text-center text-blue-500">
          This is the proctoring tab, please do not close this tab or click "End
          Proctoring" button up until you submit the quiz.
        </p>
        <p className="text-xl font-bold text-center text-blue-500">
          Now, to take the quiz please go to the prior tab and click "Start
          Quiz".
        </p>
        {!props.onSeb && promptInfo}
        {!props.onSeb &&
          props.quizConfig.recordScreen &&
          props.quizConfig.recordWebcam && (
            <p className="text-medium font-semibold text-center mt-4">
              {webcamScreenText}
            </p>
          )}
        {/* <div className="flex flex-row gap-20 justify-center mt-2">
          <div className="flex flex-col gap-2 items-center justify-center h-2/5 w-2/5">
            <img
              src={ScreenShot}
              alt="Not found"
              className="drop-shadow-2xl rounded"
            ></img>
            <p className="text-medium font-semibold text-center">
              You will be asked to allow screen share. A prompt similar to the
              above will pop-up, please allow screen recording from prompt.
            </p>
          </div>
          <img
            src={ScreenShot}
            alt="Not found"
            className="h-2/5 w-2/5 border-2 border-gray-500 rounded"
          ></img>
        </div> */}
      </div>
    </Modal>
  );
};

export default ProctoringInfoModal;
