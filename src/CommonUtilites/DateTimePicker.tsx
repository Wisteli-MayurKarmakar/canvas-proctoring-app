import { Button, Calendar, message, Modal, TimePicker } from "antd";
import type { Moment } from "moment";
import moment from "moment";
import { useState } from "react";
import { useAssignmentStore } from "../store/StudentDashboardStore";
import { useAppStore } from "..//store/AppSotre";
import { useCommonStudentDashboardStore } from "../store/StudentDashboardStore";
import emailjs from "@emailjs/browser";
import axios from "axios";
import { saveScheduling } from "../apiConfigs";

type Props = {
  visible: boolean;
  close: () => void;
  assignment: any;
  assignmentConfig: any;
};

type SchedulingData = {
  scheduleId: string;
  instituteId: string;
  assignmentId: number;
  quizId: string;
  studentId: string;
  courseId: string;
  scheduleDate: string;
  status: number;
  guid: string;
};

const App: React.FC<Props> = (props): JSX.Element => {
  const { visible, close } = props;
  const [time, setTime] = useState<Moment | null>(null);
  const [date, setDate] = useState<any>(moment());
  const [isSavingSchedule, setIsSavingSchedule] = useState<boolean>(false);
  const tokenData = useAppStore((state) => state.tokenData);
  const urlParamsData = useAppStore((state) => state.urlParamsData);
  const enrollments = useCommonStudentDashboardStore(
    (state) => state.enrollments
  );
  const selectedAssignment = useAssignmentStore(
    (state) => state.selectedAssignment
  );
  const selectedAssignmentConfigurations = useAssignmentStore(
    (state) => state.selectedAssignmentConfigurations
  );
  const checkAssignmentSchedules = useAssignmentStore(
    (state) => state.checkAssignmentSchedules
  );
  const onTimeChange = (time: Moment | null) => {
    setTime(time);
  };
  const onDateChange = (value: Moment) => {
    setDate(value);
  };

  const sendMail = (date: Moment | null, time: Moment | null) => {
    let serviceId: string = "service_2su5kx4";
    let templateId: string = "template_iqbfsp2";
    let pubKey: string = "qaGgmKlvzp5138RXC";
    let messageBody: { [key: string]: string } = {
      subject: `Schedule for ${selectedAssignment?.name} - ${date?.format(
        "DD/MMM/YYYY"
      )}/ ${time?.format("hh:mm:ss A")}`,
      recipent_name: `${enrollments?.user.name}`,
      message: `Your quiz ${
        selectedAssignment?.name
      } has been scheduled. Below are the scheduling details.<br>
      Date - ${date?.format("DD/MMM/YYYY")}<br>
      Time - ${time?.format("hh:mm:ss A")}
      `,
      send_to: `${enrollments?.user.login_id}`,
      reply_to: "devshantanu@gmail.com",
    };
    emailjs
      .send(serviceId, templateId, messageBody, pubKey)
      .then((response: any) => {
        message.success("Quiz has been scheduled successfully");
        setIsSavingSchedule(false);
      })
      .catch((error: any) => {
        message.error("Failed to schedule the quiz");
      });
  };

  const saveSchedule = async (date: Moment, time: Moment) => {
    setIsSavingSchedule(true);

    let scheduleDate: Moment = date?.set("hours", time.hours());
    scheduleDate = date.set("minutes", time.minutes());
    scheduleDate = date.set("seconds", time.seconds());
    scheduleDate = date.set("milliseconds", time.milliseconds());

    let data: SchedulingData = {
      scheduleId: "",
      instituteId: tokenData.instituteId as any,
      assignmentId: selectedAssignment?.id as any,
      quizId: selectedAssignmentConfigurations?.quizId as any,
      studentId: urlParamsData.studentId as any,
      courseId: urlParamsData.courseId as any,
      scheduleDate: scheduleDate.toISOString(),
      status: 0,
      guid: urlParamsData.guid as any,
    };

    let response = await axios.post(
      `${saveScheduling}`,
      { ...data },
      {
        headers: {
          Authorization: `Bearer ${tokenData.lmsAccessToken}`,
        },
      }
    );

    if (response.status !== 200 && response.status !== 201) {
      message.error("Failed to save the schedule. Please try again");
      return;
    }

    checkAssignmentSchedules();
    sendMail(date, time);
    close();
  };

  const handleClose = () => {
    if (date && time) {
      saveSchedule(date, time);
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={() => close()}
      maskClosable={false}
      title="Select Date and Time"
      width={"50pc"}
      footer={[
        <Button
          type="primary"
          key="save"
          disabled={!date || !time}
          onClick={handleClose}
          loading={isSavingSchedule}
        >
          {!isSavingSchedule ? "Ok" : "Saving"}
        </Button>,
      ]}
    >
      <div className="flex flex-row w-full h-full justify-center gap-8">
        <div className="site-calendar-demo-card w-full">
          <p className="text-center text-lg font-semibold">Select Date</p>
          <Calendar
            fullscreen={false}
            key="calendar"
            onChange={onDateChange}
            // disabledDate={(current) => {
            //   let upperBound: number = 0;
            //   upperBound = moment(selectedAssignment?.lock_at).diff(
            //     moment(),
            //     "days"
            //   );
            //   return (
            //     moment().add(2, "days") >= current ||
            //     moment().add(upperBound + 1, "days") <= current
            //   );
            // }}
          />
        </div>
        <div className="flex flex-col items-center justify-between h-full w-full gap-8">
          <p className="text-center text-lg font-semibold">Select Time</p>
          <TimePicker
            value={time}
            onChange={onTimeChange}
            format={"hh:mm:ss A"}
          />
          <div className="flex flex-col items-center pt-8 gap-2">
            <p className="text-center font-semibold text-md">
              Date - Time Selected
            </p>
            <p className="text-semibold">
              {date && time
                ? date.format("DD/MM/YYYY") + " ~ " + time.format("hh:mm:ss A")
                : null}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default App;
