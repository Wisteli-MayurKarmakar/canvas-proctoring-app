import Modal from "antd/lib/modal/Modal";
import React from "react";

type Props = {
  visible: boolean;
  close: () => void;
};

const HelpAndSupport: React.FC<Props> = ({ visible, close }): JSX.Element => {
  const screenHeight: string = Math.round(
    window.screen.height / 1.5
  ).toString();

  const doc: string = `<iframe
  src="https://docs.google.com/document/d/e/2PACX-1vSRDpMmPm30i6AOwc8sNSugSqsV5QmFpYwGECHtePokflQ_7uGBjojIrY06YeDYtiG14jxAXVdtblV7/pub"
  className="w-full h-full"
  height=${screenHeight}
  title="InstructorHelp"
  width="100%"
></iframe>`;

  return (
    <Modal
      visible={visible}
      width={"50pc"}
      onCancel={close}
      footer={null}
      title="Instrutor's Help Guide"
    >
      <div className="flex flex-col h-full w-ull justify-center gap-4">
        <p className="text-xl text-center font-semibold underline">
          Help document
        </p>
        <div
          className="flex h-full w-full items-center"
          dangerouslySetInnerHTML={{
            __html: doc,
          }}
        ></div>
      </div>
    </Modal>
  );
};

export default HelpAndSupport;
