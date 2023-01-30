import { Modal } from "antd";
import React from "react";

type Props = {
  visible: boolean;
  message: string;
  title: string;
  close: () => void;
};

const AlertModal: React.FC<Props> = ({
  visible,
  message,
  title,
  close,
}): JSX.Element => {
  return (
    <Modal
      visible={visible}
      maskClosable={false}
      title={title}
      footer={[
        <button
          type="button"
          onClick={close}
          className="inline-block px-6 py-2.5 bg-blue-600 
            text-white font-medium text-xs leading-tight uppercase 
            rounded shadow-md hover:bg-blue-700 hover:shadow-lg 
            focus:bg-blue-700 focus:shadow-lg focus:outline-none 
            focus:ring-0 active:bg-blue-800 active:shadow-lg transition
             duration-150 ease-in-out"
        >
          Ok
        </button>,
      ]}
      width={"30pc"}
    >
      <div className="flex items-center justify-center">
        <p className="text-lg font-semibold text-center">{message}</p>
      </div>
    </Modal>
  );
};

export default AlertModal;
