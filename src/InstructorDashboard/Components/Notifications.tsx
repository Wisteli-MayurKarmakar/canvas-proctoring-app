import React, { useEffect, useState } from "react";
import { useNotificationStore } from "../../store/NotificationsStore";
import NotificationForm from "../../CommonUtilites/NotificationForm";
import { message as msg, Tabs, Tooltip } from "antd";
import { NotificationType } from "../../AppTypes";
import { InfoCircleFilled } from "@ant-design/icons";
import axios from "axios";
import { ltiTestEmail } from "../../apiConfigs";
import { useCommonStudentDashboardStore } from "../../store/StudentDashboardStore";
import WaitingModal from "../../CommonUtilites/WaitingModal";

const Notifications: React.FC = (): JSX.Element => {
  const [sendingEmail, setSendingEmail] = useState<boolean>(false);

  const [notificationType, setNotificationType] =
    useState<string>("DEFAULT_MSG_TEMP");
  const {
    allTopics,
    selectedTopic,
    updateNotificationData,
    selectedSource,
    allSources,
    defualtEmailTemplate,
    message,
    reset,
    getNotificationData,
    saveNotification,
    savingNotification,
  } = useNotificationStore((state) => state);

  const { TabPane } = Tabs;
  const savingNotificationMsg: JSX.Element = (
    <p className="text-center text-lg">
      Saving Notification Data. Please wait...
    </p>
  );

  const sendingTestMailMsg: JSX.Element = (
    <p className="text-center text-lg">Sending test email. Please wait...</p>
  );

  const tooltipMessage: JSX.Element = (
    <p>
      In the message section you can use replacement variable. Please check the
      default message to check what replacement variable is applicable for a
      specific topic.<br></br>Replacement variables:<br></br>$
      {`{{student-name}}`}
      <br></br>${`{{quiz-name}}`}
      <br></br>${`{{assignment-name}}`}
      <br></br>${`{{instructor-name}}`}
      <br></br>${`{{quiz-schedule-date}}`}
      <br></br>${`{{quiz-completed-date}}`}
      <br></br>${`{{quiz-available-until-date}}`}
      <br></br>${`{{quiz-due-date}}`}
      <br></br>${`{{report-review-date}}`}
      <br></br>${`{{report-result}}`}
      <br></br>${`{{report-violations}}`}
      <br></br>${`{{current-date}}`}
    </p>
  );

  const onChange = (key: string) => {
    setNotificationType(key);
    reset();
  };

  const sendTestEmail = async () => {
    setSendingEmail(true);
    const { enrollments } = useCommonStudentDashboardStore.getState();
    let payload = {
      emailTopicType: selectedTopic.value,
      emailTemplate:
        notificationType === "DEFAULT_MSG_TEMP"
          ? defualtEmailTemplate
          : message,
      mandoryAttributes: "",
      status: "",
    };

    let response = await axios.post(
      `${ltiTestEmail}/${enrollments?.user.login_id}`,
      { ...payload },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status === 200) {
      msg.success("Test email sent successfully");
      setSendingEmail(false);
      return;
    }
    if (response.status === 404) {
      console.log("here")
      msg.error("Faile to send test email");
      setSendingEmail(false);
    }
  };

  useEffect(() => {
    getNotificationData();
  }, []);

  return (
    <div className="flex flex-col w-screen lg:w-5/6 xl:w-3/5 justify-center gap-1 mt-8 px-2">
      <div className="flex flex-row w-full items-center justify-between">
        <div className="flex flex-row h-full w-full xl:w-11/12 items-center gap-2">
          <label className="block text-gray-700 text-base font-semibold mb-1 ml-2">
            Topic
          </label>
          <select
            value={selectedTopic.value as string}
            onChange={(e) =>
              updateNotificationData("selectedTopic", e.target.value)
            }
            className="form-select form-select-sm
            appearance-none
            block
            px-2
            py-1
            w-full
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
            {allTopics &&
              Object.keys(allTopics).map((item: string, index: number) => {
                return (
                  <option key={index} value={item}>
                    {item}
                  </option>
                );
              })}
          </select>
          <Tooltip placement="top" title={tooltipMessage} className="pt-1">
            <InfoCircleFilled
              style={{ color: "rgb(96 165 250)" }}
              className="text-xl ml-4 mb-1"
            />
          </Tooltip>
        </div>
        <div className="flex items-center justify-end w-full">
          <button
            type="button"
            onClick={sendTestEmail}
            className="inline-block px-6 py-2 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          >
            Test Email
          </button>
        </div>
      </div>
      <div className="box-border h-full w-full p-4 border rounded bg-gray-300 mt-4 mb-4">
        {allTopics && selectedTopic.value !== "Select a topic" && (
          <p className="text-center font-semibold">
            <span className="font-bold text-lg">Subject</span>: {allTopics[selectedTopic.value as keyof NotificationType]}
          </p>
        )}
      </div>
      <Tabs
        defaultActiveKey="1"
        onChange={onChange}
        centered={true}
        type="card"
      >
        <TabPane
          tab={<p className="font-semibold">Default Message Template</p>}
          key="DEFAULT_MSG_TEMP"
        >
          <NotificationForm needEditor={false} />
        </TabPane>
        <TabPane
          tab={<p className="font-semibold">Overwritten Message</p>}
          key="OVERWRITTEN_MSG"
        >
          <label className="block text-gray-700 text-base font-semibold mb-1">
            Source
          </label>
          <select
            value={selectedSource.value as string}
            onChange={(e) =>
              updateNotificationData("selectedSource", e.target.value)
            }
            className="form-select form-select-sm
            appearance-none
            block
            px-2
            py-1
            w-full
            md:w-3/5
            lg:w-1/5
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
            {allSources.map((item: string, index: number) => {
              return (
                <option key={index} value={item}>
                  {item}
                </option>
              );
            })}
          </select>
          <NotificationForm needEditor={true} />
        </TabPane>
      </Tabs>
      {notificationType !== "DEFAULT_MSG_TEMP" && (
        <div className="flex flex-row h-full w-full items-center justify-end gap-4 mt-2 mb-2">
          <button
            type="button"
            id="cancel"
            className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          >
            Cancel
          </button>
          <button
            type="button"
            id="submit"
            onClick={saveNotification}
            className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          >
            Submit
          </button>
        </div>
      )}
      {savingNotification && (
        <WaitingModal
          visible={savingNotification}
          title="Saving data"
          message={savingNotificationMsg}
        />
      )}
      {sendingEmail && (
        <WaitingModal
          visible={sendingEmail}
          title="Sending Email"
          message={sendingTestMailMsg}
        />
      )}
    </div>
  );
};

export default Notifications;
