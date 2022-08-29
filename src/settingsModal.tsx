import { Button, Modal } from "antd";
import React from "react";
import {
  CheckCircleFilled,
  ExclamationCircleFilled,
} from "@ant-design/icons";

interface Props {
  view: boolean;
  message: string;
  close: () => void;
  status: boolean;
}

const SettingsModal: React.FC<Props> = (props): JSX.Element => {
  const fontSize: string = "1.5rem";
  return (
    <Modal
      visible={props.view}
      maskClosable={false}
      destroyOnClose={true}
      onCancel={props.close}
      // title="Info"
      footer={[
        <Button key="close" onClick={props.close}>
          Close
        </Button>,
      ]}
    >
      <div className="flex flex-row h-full w-full items-center gap-4 justify-center">
        {props.status ? (
          <CheckCircleFilled style={{ fontSize: fontSize, color: "#6edb8f" }}/>
        ) : (
          <ExclamationCircleFilled style={{ fontSize: fontSize, color: "red" }}/>
        )}
        <p className="text-lg font-semibold pt-4 text-black">{props.message}</p>
      </div>
    </Modal>
  );
};

export default SettingsModal;
