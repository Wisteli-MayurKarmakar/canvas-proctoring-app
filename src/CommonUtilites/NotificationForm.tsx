import React, { useState } from "react";
import { useNotificationStore } from "../store/NotificationsStore";
import { RichTextEditor } from "@mantine/rte";
import { sanitize } from "dompurify";

type Props = {
  needEditor: boolean;
};

const NotificationForm: React.FC<Props> = ({ needEditor }): JSX.Element => {
  const {
    updateNotificationData,
    allStatus,
    selectedStatus,
    message,
    defualtEmailTemplate,
    loadingTopic,
  } = useNotificationStore((state) => state);

  const [editorValue, setEditorValue] = useState(message);

  const handleEditorValue = (value: string) => {
    setEditorValue(value);
    updateNotificationData("message", value);
  };

  return (
    <div className="flex flex-col w-full justify-center border border-gray-400 p-2 rounded mt-4 shadow-md gap-4 mb-2">
      <div className="flex flex-row h-full items-start gap-8">
        <div className="flex flex-col w-full md:w-3/5 justify-start">
          <label className="block text-gray-700 text-base font-semibold mb-1">
            Status
          </label>
          <select
            value={selectedStatus.value as string}
            onChange={(e) =>
              updateNotificationData("selectedStatus", e.target.value)
            }
            className="form-select form-select-sm
            appearance-none
            block
            px-2
            py-1
            w-full
            md:w-3/5
            xl:w-2/5
            text-sm
            font-normal
            text-gray-700
            bg-white bg-clip-padding bg-no-repeat
            border border-solid border-gray-300
            rounded
            transition
            ease-in-out
            m-0
            focus:text-black focus:bg-white focus:border-blue-400 focus:outline-none"
            aria-label=".form-select-sm example"
            id="topicSelect"
          >
            {allStatus.map((item: string, index: number) => {
              return (
                <option key={index} value={item}>
                  {item}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className="flex flex-col justify-start gap-2">
        <label className="block text-gray-700 text-base font-semibold mb-1">
          Message
        </label>
        {needEditor ? (
          <RichTextEditor
            value={editorValue}
            onChange={handleEditorValue}
            id="rte"
          />
        ) : loadingTopic ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-center text-lg">Loading email template...</p>
          </div>
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: sanitize(defualtEmailTemplate) }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default NotificationForm;
