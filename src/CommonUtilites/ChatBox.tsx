import { CommentOutlined, SendOutlined } from "@ant-design/icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { ChatMessage } from "../AppTypes";
import { useAppStore } from "../store/AppSotre";
import { useChatControllerStore } from "../store/ChatStore";

type Props = {
  quiz: any;
  student: any;
  classStyle: string;
  isStudent: boolean;
};

const ChatBox: React.FC<Props> = ({
  quiz,
  student,
  classStyle,
  isStudent,
}): JSX.Element => {
  const [message, setMessage] = useState<string>("");
  const { recievedMsg, sentMsg, createConnection, sendMessage } =
    useChatControllerStore((state) => state);
  const { urlParamsData } = useAppStore((state) => state);
  const roomName: string = `${quiz.assignmentId}_${student.user_id}`;
  const userName: string = `${urlParamsData?.studentId}`;
  let boxHeight: string = "[13em]";
  if (isStudent) {
    boxHeight = "5/6";
  }

  const handleSendMessage = () => {
    const msgToSend: ChatMessage = {
      isStudent: isStudent,
      message: message,
      timestamp: moment().toISOString(),
    };
    sendMessage(roomName, "Assessment_Chat", msgToSend);
    setMessage("");
  };

  useEffect(() => {
    createConnection(roomName, userName);
  }, []);

  return (
    <div className={classStyle}>
      {recievedMsg.length === 0 && sentMsg.length === 0 && (
        <div className="flex flex-row h-full items-center justify-center gap-4">
          <p className="text-center font-semibold">No messages...</p>
          <CommentOutlined className="text-2xl" style={{ color: "#41b5f0" }} />
        </div>
      )}
      <div
        className={`flex flex-col w-full justify-end gap-1 h-${boxHeight} overflow-y-auto mb-2`}
      >
        {recievedMsg.length > 0 && (
          <div className="flex flex-col w-full h-28 max-h-full  items-start justify-start gap-1 py-1">
            {recievedMsg.map((item: ChatMessage, index: number) => {
              return (
                <div
                  className="flex flex-col w-1/2 items-start justify-start border px-2 rounded-lg bg-blue-300 text-white"
                  key={index}
                >
                  <p className="font-semibold text-lg">{item.message}</p>
                  <p className="text-start">
                    {moment(item.timestamp).format("DD-MM-YYYY hh:mm a")}
                  </p>
                </div>
              );
            })}
          </div>
        )}
        {sentMsg.length > 0 && (
          <div className="flex flex-col w-full h-28 max-h-full items-end justify-start gap-1 py-1">
            {sentMsg.map((item: ChatMessage, index: number) => {
              return (
                <div
                  className="flex flex-col w-1/2 items-start justify-start border px-2 rounded-lg bg-gray-400 text-white"
                  key={index}
                >
                  <p className="font-semibold text-lg">{item.message}</p>
                  <p className="text-start">
                    {moment(item.timestamp).format("DD-MM-YYYY hh:mm a")}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="flex flex-row w-full self-end items-center gap-1">
        <input
          type="text"
          value={message}
          onChange={(e: any) => setMessage(e.target.value)}
          className="
            form-control
            block
            w-full
            px-3
            py-1.5
            text-base
            font-normal
            text-gray-700
            bg-white bg-clip-padding
            border border-solid border-gray-300
            rounded
            transition
            ease-in-out
            m-0
            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
        "
          id="chatInput"
          placeholder="Write message..."
        />
        <SendOutlined
          onClick={handleSendMessage}
          className="text-3xl ml-2 cursor-pointer"
          style={{ color: "#41b5f0" }}
        />
      </div>
    </div>
  );
};

export default ChatBox;
