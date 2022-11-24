import { Modal } from "antd";
import React from "react";

type Props = {
  visible: boolean;
  message: JSX.Element;
  title: string;
};

const WaitingModal: React.FC<Props> = ({
  visible,
  message,
  title,
}): JSX.Element => {
  return (
    <Modal
      visible={visible}
      maskClosable={false}
      title={title}
      footer={null}
      width={"40pc"}
      closable={false}
    >
      {message}
    </Modal>
  );
};

export default WaitingModal;
