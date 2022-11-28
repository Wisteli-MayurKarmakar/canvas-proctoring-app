import { CheckSquareOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import React, { useEffect } from "react";
import { AssignmentConfiguration } from "../../AppTypes";
import { useAssignmentStore } from "../../store/StudentDashboardStore";

interface Props {
  quizConfig: any;
  isChecked: (flag: boolean) => void;
}

interface configAbbrPrototype {
  [key: string]: string;
}

let configAbbrs: configAbbrPrototype = {
  recordWebcam: "Record Webcam",
  recordScreen: "Record Screen",

  recordAudio: "Record Audio",

  chat: "Chat",

  studentPicture: "Student Picture",

  studentIdDl: "Student ID or DL",

  roomScan: "Room Scan",

  otp: "One Time Password",

  calculatorAllowed: "Calculator",

  scratchPadAllowed: "Scratch Pad",

  liveHelp: "Live Help",

  whitelistPages: "Whitelist Pages",

  disableCopyPaste: "Disable Copy/ Paste",

  disablePrinting: "Disable Printing",

  lockdownBrowser: "Lock Down Browser",

  multiplePerson: "Multiple Person",

  cellPhone: "Cell Phone",

  noPersonInRoom: "No Person In Room",

  speaking: "Speaking",

  postExamReview: "Post Exam Review",

  examdLiveLaunch: "Examd Live Launch",

  instructorProctored: "Instructor Proctored",

  examdProctored: "Examd Proctored",
};

const QuizRules: React.FC<Props> = (props) => {
  const fontWeight: string = "semibold";
  const { selectedAssignmentConfigurations } = useAssignmentStore(
    (state) => state
  );
  // const getQuizConfigs = (): JSX.Element[] => {
  //   let items: JSX.Element[] = [];
  //   let cols: JSX.Element[] = [];

  //   let config = { ...props.quizConfig };
  //   delete config.idLtiCanvasConfig;
  //   delete config.idUser;
  //   delete config.toolConsumerInstanceGuid;
  //   delete config.courseId;
  //   delete config.quizId;
  //   delete config.assignmentId;
  //   delete config.whitelistPages;
  //   delete config.moduleId;
  //   delete config.timeLimit;

  //   Object.entries(config).forEach((item: any, index: number) => {
  //     let obj = configAbbrs[item[0]];
  //     cols.push(
  //       <Col span={4} key={index}>
  //         <Row gutter={24} className="mt-4 mb-4" key={index.toString() + "a"}>
  //           <Col
  //             span={18}
  //             key={index.toString() + "b"}
  //             className="!self-center"
  //           >
  //             <p className="font-bold">{obj && obj.fullName}</p>
  //           </Col>
  //           <Col span={4} key={index.toString() + "c"}>
  //             <p>
  //               {item[1] ? (
  //                 <CheckSquareOutlined
  //                   style={{ background: "lightgreen", fontSize: 20 }}
  //                 />
  //               ) : (
  //                 <CloseCircleOutlined style={{ color: "red", fontSize: 20 }} />
  //               )}
  //             </p>
  //           </Col>
  //         </Row>
  //       </Col>
  //     );
  //   });
  //   items.push(<Row gutter={24}>{cols}</Row>);

  //   return items;
  // };

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
          if you usually use a laptop with a monitor connected, disconnect your
          monitor and use only the laptop screen.
        </p>
        <p className={`font-${fontWeight}`}>
          {" "}
          7.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; You must verify your identity using a
          photo ID that has your name and photo on the same side. The name must
          match the full name you use in your ExamD account.
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
          a score of 0 for the exam. For most courses, you are no longer
          eligible for academic credit.
        </p>
      </div>
      <div className="flex flex-col w-full justify-center gap-4">
        <p className="text-xl font-bold mb-2">QUIZ CONFIGURATIONS</p>
        <div className="grid grid-cols-6 w-full justify-between gap-4">
          {selectedAssignmentConfigurations &&
            Object.keys(selectedAssignmentConfigurations).map((key: string, index: number) => {
              if (
                key !== "idLtiCanvasConfig" &&
                key !== "idUser" &&
                key !== "toolConsumerInstanceGuid" &&
                key !== "courseId" &&
                key !== "quizId" &&
                key !== "assignmentId" &&
                key !== "whitelistPages" &&
                key !== "moduleId" &&
                key !== "timeLimit"
              ) {
                return (
                  <div className="flex flex-row h-full w-full items-center justify-between gap-2 col-span-1 pr-5" key={index}>
                    <p className="text-bold font-lg text-[18px] font-semibold">
                      {configAbbrs[key as keyof configAbbrPrototype]}
                    </p>
                    <p>
                      {selectedAssignmentConfigurations[
                        key as keyof AssignmentConfiguration
                      ] ? (
                        <CheckSquareOutlined
                          style={{ background: "lightgreen", fontSize: 20 }}
                        />
                      ) : (
                        <CloseCircleOutlined
                          style={{ color: "red", fontSize: 20 }}
                        />
                      )}
                    </p>
                  </div>
                );
              }
            })}
        </div>
        <div className="flex flex-row gap-6 items-center pt-2 justify-center text-xl">
          <input type="checkbox" onClick={handleClick} />{" "}
          <b>Agree Quiz Rules </b>
        </div>
      </div>
    </div>
  );
};

export default QuizRules;
