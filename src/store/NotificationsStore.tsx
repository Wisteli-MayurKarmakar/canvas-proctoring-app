import axios from "axios";
import create from "zustand";
import { devtools } from "zustand/middleware";
import {
  createLtiEmailTopic,
  ltiDefaultEmailTemplate,
  ltiEmailNotificationTypes,
} from "../apiConfigs";
import {
  NotificationStore,
  NotificationFormFieldType,
  NotificationType,
} from "../AppTypes";
import { useAppStore } from "./AppSotre";
import { useCommonStudentDashboardStore } from "./StudentDashboardStore";
import { message as msg } from "antd";

const getNotificationTopics = async (): Promise<NotificationType | null> => {
  let response = await axios.get(`${ltiEmailNotificationTypes}`);

  if (response.status === 200) {
    let data: NotificationType = {
      "Select a topic": "",
      ...(response.data as NotificationType),
    };
    return data;
  }

  return null;
};

const getEmailMessage = async (topic: string): Promise<string> => {
  let response = await axios.get(`${ltiDefaultEmailTemplate}/${topic}`);
  if (response.status === 200) {
    return response.data;
  }
  return "";
};

const saveNotificationData = async () => {
  const { selectedSource, selectedTopic, message } =
    useNotificationStore.getState();
  const { urlParamsData } = useAppStore.getState();
  const { enrollments } = useCommonStudentDashboardStore.getState();

  let url: string = `${createLtiEmailTopic}/${urlParamsData.guid}`;
  if (selectedSource.value === "Instructor") {
    url = `${createLtiEmailTopic}/${urlParamsData.guid}/${enrollments?.user.id}`;
  }

  let payload = {
    emailTopicType: selectedTopic.value,
    emailTemplate: message,
    mandoryAttributes: null,
    status: 1,
  };
  const response = await axios.post(
    url,
    { ...payload },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  if (response.status === 200) {
    msg.success("Save successfully");
    return;
  }
  msg.error("Failed to save");
  
  useNotificationStore.setState({
    savingNotification: false,
  });
};

export const useNotificationStore = create<NotificationStore>()(
  devtools(
    (set, get) => ({
      allPreferences: [
        "1 hour notification",
        "24 hours notification",
        "On demand notification",
        "Not required",
      ],
      allSources: ["Select a source", "Institution", "Instructor"],
      allStatus: ["Active", "Inactive"],
      allTopics: null,
      testMessage: false,
      loadingTopic: false,
      savingNotification: false,
      message: "",
      defualtEmailTemplate: "",
      selectedPreferences: {
        value: "Select a prefrence",
        hasError: false,
      },
      selectedSource: {
        value: "Select a source",
        hasError: false,
      },
      selectedStatus: {
        value: "Active",
        hasError: false,
      },
      selectedTopic: {
        value: "Select a topic",
        hasError: false,
      },
      updateNotificationData: async (key: string, value: string | boolean) => {
        if (key === "selectedSource") {
          let source: NotificationFormFieldType = { ...get().selectedSource };
          source.value = value;
          set({
            selectedSource: source,
          });
        }
        if (key === "selectedTopic") {
          let topic: NotificationFormFieldType = { ...get().selectedTopic };
          topic.value = value;
          set({
            selectedTopic: topic,
            loadingTopic: true,
          });
          let message: string = await getEmailMessage(topic.value as string);
          if (message !== "") {
            set({
              defualtEmailTemplate: message,
              loadingTopic: false,
            });
          }
        }
        if (key === "selectedPreferences") {
          let prefrences: NotificationFormFieldType = {
            ...get().selectedPreferences,
          };
          prefrences.value = value;
          set({
            selectedPreferences: prefrences,
          });
        }
        if (key === "selectedStatus") {
          let status: NotificationFormFieldType = { ...get().selectedStatus };
          status.value = value;
          set({
            selectedStatus: status,
          });
        }
        if (key === "testMessage") {
          let testMessage: boolean = get().testMessage;
          testMessage = value as boolean;
          set({
            testMessage: testMessage,
          });
        }
        if (key === "message") {
          set({
            message: value as string,
          });
        }
      },
      getNotificationData: async () => {
        const notificationTopics: NotificationType | null =
          await getNotificationTopics();

        if (notificationTopics) {
          set({
            allTopics: notificationTopics,
          });
        }
      },
      reset: () => {
        let {
          testMessage,
          selectedPreferences,
          selectedSource,
          selectedStatus,
        } = get();
        testMessage = false;
        selectedPreferences.value = "Select a prefrence";
        selectedPreferences.hasError = false;
        selectedSource.value = "Select a source";
        selectedSource.hasError = false;
        selectedStatus.value = "Select a status";
        selectedStatus.hasError = false;
        set({
          testMessage: testMessage,
          selectedPreferences: selectedPreferences,
          selectedSource: selectedSource,
          selectedStatus: selectedStatus,
        });
      },
      saveNotification: async () => {
        set({
          savingNotification: true,
        });
        await saveNotificationData();
      },
    }),
    { name: "Notification Store" }
  )
);
