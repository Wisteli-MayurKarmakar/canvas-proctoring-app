import React from "react";
import { CheckSquareOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useQuizStore } from "../store/QuizStore";
import { ConfigurationWithStatus, FullNameMap } from "../AppTypes";

const CustomizationSummary: React.FC = (): JSX.Element => {
  const {
    customizableQuizConfig,
    configAvailable,
  } = useQuizStore((state) => state);

  const fullNameMap: FullNameMap = {
    recOptions: "Recording Options",
    recordWebcam: "Record Webcam",
    recordScreen: "Record Screen",
    recordAudio: "Record Audio",
    chat: "Chat",
    verificationOptions: "Verification Options",
    studentPicture: "Student Picture",
    studentIdDl: "Student ID or Dl",
    roomScan: "Room Scan",
    otp: "One Time Password",
    studentRes: "Student Resources",
    calculatorAllowed: "Calculator Allowed",
    scratchPadAllowed: "Scratch Pad Allowed",
    liveHelp: "Live Help",
    whitelistPages: "Whitelist Pages",
    lockdownOptions: "Lockdown Options",
    disableCopyPaste: "Disable Copy Paste",
    disablePrinting: "Disable Printing",
    lockdownBrowser: "Lockdown Browser",
    violationOptions: "Violation Options",
    multiplePerson: "Multiple Person",
    cellPhone: "Cell Phone",
    noPersonInRoom: "No Person In Room",
    speaking: "Speaking",
    proctorOptions: "Proctor Options by Examd",
    postExamReview: "Post Exam Review",
    examdLiveLaunch: "Live Launch",
    examdProctored: "Proctoring",
    instructorProctored: "Manual Verification"
  };

  const configuration: ConfigurationWithStatus[] = [
    {
      fullName: "Recording Options",
      recordWebcam: customizableQuizConfig?.recordWebcam as boolean,
      recordScreen: customizableQuizConfig?.recordScreen as boolean,
      recordAudio: customizableQuizConfig?.recordAudio as boolean,
      chat: customizableQuizConfig?.chat as boolean,
    },
    {
      fullName: "Verification Options",
      studentPicture: customizableQuizConfig.studentPicture as boolean,
      studentIdDl: customizableQuizConfig.studentIdDl as boolean,
      roomScan: customizableQuizConfig.roomScan as boolean,
      otp: customizableQuizConfig.otp as boolean,
      instructorProctored: customizableQuizConfig.instructorProctored as boolean,
    },
    {
      fullName: "Student Resources",
      calculatorAllowed: customizableQuizConfig.calculatorAllowed as boolean,
      scratchPadAllowed: customizableQuizConfig.scratchPadAllowed as boolean,
      liveHelp: customizableQuizConfig.liveHelp as boolean,
      whitelistPages: customizableQuizConfig.whitelistPages as boolean,
    },
    {
      fullName: "Lockdown Options",
      disableCopyPaste: customizableQuizConfig.disableCopyPaste as boolean,
      disablePrinting: customizableQuizConfig.disablePrinting as boolean,
      lockdownBrowser: customizableQuizConfig.lockdownBrowser as boolean,
    },
    {
      fullName: "Violation Options",
      multiplePerson: customizableQuizConfig.multiplePerson as boolean,
      cellPhone: customizableQuizConfig.cellPhone as boolean,
      noPersonInRoom: customizableQuizConfig.noPersonInRoom as boolean,
      speaking: customizableQuizConfig.speaking as boolean,
    },
    {
      fullName: "Proctoring Options by Examd",
      postExamReview: customizableQuizConfig.postExamReview as boolean,
      examdLiveLaunch: customizableQuizConfig.examdLiveLaunch as boolean,
      examdProctored: customizableQuizConfig.examdProctored as boolean,
    },
  ];

  const configSummary: JSX.Element = (
    <>
      <div className="grid grid-cols-2 xl:grid-cols-3 w-full m-auto items-center gap-8 xl:gap-4">
        {configuration.map((item: ConfigurationWithStatus, index: number) => {
          return (
            <div
              className="flex flex-col w-full xl:w-3/5 h-full items-start justify-start gap-4 col-span-1"
              key={index}
            >
              <p className="font-bold text-start w-full capitalize">
                {item.fullName}
              </p>
              <div className="flex flex-col h-full w-full items-start justify-center gap-2">
                {Object.keys(item).map((key: string, idx: number) => {
                  if (key !== "fullName") {
                    if (item[key]) {
                      return (
                        <div
                          className="flex flex-row h-full w-full items-start justify-between gap-8"
                          key={idx}
                        >
                          <p className="text-base font-semibold">
                            {fullNameMap[key]}
                          </p>
                          <CheckSquareOutlined
                            className="self-center"
                            style={{ background: "lightgreen", fontSize: 20 }}
                          />
                        </div>
                      );
                    }
                    return (
                      <div className="flex flex-row h-full w-full items-start justify-between gap-8" key={idx}>
                        <p className="text-base font-semibold">
                          {fullNameMap[key]}
                        </p>
                        <CloseCircleOutlined
                          style={{ color: "red", fontSize: 20 }}
                        />
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          );
        })}
      </div>
      {!configAvailable && (
        <div className="flex space-x-2 justify-start self-start mb-1">
          <button
            // onClick={props.handleSave}
            type="button"
            className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          >
            Submit
          </button>
        </div>
      )}
    </>
  );

  // if (props.quickConfig || props.quizConfig) {
  //   let configurations: any = null;
  //   let res: any = [];
  //   if (props.quickConfig !== "") {
  //     configurations = defaultProcSettings.filter(
  //       (item: any) => item.name === props.quickConfig && item.settings
  //     );
  //     configuration.forEach((item: ConfigurationWithStatus) => {
  //       let configObj: any = { name: key, config: [] };
  //       Object.keys(settingOptions[key]).forEach((item: any, index: number) => {
  //         configObj.config.push(
  //           <div
  //             className="flex flex-row h-full items-center gap-8"
  //             key={index}
  //           >
  // <p className="font-semibold text-start w-1/2 capitalize">
  //   {settingOptions[key][item].fullName}
  // </p>
  //             {configurations[0].settings[item] ? (
  // <CheckSquareOutlined
  //   style={{ background: "lightgreen", fontSize: 20 }}
  // />
  //             ) : (
  //               <CloseCircleOutlined style={{ color: "red", fontSize: 20 }} />
  //             )}
  //           </div>
  //         );
  //       });
  //       res.push(configObj);
  //     });
  //   } else {
  //     configKeys.forEach((key: string) => {
  //       let configObj: any = { name: key, config: [] };
  //       Object.keys(settingOptions[key]).forEach((item: any, index: number) => {
  //         configObj.config.push(
  //           <div
  //             className="flex flex-row h-full items-center gap-8"
  //             key={index}
  //           >
  //             <p className="font-semibold text-start w-1/2 capitalize">
  //               {settingOptions[key][item].fullName}
  //             </p>
  //             {props.quizConfig[item] ? (
  //               <CheckSquareOutlined
  //                 style={{ background: "lightgreen", fontSize: 20 }}
  //               />
  //             ) : (
  //               <CloseCircleOutlined style={{ color: "red", fontSize: 20 }} />
  //             )}
  //           </div>
  //         );
  //       });
  //       res.push(configObj);
  //     });
  //   }

  //   customizations = [...res];
  // }

  // if (customizations.length > 0) {
  //   return (
  // <div className="flex flex-col w-full justify-center gap-8">
  //   <div className="grid grid-cols-2 w-full content-center items-center lg:grid-cols-3 gap-4">
  //     {customizations.map((item: any, index: number) => {
  //       return (
  //         <div
  //           className="flex flex-col w-full justify-start gap-1"
  //           key={index}
  //         >
  //           <p className="text-lg text-left font-bold mb-2 underline">
  //             {item.name}
  //           </p>
  //           {item.config.map((item: any) => item)}
  //         </div>
  //       );
  //     })}
  //   </div>
  //   {props.quickConfig !== "" && (
  //     <div className="flex space-x-2 justify-start mb-1">
  //       <button
  //       onClick={props.handleSave}
  //         type="button"
  //         className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
  //       >
  //         Submit
  //       </button>
  //     </div>
  //   )}
  // </div>
  //   );
  // }

  return configSummary;
};

export default CustomizationSummary;
