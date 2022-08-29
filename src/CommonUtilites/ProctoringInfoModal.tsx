import { Button, Modal } from "antd";
import React from "react";

interface Props {
  visible: boolean;
  close: () => void;
}

const ProctoringInfoModal: React.FC<Props> = (props): JSX.Element => {
  return (
    <Modal
      visible={props.visible}
      width={"60pc"}
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
        <p className="text-xl font-bold">Proctoring has started.</p>
        <p className="text-lg font-semibold">
          Please don't close this tab or end proctoring untill you complete the
          quiz.
        </p>
        <p className="text-lg font-semibold">
          Please go to the quiz page and continue. Thanks
        </p>
      </div>
    </Modal>
  );
};

export default ProctoringInfoModal;
