import { Modal } from 'antd';
import React from 'react';

type Props = {
    visible: boolean;
    message: string;
    title: string;
    close: () => void;
  };

const AlertModal: React.FC<Props> = ({visible, message, title, close}): JSX.Element => {
    return (
        <Modal
          visible={visible}
          maskClosable={false}
          title={title}
          footer={null}
          width={"30pc"}
          closable
          onCancel={close}
        >
          <div className="flex items-center justify-center">
            <p className="text-lg font-semibold text-center">{message}</p>
          </div>
        </Modal>
      );
}

export default AlertModal;