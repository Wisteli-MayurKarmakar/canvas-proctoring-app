import React, { SyntheticEvent, useEffect } from "react";
import { useAddInstituteStore } from "../../store/AddInstituteStore";
import {
  InstituteAndAccessDetailsFieldTypes,
  AddInsitutePropertyTypes,
  ContactDetailsFieldTypes,
} from "../../AppTypes";
import WaitingModal from "../../CommonUtilites/WaitingModal";

const Institutions: React.FC = (): JSX.Element => {
  const instituteStore = useAddInstituteStore((state) => state);
  const {
    handleInstituteDetailsUpdate,
    handleContactDetailsUpdate,
    instituteAndAccessDetails,
    contactDetails,
    saveLtiInsitute,
    handleResetValues,
    getInstituteDetails,
    savingDetails,
  } = useAddInstituteStore((state) => state);

  const waitMessage: JSX.Element = (
    <p className="text-center text-lg font-semibold">
      Saving Institution data. Please wait...
    </p>
  );

  const validateForm = (): boolean => {
    let { instituteType, lmsType, status } =
      instituteStore.instituteAndAccessDetails;
    let res: boolean = false;
    if (instituteType.value === "Select institute type") {
      let instituteType: AddInsitutePropertyTypes = {
        ...instituteStore.instituteAndAccessDetails.instituteType,
      };
      instituteType.hasError = true;
      instituteType.errorMsg = "Please select an institute type";
      useAddInstituteStore.setState((state) => ({
        instituteAndAccessDetails: {
          ...state.instituteAndAccessDetails,
          instituteType: { ...instituteType },
        },
      }));
      res = true;
    }
    if (lmsType.value === "Select lms type") {
      let lmsType: AddInsitutePropertyTypes = {
        ...instituteStore.instituteAndAccessDetails.lmsType,
      };
      lmsType.hasError = true;
      lmsType.errorMsg = "Please select lms type";
      useAddInstituteStore.setState((state) => ({
        instituteAndAccessDetails: {
          ...state.instituteAndAccessDetails,
          lmsType: { ...lmsType },
        },
      }));
      res = true;
    }
    if (status.value === "Select status") {
      let status: AddInsitutePropertyTypes = {
        ...instituteStore.instituteAndAccessDetails.status,
      };
      status.hasError = true;
      status.errorMsg = "Please select a status";
      useAddInstituteStore.setState((state) => ({
        instituteAndAccessDetails: {
          ...state.instituteAndAccessDetails,
          status: { ...status },
        },
      }));
      res = true;
    }
    return res;
  };

  const handleFormSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    let res: boolean = validateForm();

    if (!res) {
      console.log("Form has no error");
      saveLtiInsitute();
      return;
    }
  };

  useEffect(() => {
    getInstituteDetails();
  }, []);

  return (
    <form
      className="flex flex-col w-full md:w-4/5 xl:w-3/5 justify-center gap-4 py-2"
      id="instituteForm"
      onSubmit={handleFormSubmit}
    >
      <label className="block text-gray-700 text-lg font-bold mb-2 underline">
        Institute & Access Details:
      </label>
      <div className="flex flex-col w-full justify-center gap-4">
        <div className="grid grid-cols-3 gap-4 justify-center">
          <div className="flex flex-col w-full justify-start gap-2">
            <label className="block text-gray-700 text-base font-semibold before:content-['*'] before:text-red-500 before:text-base">
              Institute Type
            </label>
            <select
              className={`form-select form-select-sm
                appearance-none
                block
                w-full
                px-2
                py-1
                text-sm
                font-normal
                text-gray-700
                bg-white bg-clip-padding bg-no-repeat
               ${
                 instituteStore.instituteAndAccessDetails.instituteType.hasError
                   ? "border border-solid border-red-400"
                   : "border border-solid border-gray-300"
               }
                rounded
                transition
                ease-in-out
                m-0
                focus:text-black focus:bg-white focus:border-blue-400 focus:outline-none`}
              aria-label=".form-select-sm example"
              id="selectInstituteType"
              value={
                instituteStore.instituteAndAccessDetails.instituteType.value
              }
              onChange={(e) =>
                instituteStore.handleInstituteTypeSelect(e.target.value)
              }
            >
              {instituteStore.instituteTypes.map(
                (item: string, index: number) => {
                  return (
                    <option id={item} value={item} key={index}>
                      {item}
                    </option>
                  );
                }
              )}
            </select>
            {instituteStore.instituteAndAccessDetails.instituteType
              .hasError && (
              <p className="text-sm text-red-400">
                {
                  instituteStore.instituteAndAccessDetails.instituteType
                    .errorMsg
                }
              </p>
            )}
          </div>
          <div className="flex flex-col w-full justify-start gap-2">
            <label className="block text-gray-700 text-base font-semibold before:content-['*'] before:text-red-500 before:text-base">
              LMS Type
            </label>
            <select
              className={`form-select form-select-sm
                appearance-none
                block
                w-full
                px-2
                py-1
                text-sm
                font-normal
                text-gray-700
                bg-white bg-clip-padding bg-no-repeat
                ${
                  instituteStore.instituteAndAccessDetails.lmsType.hasError
                    ? "border border-solid border-red-400"
                    : "border border-solid border-gray-300"
                }
                rounded
                transition
                ease-in-out
                m-0
                focus:text-black focus:bg-white focus:border-blue-400 focus:outline-none`}
              aria-label=".form-select-sm example"
              id="selectLmsType"
              value={instituteStore.instituteAndAccessDetails.lmsType.value}
              onChange={(e) =>
                instituteStore.handleLmsTypeSelect(e.target.value)
              }
            >
              {instituteStore.lmsTypes.map((item: string, index: number) => {
                return (
                  <option id={item} value={item} key={index}>
                    {item}
                  </option>
                );
              })}
            </select>
            {instituteStore.instituteAndAccessDetails.lmsType.hasError && (
              <p className="text-sm text-red-400">
                {instituteStore.instituteAndAccessDetails.lmsType.errorMsg}
              </p>
            )}
          </div>
          <div className="flex flex-col w-full justify-start gap-2">
            <label className="block text-gray-700 text-base font-semibold before:content-['*'] before:text-red-500 before:text-base">
              Status
            </label>
            <select
              className={`form-select form-select-sm
                appearance-none
                block
                w-full
                px-2
                py-1
                text-sm
                font-normal
                text-gray-700
                bg-white bg-clip-padding bg-no-repeat
                ${
                  instituteStore.instituteAndAccessDetails.status.hasError
                    ? "border border-solid border-red-400"
                    : "border border-solid border-gray-300"
                }
                rounded
                transition
                ease-in-out
                m-0
                focus:text-black focus:bg-white focus:border-blue-400 focus:outline-none`}
              aria-label=".form-select-sm example"
              id="selectStatusType"
              value={instituteStore.instituteAndAccessDetails.status.value}
              onChange={(e) =>
                instituteStore.handleStatusSelect(e.target.value)
              }
            >
              {instituteStore.status.map((item: string, index: number) => {
                return (
                  <option id={item} value={item} key={index}>
                    {item}
                  </option>
                );
              })}
            </select>
            {instituteStore.instituteAndAccessDetails.status.hasError && (
              <p className="text-sm text-red-400">
                {instituteStore.instituteAndAccessDetails.status.errorMsg}
              </p>
            )}
          </div>
          {Object.keys(instituteAndAccessDetails).map(
            (key: string, index: number) => {
              if (
                key !== "instituteType" &&
                key !== "lmsType" &&
                key !== "status"
              ) {
                return (
                  <div
                    className="flex flex-col w-full justify-start gap-2"
                    key={index}
                  >
                    <label
                      className={`block text-gray-700 text-base font-semibold ${
                        key === "invokeUrl" ||
                        key === "launchUrl" ||
                        key === "apiAccessUrl"
                          ? "before:content-['*'] before:text-red-500 before:text-base"
                          : ""
                      }`}
                      id={key + "_label"}
                    >
                      {
                        instituteAndAccessDetails[
                          key as keyof InstituteAndAccessDetailsFieldTypes
                        ].label
                      }
                    </label>
                    <input
                      type={"text"}
                      id={key}
                      className={`form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-400 focus:outline-none ${
                        key === "token" || key === "config" || key === "secret"
                          ? "bg-gray-200 cursor-not-allowed text-center"
                          : ""
                      }`}
                      placeholder={
                        key !== "token" && key !== "config" && key !== "secret"
                          ? instituteAndAccessDetails[
                              key as keyof InstituteAndAccessDetailsFieldTypes
                            ].placeholder
                          : "**************"
                      }
                      value={
                        instituteAndAccessDetails[
                          key as keyof InstituteAndAccessDetailsFieldTypes
                        ].value
                      }
                      onChange={(e) =>
                        handleInstituteDetailsUpdate(key, e.target.value)
                      }
                      disabled={
                        key === "token" || key === "config" || key === "secret"
                          ? true
                          : false
                      }
                      required={
                        key === "invokeUrl" ||
                        key === "launchUrl" ||
                        key === "apiAccessUrl"
                          ? true
                          : false
                      }
                    />
                  </div>
                );
              }
            }
          )}
        </div>
      </div>
      <label className="block text-gray-700 text-lg font-bold mb-2 mt-2 underline">
        Contact:
      </label>
      <div className="grid grid-cols-2 justify-center gap-4">
        {Object.keys(contactDetails).map((key: string, index: number) => {
          return (
            <div className="flex flex-row h-full items-center" key={index}>
              <label
                className={`text-gray-700 text-base font-semibold w-full md:w-2/3 xl:w-1/3 ${
                  key === "firstName" || key === "lastName" || key === "email"
                    ? "before:content-['*'] before:text-red-500 before:text-base"
                    : ""
                }`}
                id={key + "_label"}
              >
                {contactDetails[key as keyof ContactDetailsFieldTypes].label}
              </label>
              <input
                type={key === "email" ? "email" : "text"}
                className="
                    px-2
                    py-1
                    text-sm
                    w-full
                    font-normal
                    text-gray-700
                    bg-white bg-clip-padding
                    border border-solid border-gray-300
                    rounded
                    transition
                    ease-in-out
                    m-0
                    focus:text-gray-700 focus:bg-white focus:border-blue-400 focus:outline-none"
                placeholder={
                  contactDetails[key as keyof ContactDetailsFieldTypes]
                    .placeholder
                }
                id={key}
                value={
                  contactDetails[key as keyof ContactDetailsFieldTypes].value
                }
                onChange={(e) =>
                  handleContactDetailsUpdate(key, e.target.value)
                }
                required={
                  key === "firstName" || key === "lastName" || key === "email"
                    ? true
                    : false
                }
              />
            </div>
          );
        })}
      </div>
      <div className="flex flex-row h-full w-full items-center justify-end gap-4">
        <button
          type="button"
          id="reset"
          onClick={handleResetValues}
          className="inline-block px-4 py-1.5 bg-gray-600 text-white font-medium text-xs
           leading-tight rounded shadow-md transition duration-150 ease-in-out"
        >
          Reset
        </button>
        <button
          type="submit"
          id="submit"
          key="Submit"
          className="inline-block px-4 py-1.5 bg-blue-600 text-white font-medium text-xs
           leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700
            focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition
             duration-150 ease-in-out"
        >
          Submit
        </button>
      </div>
      {savingDetails && (
        <WaitingModal
          visible={savingDetails}
          title="Saving data"
          message={waitMessage}
        />
      )}
    </form>
  );
};

export default Institutions;
