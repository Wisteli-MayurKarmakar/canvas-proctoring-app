import { Button, Modal } from "antd";
import React, { useEffect } from "react";

interface Props {
  show: boolean;
  close: () => void;
}

const StudentHelpDocument: React.FC<Props> = (props): JSX.Element => {

  return (
    <Modal
      visible={props.show}
      onCancel={props.close}
      destroyOnClose={true}
      maskClosable={false}
      title="Help Document"
      keyboard={false}
      width={"60pc"}
      bodyStyle={{
        height: "40pc",
      }}
      footer={[
        <Button key="close" onClick={() => props.close()}>
          Close
        </Button>,
      ]}
    >
      <div
        className="flex h-full w-full items-center"
      >
        <iframe
          src="https://docs.google.com/document/d/e/2PACX-1vQSxnzMN2wPLO-5I4PvDD3QXgXnF1FXGQDkrBjgMROwU15YYbr_xfehCvSbomFIvaxfGmyza2trVmIn/pub?embedded=true"
          className="w-full h-full"
        ></iframe>
      </div>
    </Modal>
  );
};

export default StudentHelpDocument;
