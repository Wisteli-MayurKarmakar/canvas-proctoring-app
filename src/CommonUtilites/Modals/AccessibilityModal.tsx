import { Button, DatePicker, Modal, Input, message, Select } from "antd";
import React, { useEffect, useState } from "react";
import AccessibleIcon from "@mui/icons-material/Accessible";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import PsychologyIcon from "@mui/icons-material/Psychology";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import BlindIcon from "@mui/icons-material/Blind";
import SignLanguageIcon from "@mui/icons-material/SignLanguage";
import TtyIcon from "@mui/icons-material/Tty";
import moment, { Moment } from "moment";
import { useAccessiblityStore } from "../../store/globalStore";
import { useCommonStudentDashboardStore } from "../../store/StudentDashboardStore";
import { useAppStore } from "../../store/AppSotre";
import axios from "axios";
import { getLtiAccessibility, saveLtiAccessibility } from "../../apiConfigs";

type Props = {
  visible: boolean;
  onClose: () => void;
  studentId: string;
};

const AssibilityModal: React.FC<Props> = (props): JSX.Element => {
  const { TextArea } = Input;
  const [standardOptionError, setStandardOptionError] =
    useState<boolean>(false);
  const [customOptionError, setCustomOptionError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    schoolCustom,
    schoolStandard,
    humanAssistant,
    doc1,
    doc2,
    standardOptions,
    customOptions,
    standardOptionSelected,
    customOptionSelected,
    approveStandard,
    approveCustom,
    messageStudent,
    messageInstructor,
    minExtra,
    setStudentMessage,
    setCustomOptionSelected,
    setDoc1,
    setDoc2,
    setStandardOptionSelecton,
    setSchoolCustom,
    setSchoolStandard,
    setInstructorMessage,
    setHumanAssistantNeeded,
    setExtraTimeValue,
    setApproveStandard,
    setApproveCustom,
    setAccessibilityConfigurations,
    setStartDate,
    setEndDate,
  } = useAccessiblityStore((state) => state);
  const {urlParamsData, tokenData} = useAppStore((state) => state)

  const loggedInUserEnrollmentType = useCommonStudentDashboardStore(
    (state) => state.loggedInUserEnrollmentType
  );

  const defaultMinExtra: string = minExtra.toString() + " mins";

  const facerecognitionIssue = useAccessiblityStore(
    (state) => state.customOptions.facerecognitionIssue
  );
  const needAbreak = useAccessiblityStore(
    (state) => state.customOptions.needAbreak
  );
  const shorttermDisability = useAccessiblityStore(
    (state) => state.customOptions.shorttermDisability
  );
  const startDate: Moment = moment(
    useAccessiblityStore((state) => state.startDate)
  );
  const endDate: Moment = moment(
    useAccessiblityStore((state) => state.endDate)
  );

  const deafIcon: JSX.Element = (
    <svg
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      className="w-10"
    >
      <path d="M192 319.1C185.8 313.7 177.6 310.6 169.4 310.6S153 313.7 146.8 319.1l-137.4 137.4C3.124 463.6 0 471.8 0 480c0 18.3 14.96 31.1 31.1 31.1c8.188 0 16.38-3.124 22.62-9.371l137.4-137.4c6.247-6.247 9.371-14.44 9.371-22.62S198.3 326.2 192 319.1zM200 240c0-22.06 17.94-40 40-40s40 17.94 40 40c0 13.25 10.75 24 24 24s24-10.75 24-24c0-48.53-39.47-88-88-88S152 191.5 152 240c0 13.25 10.75 24 24 24S200 253.3 200 240zM511.1 31.1c0-8.188-3.124-16.38-9.371-22.62s-14.44-9.372-22.63-9.372s-16.38 3.124-22.62 9.372L416 50.75c-6.248 6.248-9.372 14.44-9.372 22.63c0 8.188 3.123 16.38 9.37 22.62c6.247 6.248 14.44 9.372 22.63 9.372s16.38-3.124 22.63-9.372l41.38-41.38C508.9 48.37 511.1 40.18 511.1 31.1zM415.1 241.6c0-57.78-42.91-177.6-175.1-177.6c-153.6 0-175.2 150.8-175.2 160.4c0 17.32 14.99 31.58 32.75 31.58c16.61 0 29.25-13.07 31.24-29.55c6.711-55.39 54.02-98.45 111.2-98.45c80.45 0 111.2 75.56 111.2 119.6c0 57.94-38.22 98.14-46.37 106.3L288 370.7v13.25c0 31.4-22.71 57.58-52.58 62.98C220.4 449.7 208 463.3 208 478.6c0 17.95 14.72 32.09 32.03 32.09c4.805 0 100.5-14.34 111.2-112.7C412.6 335.8 415.1 263.4 415.1 241.6z" />
    </svg>
  );
  const ccIcon: JSX.Element = (
    <svg
      className="bi bi-badge-cc"
      style={{ width: 50 }}
      fill="currentColor"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3.708 7.755c0-1.111.488-1.753 1.319-1.753.681 0 1.138.47 1.186 1.107H7.36V7c-.052-1.186-1.024-2-2.342-2C3.414 5 2.5 6.05 2.5 7.751v.747c0 1.7.905 2.73 2.518 2.73 1.314 0 2.285-.792 2.342-1.939v-.114H6.213c-.048.615-.496 1.05-1.186 1.05-.84 0-1.319-.62-1.319-1.727v-.743zm6.14 0c0-1.111.488-1.753 1.318-1.753.682 0 1.139.47 1.187 1.107H13.5V7c-.053-1.186-1.024-2-2.342-2C9.554 5 8.64 6.05 8.64 7.751v.747c0 1.7.905 2.73 2.518 2.73 1.314 0 2.285-.792 2.342-1.939v-.114h-1.147c-.048.615-.497 1.05-1.187 1.05-.839 0-1.318-.62-1.318-1.727v-.743z" />
      <path d="M14 3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12zM2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2z" />
    </svg>
  );
  const standardAccessiblityOptions: any = {
    mobility: <PhoneInTalkIcon style={{ fontSize: 50 }} />,
    cognitiveChallange: <PsychologyIcon style={{ fontSize: 50 }} />,
    brailleNeeded: <DragIndicatorIcon style={{ fontSize: 50 }} />,
    lowVision: <BlindIcon style={{ fontSize: 50 }} />,
    hearingImpaired: deafIcon,
    hhndSignal: <AccessibleIcon style={{ fontSize: 50 }} />,
    ccNeeded: ccIcon,
    auditoryChallange: <SignLanguageIcon style={{ fontSize: 50 }} />,
    tty: <TtyIcon style={{ fontSize: 50 }} />,
  };

  const extraTimeOptions: { value: string; lable: string }[] = [
    { value: "10 mins", lable: "10" },
    { value: "20 mins", lable: "20" },
    { value: "30 mins", lable: "30" },
    { value: "45 mins", lable: "45" },
    { value: "60 mins", lable: "60" },
  ];

  const customAccessibilityOptions: any = {
    facerecognitionIssue: "Face recognition issue",
    extratimeRequired: "Extra time required",
    needAbreak: "Need a break during quiz",
    shorttermDisability: "Short term disability",
    idByPass: "Id by pass",
    roomScanIssue: "Room scan issue",
    dualMonitorNeeded: "Dual monitor needed",
  };

  const handleStandardOptionClick = (option: string) => {
    setStandardOptionSelecton(option);
  };

  const handlCustomOptionClick = (option: string) => {
    setCustomOptionSelected(option);
  };

  const handleUploadDoc1 = (e: any) => {
    let file: any = e.target.files[0];
    if (file) {
      setDoc1(file);
    }
  };

  const handleUploadDoc2 = (e: any) => {
    if (schoolCustom) {
      return;
    }
    let file: any = e.target.files[0];
    if (file) {
      setDoc2(file);
    }
  };

  useEffect(() => {
    if (!standardOptionError && !customOptionError && loading) {
      setLoading(true);
    }
  }, [standardOptionError, customOptionError, loading]);

  const saveAccessibilityData = async () => {
    let stdOptions: any = {};
    let options: any = { ...standardOptions };
    Object.keys(options).forEach((key: any) => {
      stdOptions[key] = options[key];
    });

    const data: any = {
      accessibilityId: "",
      instituteId: tokenData.instituteId,
      studentId: parseInt(props.studentId as any),
      ...stdOptions,
      facerecognitionIssue: facerecognitionIssue,
      shorttermDisability: shorttermDisability,
      documentstandardRef: "string",
      schoolStandard: schoolStandard,
      needAbreak: needAbreak,
      minExtra: minExtra,
      documentCustomref: "string",
      schoolCustom: schoolCustom,
      startDate: startDate,
      endDate: endDate,
      humanAssistant: humanAssistant,
      studentMessage: messageStudent,
      instructorMessage: messageInstructor,
      approveStandard: approveStandard,
      approveCustom: approveCustom,
    };
    setLoading(true);
    let response = await axios.post(saveLtiAccessibility, {
      ...data,
    });

    if (response.status === 200) {
      message.success("Accessibility settings save successfully");
      setLoading(false);
      props.onClose();
    } else {
      message.success("Failed to save accessibility settings");
    }
  };

  const handleSubmit = () => {
    if (standardOptionSelected) {
      if (!schoolStandard && !doc1) {
        setStandardOptionError(true);
      } else {
        setStandardOptionError(false);
      }
    }

    if (customOptionSelected) {
      if (!schoolCustom && !doc2) {
        setCustomOptionError(true);
      } else {
        setCustomOptionError(false);
      }
    }

    saveAccessibilityData();
  };

  const handleStudentMessage = (value: string) => {
    setStudentMessage(value);
  };

  const handleExtraTimeSelect = (value: string) => {
    setExtraTimeValue(parseInt(value));
  };

  const getAccessibilityConfig = async () => {
    let payload = {
      instituteId: tokenData.instituteId,
      studentId: urlParamsData.studentId,
    };
    let response = await axios.post(`${getLtiAccessibility}`, payload);
    if (response.status === 200) {
      let timeZoneOffset: string =
        "." + Math.abs(moment().utcOffset()).toString() + "Z";
      let accessibilityConfig = {
        ...response.data,
        endDate: response.data.endDate + timeZoneOffset,
        startDate: response.data.startDate + timeZoneOffset,
      };
      setAccessibilityConfigurations(accessibilityConfig);
    }
  };

  const handleHasDocFor = (docFor: string) => {
    if (docFor === "standard") {
      setSchoolStandard(!schoolStandard);
    } else {
      setSchoolCustom(!schoolCustom);
    }
  };

  useEffect(() => {
    if (loggedInUserEnrollmentType === "StudentEnrollment") {
      getAccessibilityConfig();
    }
  }, []);

  return (
    <Modal
      title="Accessiblity Options"
      visible={props.visible}
      onCancel={props.onClose}
      maskClosable={false}
      width={"90pc"}
      footer={[
        <Button
          key="cancel"
          type="primary"
          onClick={props.onClose}
          disabled={loading && true}
          className="!bg-blue-600 !rounded"
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={loading}
          className="!bg-blue-600 !rounded"
        >
          {loading ? "Saving" : "Submit"}
        </Button>,
      ]}
    >
      <div className="flex flex-col w-full justify-center gap-1">
        {standardOptionError && (
          <div
            className="flex p-2 mb-2 text-sm font-semibold w-full justify-center text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
            role="alert"
          >
            <svg
              aria-hidden="true"
              className="flex-shrink-0 inline w-5 h-5 mr-3"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Info</span>
            <div className="text-center">
              <span className="font-bold">Attention!</span> You must upload
              supporting document for standard accessiblity feature or please
              check the "School has the document for standard accessiblity"
              option.
            </div>
          </div>
        )}
        {customOptionError && (
          <div
            className="flex p-2 mb-2 text-sm font-semibold w-full justify-center text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
            role="alert"
          >
            <svg
              aria-hidden="true"
              className="flex-shrink-0 inline w-5 h-5 mr-3"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Info</span>
            <div className="text-center">
              <span className="font-bold">Attention!</span> You must upload
              supporting document for custom accessiblity feature or please
              check the "School has the document for custom accessibility"
              option.
            </div>
          </div>
        )}
        <div className="flex flex-col xl:flex-row w-full xl:h-full items-start gap-4">
          <div className="flex flex-col h-full w-full justify-center gap-4">
            <label className="flex text-gray-700 text-2xl font-semibold w-full items-start justify-start">
              Standard
            </label>
            <div className="flex w-full justify-start mt-2">
              <div className="form-check">
                <input
                  className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                  type="checkbox"
                  checked={schoolStandard}
                  id="flexCheckDefault"
                  onChange={() => handleHasDocFor("standard")}
                />
                <label
                  className="form-check-label inline-block text-black font-semibold"
                  htmlFor="flexCheckDefault"
                >
                  School has the document for standard accessibility
                </label>
              </div>
            </div>
            <div className="grid grid-cols-3 md:flex md:flex-row md:flex-wrap md:h-2/3 md:w-full gap-1">
              {Object.keys(standardOptions).map(
                (item: string, index: number) => {
                  if (index === 4) {
                    return (
                      <div
                        key={index}
                        onClick={() => handleStandardOptionClick(item)}
                        className={`flex box-border border-2 shadow-lg rounded w-36 h-28 items-cente hover:bg-blue-400 hover:fill-white justify-center self-center cursor-pointer ${
                          standardOptionSelected &&
                          standardOptionSelected === item
                            ? "bg-blue-400 fill-white"
                            : "bg-white text-black"
                        }`}
                      >
                        <div className="flex items-center justify-center h-full">
                          {standardAccessiblityOptions[item]}
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={index}
                      onClick={() => handleStandardOptionClick(item)}
                      className={`flex box-border border-2 shadow-lg rounded w-36 h-28 items-cente hover:bg-blue-400 hover:text-white justify-center self-center cursor-pointer ${
                        standardOptionSelected &&
                        standardOptionSelected === item
                          ? "bg-blue-400 text-white"
                          : "bg-white text-black"
                      }`}
                    >
                      <div className="flex items-center justify-center h-full">
                        {standardAccessiblityOptions[item]}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
            <div className="flex flex-col h-full items-center gap-2">
              <label
                className="flex text-gray-700 text-lg font-semibold w-full items-start justify-start"
                htmlFor="doc1"
              >
                Upload Document 1:
              </label>
              <div className="flex flex-row w-full gap-4 justify-start">
                <input
                  disabled={schoolStandard}
                  className={`flex w-72 text-sm text-black bg-gray-50 rounded border ${
                    schoolStandard && "cursor-not-allowed"
                  } border-gray-300 cursor-pointer focus:outline-none dark:placeholder-gray-400`}
                  id="file_input"
                  type="file"
                  onChange={handleUploadDoc1}
                />
                <div className="flex space-x-2 justify-center">
                  <button
                    type="button"
                    disabled={schoolStandard}
                    className={`inline-block px-6 py-1.5 ${
                      schoolStandard ? "bg-gray-300" : "bg-blue-600"
                    } text-white font-medium text-xs
                     leading-tight uppercase rounded shadow-md ${
                       !schoolStandard &&
                       `hover:bg-blue-700 hover:shadow-lg
                      focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800
                       active:shadow-lg transition duration-150 ease-in-out`
                     }`}
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full justify-center gap-4">
            <label className="flex text-gray-700 text-2xl font-semibold w-full items-start justify-start">
              Custom
            </label>
            <div className="flex w-full justify-start mt-2">
              <div className="form-check">
                <input
                  className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                  type="checkbox"
                  checked={schoolCustom}
                  id="flexCheckDefault"
                  onChange={() => handleHasDocFor("custom")}
                />
                <label
                  className="form-check-label inline-block text-black font-semibold"
                  htmlFor="flexCheckDefault"
                >
                  School has the document for custom accessiblity
                </label>
              </div>
            </div>
            <div className="flex flex-row w-full flex-wrap justify-start gap-2">
              {Object.keys(customOptions).map((item: string, index: number) => {
                if (item !== "extratimeRequired") {
                  return (
                    <div
                      key={index}
                      onClick={() => handlCustomOptionClick(item)}
                      className={`flex box-border border-2 shadow-lg rounded w-36 h-28 items-center justify-center  hover:bg-blue-400 hover:text-white cursor-pointer p-2 ${
                        customOptionSelected && customOptionSelected === item
                          ? "bg-blue-400 text-white"
                          : "bg-white text-black"
                      }`}
                    >
                      <p className="font-semibold break-words text-center">
                        {customAccessibilityOptions[item]}
                      </p>
                    </div>
                  );
                }
              })}
            </div>
            <div className="flex flex-row h-full items-center gap-4">
              <div className="flex flex-col w-full justify-center gap-1">
                <label className="flex text-gray-700 text-lg font-semibold items-start justify-start">
                  Start Date:
                </label>

                <DatePicker
                  defaultValue={moment()}
                  value={startDate}
                  onChange={(date: Moment | null, dateString: string) =>
                    date && setStartDate(date)
                  }
                  format="MM/DD/YYYY"
                />
              </div>
              <div className="flex flex-col w-full justify-center gap-1">
                <label className="flex text-gray-700 text-lg font-semibold items-start justify-start">
                  End Date:
                </label>
                <DatePicker
                  defaultValue={moment()}
                  value={endDate}
                  format="MM/DD/YYYY"
                  onChange={(date: Moment | null, dateString: string) =>
                    date && setEndDate(date)
                  }
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex flex-row h-full items-start gap-4">
              <div className="flex flex-row h-full items-center gap-8">
                <div className="flex flex-col justify-center gap-1">
                  <label className="flex text-gray-700 text-lg font-semibold items-start justify-start">
                    Extra time (in mins):
                  </label>
                  <Select
                    onChange={handleExtraTimeSelect}
                    options={[...extraTimeOptions]}
                    value={defaultMinExtra}
                  />
                </div>
                <div className="flex flex-row h-full items-center md:mt-8">
                  <input
                    className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                    type="checkbox"
                    checked={humanAssistant}
                    id="flexCheckDefault"
                    onChange={() => setHumanAssistantNeeded()}
                  />
                  <label
                    className="form-check-label inline-block text-black font-semibold"
                    htmlFor="flexCheckDefault"
                  >
                    Human assistant needed
                  </label>
                </div>
              </div>
            </div>
            <div className="flex flex-col h-full xl:mt-8 gap-2">
              <label
                className="flex text-gray-700 text-lg font-semibold w-full items-start justify-start"
                htmlFor="doc2"
              >
                Upload Document 2:
              </label>
              <div className="flex flex-row w-full gap-4 justify-start">
                <input
                  disabled={schoolCustom}
                  className={`flex w-72 text-sm text-black bg-gray-50 rounded border ${
                    schoolCustom && "cursor-not-allowed"
                  } border-gray-300 cursor-pointer focus:outline-none dark:placeholder-gray-400`}
                  id="file_input"
                  type="file"
                  onChange={handleUploadDoc2}
                />
                <div className="flex space-x-2 justify-center">
                  <button
                    disabled={schoolCustom}
                    type="button"
                    className={`inline-block px-6 py-1.5 ${
                      schoolCustom ? "bg-gray-300" : "bg-blue-600"
                    } text-white font-medium text-xs
                     leading-tight uppercase rounded shadow-md ${
                       !schoolCustom &&
                       `hover:bg-blue-700 hover:shadow-lg
                      focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800
                       active:shadow-lg transition duration-150 ease-in-out`
                     }`}
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 w-2/4 xl:w-full justify-center">
            <div className="flex flex-col w-full justify-center gap-2">
              <label className="flex text-gray-700 text-lg font-semibold w-full items-start justify-start">
                Message from student:
              </label>
              <TextArea
                rows={4}
                onChange={(e) => handleStudentMessage(e.target.value)}
                disabled={
                  loggedInUserEnrollmentType === "TeacherEnrollment"
                    ? true
                    : false
                }
                value={messageStudent}
              />
            </div>
            <div className="flex flex-col w-full justify-center gap-2">
              <label className="flex text-gray-700 text-lg font-semibold w-2/4 xl:w-full items-start justify-start">
                Message from Instructor:
              </label>
              <TextArea
                rows={4}
                value={messageInstructor}
                disabled={
                  loggedInUserEnrollmentType === "StudentEnrollment"
                    ? true
                    : false
                }
                onChange={(e) => setInstructorMessage(e.target.value)}
              />
            </div>
            <div className="flex flex-row h-full items-center gap-8">
              <div className="form-check">
                <input
                  className={`form-check-input appearance-none h-4 w-4 border ${
                    loggedInUserEnrollmentType === "StudentEnrollment" &&
                    "cursor-not-allowed"
                  } border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600
                   focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer`}
                  type="checkbox"
                  id="flexCheckDefault"
                  onChange={(e) => setApproveCustom(e.target.checked)}
                  disabled={
                    loggedInUserEnrollmentType === "StudentEnrollment"
                      ? true
                      : false
                  }
                />
                <label
                  className="form-check-label inline-block text-black font-semibold"
                  htmlFor="flexCheckDefault"
                >
                  Denied
                </label>
              </div>
              <div className="form-check">
                <input
                  className={`form-check-input appearance-none h-4 w-4 border ${
                    loggedInUserEnrollmentType === "StudentEnrollment" &&
                    "cursor-not-allowed"
                  } border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600
                   focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer`}
                  type="checkbox"
                  id="flexCheckDefault"
                  onChange={(e) => setApproveStandard(e.target.checked)}
                  disabled={
                    loggedInUserEnrollmentType === "StudentEnrollment"
                      ? true
                      : false
                  }
                />
                <label
                  className="form-check-label inline-block text-black font-semibold"
                  htmlFor="flexCheckDefault"
                >
                  Approved
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AssibilityModal;
