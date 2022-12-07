import moment from "moment";
import { Moment } from "moment";
import React from "react";
import { useTimer } from "react-timer-hook";
import { useAssignmentStore } from "../store/StudentDashboardStore";

const Timer: React.FC = (): JSX.Element => {
  const { selectedAssignmentSchedules } = useAssignmentStore((state) => state);
  const today: Moment = moment();
  const timezoneOffset: string = `.${Math.abs(
    moment().utcOffset()
  ).toString()}Z`;
  const scheduleDate: Moment = moment(
    selectedAssignmentSchedules?.scheduleDate + timezoneOffset
  );
  const diff: number = Math.abs(today.diff(scheduleDate, "seconds"));
  const expiryTimestamp: Date = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + diff);
  const { minutes, seconds } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      useAssignmentStore.setState({
        scheduleExpired: true,
        gotoQuiz: true,
      });
    },
  });

  return (
    <p className="text-center font-bold text-lg">
      {minutes}:{seconds} {minutes === 0 ? "seconds" : "minutes"}
    </p>
  );
};

export default Timer;
