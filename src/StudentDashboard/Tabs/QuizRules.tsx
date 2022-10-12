import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import React, { useEffect } from "react";

interface Props {
  quizConfig: any;
  isChecked: (flag: boolean) => void;
}

interface nestedObj {
  [key: string]: any;
}

interface configAbbrPrototype {
  [key: string]: nestedObj;
}

let configAbbrs: configAbbrPrototype = {
  recordWebcam: {
    fullName: "Record Webcam",
    icon: "",
    isChecked: false,
  },
  recordScreen: {
    fullName: "Record Screen",
    icon: "",
    isChecked: false,
  },
  recordAudio: {
    fullName: "Record Audio",
    icon: "",
    isChecked: false,
  },
  chat: {
    fullName: "Chat",
    icon: "",
    isChecked: false,
  },
  studentPicture: {
    fullName: "Student Picture",
    icon: "",
    isChecked: false,
  },
  studentIdDl: {
    fullName: "Student ID or DL",
    icon: "",
    isChecked: false,
  },
  roomScan: {
    fullName: "Room Scan",
    icon: "",
    isChecked: false,
  },
  otp: {
    fullName: "One Time Password",
    icon: "",
    isChecked: false,
  },
  calculatorAllowed: {
    fullName: "Calculator",
    icon: "",
    isChecked: false,
  },
  scratchPadAllowed: {
    fullName: "Scratch Pad",
    icon: "",
    isChecked: false,
  },
  liveHelp: {
    fullName: "Live Help",
    icon: "",
    isChecked: false,
  },
  whitelistPages: {
    fullName: "Whitelist Pages",
    icon: "",
    isChecked: false,
  },
  disableCopyPaste: {
    fullName: "Disable Copy/ Paste",
    icon: "",
    isChecked: false,
  },
  disablePrinting: {
    fullName: "Disable Printing",
    icon: "",
    isChecked: false,
  },
  lockdownBrowser: {
    fullName: "Lock Down Browser",
    icon: "",
    isChecked: false,
  },
  multiplePerson: {
    fullName: "Multiple Person",
    icon: "",
    isChecked: false,
  },
  cellPhone: {
    fullName: "Cell Phone",
    icon: "",
    isChecked: false,
  },
  noPersonInRoom: {
    fullName: "No Person In Room",
    icon: "",
    isChecked: false,
  },
  speaking: {
    fullName: "Speaking",
    icon: "",
    isChecked: false,
  },
  postExamReview: {
    fullName: "Post Exam Review",
    icon: "",
    isChecked: false,
  },
  examdLiveLaunch: {
    fullName: "Examd Live Launch",
    icon: "",
    isChecked: false,
  },
  instructorProctored: {
    fullName: "Instructor Proctored",
    icon: "",
    isChecked: false,
  },
  examdProctored: {
    fullName: "Examd Proctored",
    icon: "",
    isChecked: false,
  },
};

const QuizRules: React.FC<Props> = (props) => {
  const fontWeight: string = "semibold"
  const getQuizConfigs = (): JSX.Element[] => {
    let items: JSX.Element[] = [];
    let cols: JSX.Element[] = [];

    delete props.quizConfig.idLtiCanvasConfig;
    delete props.quizConfig.idUser;
    delete props.quizConfig.toolConsumerInstanceGuid;
    delete props.quizConfig.courseId;
    delete props.quizConfig.quizId;

    Object.entries(props.quizConfig).forEach((item: any, index: number) => {
      let obj = configAbbrs[item[0]];
      cols.push(
        <Col span={4} key={index}>
          <Row gutter={24} className="mt-4 mb-4" key={index.toString()+"a"}>
            <Col span={18} key={index.toString()+"b"}>
              <p className="font-bold">{obj && obj.fullName}</p>
            </Col>
            <Col span={4} key={index.toString()+"c"}>
              <p>{item[1] ? <CheckOutlined /> : <CloseOutlined />}</p>
            </Col>
          </Row>
        </Col>
      );
    });
    items.push(<Row gutter={24}>{cols}</Row>);

    return items;
  };

  const handleClick = (e: any) => {
    if (e.target.checked) {
      props.isChecked(true);
    } else {
      props.isChecked(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mb-2 text-xl">
          <strong>COMMON TEST RULES &amp; INSTRUCTIONS</strong>
        </p>
        <p className={`font-${fontWeight}`}>
          1.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; All exam rules must be observed
          throughout the entire test.
        </p>
        <p className={`font-${fontWeight}`}>
          {" "}
          2.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; You must take the exam in the same
          room that you scanned during the proctoring setup for the current
          exam..
        </p>
        <p className={`font-${fontWeight}`}>
          {" "}
          3.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; No other person is allowed to enter
          the room while you are taking the proctored exam.
        </p>
        <p className={`font-${fontWeight}`}>
          {" "}
          4.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; You must sit at a clean desk or
          table. Items like book, paper, pens, textbook shouldn't be on the
          table.
        </p>
        <p className={`font-${fontWeight}`}>
          {" "}
          5.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; You must close all other programs or
          windows on your testing computer before you begin the exam.
        </p>
        <p className={`font-${fontWeight}`}>
          {" "}
          6.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; The computer you are using to take
          the exam must not have more than one display or monitor. For example,
          if you usually use a laptop with a monitor connected,
          disconnect your monitor and use only the laptop screen.
        </p>
        <p className={`font-${fontWeight}`}>
          {" "}
          7.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; You must verify your identity using a
          photo ID that has your name and photo on the same side. The name must
          match the full name you use in your
          ExamD account.
        </p>
        <p className={`font-${fontWeight}`}>
          {" "}
          8.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; You must not use a phone for any
          reason.
        </p>
        <p className={`font-${fontWeight}`}>
          {" "}
          9.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; If you violate the online proctoring
          rules and receive an Unsatisfactory status, you automatically receive
          a score of 0 for the exam. For most courses,
          you are no longer eligible for academic credit.
        </p>
      </div>
      <div>
        <p className="text-xl font-bold mb-2">QUIZ CONFIGURATIONS</p>
        {getQuizConfigs()}
        <div className="flex flex-row gap-6 items-center pt-2 justify-center text-xl">
          <input type="checkbox" onClick={handleClick} />{" "}
          <b>Agree Quiz Rules </b>
        </div>
      </div>
    </div>
  );
};

export default QuizRules;
