import { Button, Calendar, Modal, TimePicker } from "antd";
import type { Moment } from "moment";
import moment from "moment";
import { useState } from "react";

type Props = {
  visible: boolean;
  close: () => void;
  handleDateTimeSelect: (value: any, time: any) => void;
  assignment: any;
};

const App: React.FC<Props> = (props): JSX.Element => {
  const { visible, close, handleDateTimeSelect } = props;
  const [time, setTime] = useState<Moment | null>(null);
  const [date, setDate] = useState<any>(moment());

  const onTimeChange = (time: Moment | null) => {
    setTime(time);
  };

  const onDateChange = (value: Moment) => {
    setDate(value);
  };

  const handleClose = () => {
    handleDateTimeSelect(date, time);
    close();
  };

  return (
    <Modal
      visible={visible}
      onCancel={() => handleClose()}
      maskClosable={false}
      title="Select Date and Time"
      width={"50pc"}
      footer={[
        <Button disabled={!date || !time} onClick={handleClose}>
          Ok
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
            disabledDate={(current) => {
              let upperBound: number = 0;
              upperBound = moment(props.assignment.due_at).diff(
                moment(),
                "day"
              );
              return (
                moment().add(0, "days") >= current ||
                moment().add(upperBound + 1, "days") <= current
              );
            }}
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
      {/* <Space direction="vertical" size={12}>
        <DatePicker showTime onChange={onChange} onOk={handleDateTimeSelect} />
        <RangePicker
          showTime={{ format: "HH:mm" }}
          format="YYYY-MM-DD HH:mm"
          onChange={onChange}
          onOk={handleDateTimeSelect}
        />
      </Space> */}
    </Modal>
  );
};

export default App;
