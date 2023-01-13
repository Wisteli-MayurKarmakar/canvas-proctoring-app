import { Modal } from "antd";
import React from "react";

type Props = {
  visible: boolean;
  close: () => void;
  title: string;
  message: string;
};

const ConfirmModal: React.FC<Props> = ({
  visible,
  close,
  title,
  message,
}): JSX.Element => {
  return (
    <Modal
      visible={visible}
      closable={false}
      width={"60pc"}
      maskClosable={false}
      title={title}
      footer={[
        <button
          type="button"
          key="close"
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          onClick={close}
          className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          Close
        </button>,
      ]}
    >
      <p className="text-center text-xl font-semibold">{message}</p>
    </Modal>
  );
};

export default ConfirmModal;
