import { Modal } from "antd";
import React from "react";

type Props = {
  visible: boolean;
  close: () => void;
  quizFinished: boolean;
  handleOk: () => void;
  assignment: any;
};

const ProctoringEndInfoModal: React.FC<Props> = (props): JSX.Element => {
  let { visible, close, quizFinished, handleOk } = props;

  return (
    <Modal
      visible={visible}
      closable={false}
      footer={null}
      title={null}
      width={"50pc"}
    >
      <div className="flex flex-col items-center h-full w-full gap-4">
        {!quizFinished ? (
          <>
            <p className="text-lg font-semibold">
              Proctoring is in progress. Closing this tab automatically submits
              your ongoing test/ quiz.
            </p>
            <p className="text-lg font-semibold">
              Are you sure you want to close the tab and submits the test/ quiz?
            </p>
          </>
        ) : (
          <>
            <p className="text-lg font-semibold">
              We noticed that {props.assignment.name} has been submitted. Proctoring
              has finished.
            </p>
            <p className="text-lg font-semibold">
              Press the close button to continue.
            </p>
          </>
        )}
        <div className="flex flex-row gap-4">
          {!quizFinished ? (
            <>
              <div className="flex space-x-2 justify-center">
                <button
                  type="button"
                  onClick={() => close()}
                  className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                >
                  No
                </button>
              </div>
              <div className="flex space-x-2 justify-center">
                <button
                  onClick={() => {
                    handleOk();
                  }}
                  type="button"
                  className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                >
                  Yes
                </button>
              </div>
            </>
          ) : (
            <div className="flex space-x-2 justify-center">
              <button
                onClick={() => {
                  handleOk();
                }}
                type="button"
                className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ProctoringEndInfoModal;
