import { Button, DatePicker, Modal, Input, message } from "antd";
import React, { useEffect, useState } from "react";
import AccessibleIcon from "@mui/icons-material/Accessible";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import PsychologyIcon from "@mui/icons-material/Psychology";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import BlindIcon from "@mui/icons-material/Blind";
import SignLanguageIcon from "@mui/icons-material/SignLanguage";
import TtyIcon from "@mui/icons-material/Tty";
import moment from "moment";
import { useAccessiblityStore } from "../../store/globalStore";

type Props = {
  visible: boolean;
  onClose: () => void;
};

const AssibilityModal: React.FC<Props> = (props): JSX.Element => {
  const { TextArea } = Input;
  const [standardOptionError, setStandardOptionError] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [customOptionError, setCustomOptionError] = useState<boolean>(false);
  const schoolHasDoc1 = useAccessiblityStore((state) => state.schoolHasDoc1);
  const schoolHasDoc2 = useAccessiblityStore((state) => state.schoolHasDoc2);
  const doc1 = useAccessiblityStore((state) => state.doc1);
  const doc2 = useAccessiblityStore((state) => state.doc2);
  const standardOptions = useAccessiblityStore(
    (state) => state.standardOptions
  );
  const customOptions = useAccessiblityStore((state) => state.customOptions);
  const standardOptionSelected = useAccessiblityStore(
    (state) => state.standardOptionSelected
  );
  const customOptionSelected = useAccessiblityStore(
    (state) => state.customOptionSelected
  );
  const setDoc1 = useAccessiblityStore((state) => state.setDoc1);
  const setDoc2 = useAccessiblityStore((state) => state.setDoc2);
  const setStandardOptionSelecton = useAccessiblityStore(
    (state) => state.setStandardOptionSelecton
  );
  const setCustomOptionSelected = useAccessiblityStore(
    (state) => state.setCustomOptionSelected
  );
  const setSchoolHasDoc1 = useAccessiblityStore(
    (state) => state.setSchoolHasDoc1
  );
  const setSchoolHasDoc2 = useAccessiblityStore(
    (state) => state.setSchoolHasDoc2
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
    phone: <PhoneInTalkIcon style={{ fontSize: 50 }} />,
    psycology: <PsychologyIcon style={{ fontSize: 50 }} />,
    barilley: <DragIndicatorIcon style={{ fontSize: 50 }} />,
    blind: <BlindIcon style={{ fontSize: 50 }} />,
    deaf: deafIcon,
    handicapped: <AccessibleIcon style={{ fontSize: 50 }} />,
    cc: ccIcon,
    singleLanguage: <SignLanguageIcon style={{ fontSize: 50 }} />,
    teleTypwriter: <TtyIcon style={{ fontSize: 50 }} />,
  };

  const customAccessibilityOptions: any = {
    faceRecog: "Face recognition issue",
    extraTime: "Extra time required",
    needBreak: "Need a break during quiz",
    shortDisability: "Short term disability",
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

  const handleSubmit = () => {
    if (standardOptionSelected) {
      if (!schoolHasDoc1 && !doc1) {
        setStandardOptionError(true);
      } else {
        setStandardOptionError(false);
      }
    }

    if (customOptionSelected) {
      if (!schoolHasDoc2 && !doc2) {
        setCustomOptionError(true);
      } else {
        setCustomOptionError(false);
      }
    }
  };

  return (
    <Modal
      title="Accessiblity Options"
      visible={props.visible}
      onCancel={props.onClose}
      maskClosable={false}
      width={"70pc"}
      footer={[
        <Button key="cancel" onClick={props.onClose} disabled={loading && true}>
          Cancel
        </Button>,
        <Button key="submit" onClick={handleSubmit} loading={loading}>
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
        <div className="flex flex-row h-full items-start gap-2">
          <div className="flex flex-col w-full justify-center gap-4">
            <label className="flex text-gray-700 text-2xl font-semibold w-full items-start justify-start">
              Standard
            </label>
            <div className="flex flex-row h-full w-full items-center gap-2 flex-wrap">
              {Object.keys(standardOptions).map(
                (item: string, index: number) => {
                  return (
                    <div
                      key={index}
                      onClick={() => handleStandardOptionClick(item)}
                      className={`flex box-border border-2 shadow-lg rounded w-36 h-32 items-cente justify-center self-center hover:bg-blue-400 hover:text-white cursor-pointer ${
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
                  className="flex w-72 text-sm text-black bg-gray-50 rounded border border-gray-300 cursor-pointer focus:outline-none dark:placeholder-gray-400"
                  id="file_input"
                  type="file"
                  onChange={handleUploadDoc1}
                />
                <div className="flex space-x-2 justify-center">
                  <button
                    type="button"
                    className="inline-block px-6 py-1.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                  >
                    Upload
                  </button>
                </div>
              </div>
              <div className="flex w-full justify-start mt-4">
                <div className="form-check">
                  <input
                    className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                    type="checkbox"
                    value=""
                    id="flexCheckDefault"
                    onClick={() => setSchoolHasDoc1(!schoolHasDoc1)}
                  />
                  <label
                    className="form-check-label inline-block text-black font-semibold"
                    htmlFor="flexCheckDefault"
                  >
                    School has the document for standard accessibility
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-1/2 justify-center gap-4">
            <label className="flex text-gray-700 text-2xl font-semibold w-full items-start justify-start">
              Custom
            </label>
            <div className="flex flex-row w-full justify-center gap-2">
              {Object.keys(customOptions).map((item: string, index: number) => {
                return (
                  <div
                    key={index}
                    onClick={() => handlCustomOptionClick(item)}
                    className={`flex box-border border-2 shadow-lg rounded w-36 h-32 items-center justify-center  hover:bg-blue-400 hover:text-white cursor-pointer p-2 ${
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
              })}
            </div>
            <div className="flex flex-row h-full items-center gap-4">
              <div className="flex flex-col w-full justify-center gap-1">
                <label className="flex text-gray-700 text-lg font-semibold items-start justify-start">
                  Start Date:
                </label>
                <DatePicker
                  defaultValue={moment()}
                  disabledDate={(current) =>
                    current <= moment().add(-1, "days")
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
                  format="MM/DD/YYYY"
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex flex-col h-full items-center gap-2">
              <label
                className="flex text-gray-700 text-lg font-semibold w-full items-start justify-start"
                htmlFor="doc2"
              >
                Upload Document 2:
              </label>
              <div className="flex flex-row w-full gap-4 justify-start">
                <input
                  className="flex w-72 text-sm text-black bg-gray-50 rounded border border-gray-300 cursor-pointer focus:outline-none dark:placeholder-gray-400"
                  id="file_input"
                  type="file"
                  onChange={handleUploadDoc2}
                />
                <div className="flex space-x-2 justify-center">
                  <button
                    type="button"
                    className="inline-block px-6 py-1.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                  >
                    Upload
                  </button>
                </div>
              </div>
              <div className="flex w-full justify-start mt-4">
                <div className="form-check">
                  <input
                    className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                    type="checkbox"
                    value=""
                    id="flexCheckDefault"
                    onClick={() => setSchoolHasDoc2(!schoolHasDoc2)}
                  />
                  <label
                    className="form-check-label inline-block text-black font-semibold"
                    htmlFor="flexCheckDefault"
                  >
                    School has the document for custom accessiblity
                  </label>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full justify-center gap-2">
              <label className="flex text-gray-700 text-lg font-semibold w-full items-start justify-start">
                Message:
              </label>
              <TextArea rows={6} />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AssibilityModal;
