import { DatePicker, Table } from "antd";
// import { useForm } from "antd/lib/form/Form";
import moment, { Moment } from "moment";
import React, { SyntheticEvent } from "react";
import { isNumber } from "util";
import {
  AddBillingPropertyTypes,
  BillingContactDetails,
  PastRecordTableColumns,
  ServicesAndBillingFieldTypes,
} from "../../AppTypes";
import { useBillingStore } from "../../store/BillingStore";

const Billing: React.FC = (): JSX.Element => {
  const billingStore = useBillingStore((state) => state);
  const handleServiceAndBillingDetailsUpdate = useBillingStore(
    (state) => state.handleServiceAndBillingDetailsUpdate
  );
  const handleContactDetailsUpdate = useBillingStore(
    (state) => state.handleContactDetailsUpdate
  );
  const handleResetValues = useBillingStore((state) => state.handleResetValues);

  // const getRequiredInputFieldsRules = (
  //   fieldName: string
  // ): FormRequiredFieldRules[] => {
  //   const formRules: FormRequiredFieldRules[] = [
  //     {
  //       required: true,
  //       message: `Please enter ${fieldName}`,
  //     },
  //   ];
  //   return formRules;
  // };

  // const getRequiredDropdownFieldsRules = (
  //   fieldName: string
  // ): FormRequiredFieldRules[] => {
  //   const formRules: FormRequiredFieldRules[] = [
  //     {
  //       required: true,
  //       message: `Please select ${fieldName}`,
  //     },
  //   ];
  //   return formRules;
  // };

  // const form: any = useForm();

  const tableColumns: PastRecordTableColumns[] = [
    {
      dataIndex: "",
      key: "productType",
      title: "Product Type",
    },
    {
      dataIndex: "",
      key: "supportType",
      title: "Support Type",
    },
    {
      dataIndex: "",
      key: "studentProctor",
      title: "Student/ Proctor",
    },
    {
      dataIndex: "",
      key: "paymentType",
      title: "Payment Type",
    },
    {
      dataIndex: "",
      key: "billRate",
      title: "Billing Rate",
    },
    {
      dataIndex: "",
      key: "status",
      title: "Status",
    },
    {
      dataIndex: "",
      key: "startDate",
      title: "Start Date",
    },
    {
      dataIndex: "",
      key: "endDate",
      title: "End Date",
    },
  ];

  const validateFormValues = (): boolean => {
    let { productType, paymentType, studentPay } =
      billingStore.serviceAndBillingDetails;

    let res: boolean = false;
    if (productType.value === "Select product type") {
      let productType: AddBillingPropertyTypes = {
        ...billingStore.serviceAndBillingDetails.productType,
      };
      productType.hasError = true;
      productType.errorMsg = "Please select a product type";
      useBillingStore.setState((state) => ({
        serviceAndBillingDetails: {
          ...state.serviceAndBillingDetails,
          productType: { ...productType },
        },
      }));
      res = true;
    }
    if (paymentType.value === "Select payment type") {
      let paymentType: AddBillingPropertyTypes = {
        ...billingStore.serviceAndBillingDetails.paymentType,
      };
      paymentType.hasError = true;
      paymentType.errorMsg = "Please select a payment type";
      useBillingStore.setState((state) => ({
        serviceAndBillingDetails: {
          ...state.serviceAndBillingDetails,
          paymentType: { ...paymentType },
        },
      }));
      res = true;
    }
    if (studentPay.value === "Select student pay") {
      let studentPay: AddBillingPropertyTypes = {
        ...billingStore.serviceAndBillingDetails.studentPay,
      };
      studentPay.hasError = true;
      studentPay.errorMsg = "Please select a payment type";
      useBillingStore.setState((state) => ({
        serviceAndBillingDetails: {
          ...state.serviceAndBillingDetails,
          studentPay: { ...studentPay },
        },
      }));
      res = true;
    }
    return res;
  };

  const handleFormSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    let res: boolean = validateFormValues();
  };

  const handleBillingRate = (key: string, event: any) => {
    handleServiceAndBillingDetailsUpdate(key, event.target.value);
  };

  const checkNumber = (e: any) => {
    if (
      !/[0-9]/.test(e.key) &&
      !(
        e.key === "Backspace" ||
        e.key === "Delete" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight"
      )
    ) {
      e.preventDefault();
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex flex-col w-full md:w-4/5 xl:w-3/5 justify-start gap-8 py-2"
    >
      <label className="block text-gray-700 text-lg font-bold underline">
        Product & Payment Details:
      </label>
      <div className="grid grid-cols-3 justify-center gap-4">
        <div className="flex flex-col w-full justify-start gap-2">
          <label className="block text-gray-700 text-base font-semibold before:content-['*'] before:text-red-500 before:text-base">
            Product Type
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
                  billingStore.serviceAndBillingDetails.productType.hasError
                    ? "border border-solid border-red-400"
                    : "border border-solid border-gray-300"
                }
                rounded
                transition
                ease-in-out
                m-0
                focus:text-black focus:bg-white focus:border-blue-400 focus:outline-none`}
            aria-label=".form-select-sm example"
            id="selectProductType"
            value={billingStore.serviceAndBillingDetails.productType.value}
            onChange={(e) =>
              billingStore.handleServiceAndBillingDetailsUpdate(
                "productType",
                e.target.value
              )
            }
          >
            {billingStore.productTypes.map((item: string, index: number) => {
              return (
                <option id={item} value={item} key={index}>
                  {item}
                </option>
              );
            })}
          </select>
          {billingStore.serviceAndBillingDetails.productType.hasError && (
            <p className="text-sm text-red-400">
              {billingStore.serviceAndBillingDetails.productType.errorMsg}
            </p>
          )}
        </div>
        <div className="flex flex-col w-full justify-start gap-2">
          <label className="block text-gray-700 text-base font-semibold">
            Support Type
          </label>
          <select
            className="form-select form-select-sm
                appearance-none
                block
                w-full
                px-2
                py-1
                text-sm
                font-normal
                text-gray-700
                bg-white bg-clip-padding bg-no-repeat
                border border-solid border-gray-300
                rounded
                transition
                ease-in-out
                m-0
                focus:text-black focus:bg-white focus:border-blue-400 focus:outline-none"
            aria-label=".form-select-sm example"
            id="selectSupportType"
            value={billingStore.serviceAndBillingDetails.supportType.value}
            onChange={(e) =>
              billingStore.handleServiceAndBillingDetailsUpdate(
                "supportType",
                e.target.value
              )
            }
          >
            {billingStore.supportTypes.map((item: string, index: number) => {
              return (
                <option id={item} value={item} key={index}>
                  {item}
                </option>
              );
            })}
          </select>
        </div>
        <div className="flex flex-col w-full justify-start gap-2">
          <label className="block text-gray-700 text-base font-semibold">
            Students/ Proctor
          </label>
          <select
            className="form-select form-select-sm
                appearance-none
                block
                w-full
                px-2
                py-1
                text-sm
                font-normal
                text-gray-700
                bg-white bg-clip-padding bg-no-repeat
                border border-solid border-gray-300
                rounded
                transition
                ease-in-out
                m-0
                focus:text-black focus:bg-white focus:border-blue-400 focus:outline-none"
            aria-label=".form-select-sm example"
            id="selectStudentsProctorType"
            value={
              billingStore.serviceAndBillingDetails.studentsProctorType.value
            }
            onChange={(e) =>
              billingStore.handleServiceAndBillingDetailsUpdate(
                "studentsProctorType",
                e.target.value
              )
            }
          >
            {billingStore.studentProctorTypes.map(
              (item: string, index: number) => {
                return (
                  <option id={item} value={item} key={index}>
                    {item}
                  </option>
                );
              }
            )}
          </select>
        </div>
        <div className="flex flex-col w-full justify-start gap-2">
          <label className="block text-gray-700 text-base font-semibold">
            Status
          </label>
          <select
            className="form-select form-select-sm
                appearance-none
                block
                w-full
                px-2
                py-1
                text-sm
                font-normal
                text-gray-700
                bg-white bg-clip-padding bg-no-repeat
                border border-solid border-gray-300
                rounded
                transition
                ease-in-out
                m-0
                focus:text-black focus:bg-white focus:border-blue-400 focus:outline-none"
            aria-label=".form-select-sm example"
            id="selectStudentsProctorType"
            value={billingStore.serviceAndBillingDetails.status.value}
            onChange={(e) =>
              billingStore.handleServiceAndBillingDetailsUpdate(
                "status",
                e.target.value
              )
            }
          >
            {billingStore.status.map((item: string, index: number) => {
              return (
                <option id={item} value={item} key={index}>
                  {item}
                </option>
              );
            })}
          </select>
        </div>
        <div className="flex flex-col w-full justify-start gap-2">
          <label className="block text-gray-700 text-base font-semibold">
            Review Report
          </label>
          <select
            className="form-select form-select-sm
                appearance-none
                block
                w-full
                px-2
                py-1
                text-sm
                font-normal
                text-gray-700
                bg-white bg-clip-padding bg-no-repeat
                border border-solid border-gray-300
                rounded
                transition
                ease-in-out
                m-0
                focus:text-black focus:bg-white focus:border-blue-400 focus:outline-none"
            aria-label=".form-select-sm example"
            id="selectStudentsProctorType"
            value={billingStore.serviceAndBillingDetails.reportReview.value}
            onChange={(e) =>
              billingStore.handleServiceAndBillingDetailsUpdate(
                "reportReview",
                e.target.value
              )
            }
          >
            {billingStore.reportReviewTypes.map(
              (item: string, index: number) => {
                return (
                  <option id={item} value={item} key={index}>
                    {item}
                  </option>
                );
              }
            )}
          </select>
        </div>
        <div className="flex flex-col w-full justify-start gap-2">
          <label className="block text-gray-700 text-base font-semibold before:content-['*'] before:text-red-500 before:text-base">
            Student Pay
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
                  billingStore.serviceAndBillingDetails.studentPay.hasError
                    ? "border border-solid border-red-400"
                    : "border border-solid border-gray-300"
                }
                rounded
                transition
                ease-in-out
                m-0
                focus:text-black focus:bg-white focus:border-blue-400 focus:outline-none`}
            aria-label=".form-select-sm example"
            id="selectStudentsProctorType"
            value={billingStore.serviceAndBillingDetails.studentPay.value}
            onChange={(e) =>
              billingStore.handleServiceAndBillingDetailsUpdate(
                "studentPay",
                e.target.value
              )
            }
          >
            {billingStore.studentPayTypes.map((item: string, index: number) => {
              return (
                <option id={item} value={item} key={index}>
                  {item}
                </option>
              );
            })}
          </select>
          {billingStore.serviceAndBillingDetails.studentPay.hasError && (
            <p className="text-sm text-red-400">
              {billingStore.serviceAndBillingDetails.studentPay.errorMsg}
            </p>
          )}
        </div>
        <div className="flex flex-col w-full justify-start gap-2">
          <label className="block text-gray-700 text-base font-semibold before:content-['*'] before:text-red-500 before:text-base">
            Payment Type
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
                  billingStore.serviceAndBillingDetails.paymentType.hasError
                    ? "border border-solid border-red-400"
                    : "border border-solid border-gray-300"
                }
                rounded
                transition
                ease-in-out
                m-0
                focus:text-black focus:bg-white focus:border-blue-400 focus:outline-none`}
            aria-label=".form-select-sm example"
            id="selectPaymentType"
            value={billingStore.serviceAndBillingDetails.paymentType.value}
            onChange={(e) =>
              billingStore.handleServiceAndBillingDetailsUpdate(
                "paymentType",
                e.target.value
              )
            }
          >
            {billingStore.paymentTypes.map((item: string, index: number) => {
              return (
                <option id={item} value={item} key={index}>
                  {item}
                </option>
              );
            })}
          </select>
          {billingStore.serviceAndBillingDetails.paymentType.hasError && (
            <p className="text-sm text-red-400">
              {billingStore.serviceAndBillingDetails.paymentType.errorMsg}
            </p>
          )}
        </div>
        <div className="flex flex-col w-full justify-start gap-2">
          <label className="block text-gray-700 text-base font-semibold">
            Billing Currency
          </label>
          <select
            className="form-select form-select-sm
                appearance-none
                block
                w-full
                px-2
                py-1
                text-sm
                font-normal
                text-gray-700
                bg-white bg-clip-padding bg-no-repeat
                border border-solid border-gray-300
                rounded
                transition
                ease-in-out
                m-0
                focus:text-black focus:bg-white focus:border-blue-400 focus:outline-none"
            aria-label=".form-select-sm example"
            id="selectBillingCurrencyType"
            value={billingStore.serviceAndBillingDetails.billCurrency.value}
            onChange={(e) =>
              billingStore.handleServiceAndBillingDetailsUpdate(
                "billCurrency",
                e.target.value
              )
            }
          >
            {billingStore.billCurrencyTypes.map(
              (item: string, index: number) => {
                return (
                  <option id={item} value={item} key={index}>
                    {item}
                  </option>
                );
              }
            )}
          </select>
        </div>
        <div className="flex flex-col w-full justify-start gap-2">
          <label className="block text-gray-700 text-base font-semibold">
            Min. Quiz
          </label>
          <select
            className="form-select form-select-sm
                appearance-none
                block
                w-full
                px-2
                py-1
                text-sm
                font-normal
                text-gray-700
                bg-white bg-clip-padding bg-no-repeat
                border border-solid border-gray-300
                rounded
                transition
                ease-in-out
                m-0
                focus:text-black focus:bg-white focus:border-blue-400 focus:outline-none"
            aria-label=".form-select-sm example"
            id="selectMinQuizType"
            value={billingStore.serviceAndBillingDetails.minQuiz.value}
            onChange={(e) =>
              billingStore.handleServiceAndBillingDetailsUpdate(
                "minQuiz",
                e.target.value
              )
            }
          >
            {billingStore.minQuizType.map((item: string, index: number) => {
              return (
                <option id={item} value={item} key={index}>
                  {item}
                </option>
              );
            })}
          </select>
        </div>
        {Object.keys(billingStore.serviceAndBillingDetails).map(
          (key: string, index: number) => {
            if (key === "billRate") {
              return (
                <div
                  className="flex flex-col w-full justify-start gap-2"
                  key={index}
                >
                  <label
                    className="block text-gray-700 text-base font-semibold"
                    id={key + "_label"}
                  >
                    {
                      billingStore.serviceAndBillingDetails[
                        key as keyof ServicesAndBillingFieldTypes
                      ].label
                    }
                  </label>
                  <input
                    type="text"
                    id={key}
                    className="
            form-control
            block
            w-full
            px-2
            py-1
            text-sm
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
                      billingStore.serviceAndBillingDetails[
                        key as keyof ServicesAndBillingFieldTypes
                      ].placeholder
                    }
                    value={
                      billingStore.serviceAndBillingDetails[
                        key as keyof ServicesAndBillingFieldTypes
                      ].value
                    }
                    onKeyDown={(e: any) => checkNumber(e)}
                    onChange={(e: any) => handleBillingRate(key, e)}
                  />
                </div>
              );
            }
            if (key === "startDate" || key === "endDate") {
              return (
                <div
                  className="flex flex-col w-full justify-start gap-2"
                  key={index}
                >
                  <label
                    className="block text-gray-700 text-base font-semibold"
                    id={key + "_label"}
                  >
                    {
                      billingStore.serviceAndBillingDetails[
                        key as keyof ServicesAndBillingFieldTypes
                      ].label
                    }
                  </label>
                  <DatePicker
                    className="!rounded !relative !h-[30.4px] !border !border-solid !border-gray-300"
                    format={"MM-DD-YYYY"}
                    value={moment(
                      billingStore.serviceAndBillingDetails[
                        key as keyof ServicesAndBillingFieldTypes
                      ].value
                    )}
                    onChange={(date: Moment | null, dateString: string) => {
                      handleServiceAndBillingDetailsUpdate(key, dateString);
                    }}
                  />
                </div>
              );
            }
            return null;
          }
        )}
      </div>
      <label className="block text-gray-700 text-lg font-bold underline">
        Contact Details:
      </label>
      <div className="grid grid-cols-2 gap-4 justify-center">
        {Object.keys(billingStore.contactDetails).map(
          (key: string, index: number) => {
            return (
              <div
                className="flex flex-row h-full items-center gap-1"
                key={index}
              >
                <label
                  className={`text-gray-700 text-base font-semibold w-full md:w-2/3 xl:w-1/3 ${
                    key === "firstName" || key === "lastName" || key === "email"
                      ? "before:content-['*'] before:text-red-500 before:text-base"
                      : ""
                  }`}
                  id={key + "_label"}
                >
                  {
                    billingStore.contactDetails[
                      key as keyof BillingContactDetails
                    ].label
                  }
                </label>
                <input
                  type={key !== "email" ? "text" : "email"}
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
                    billingStore.contactDetails[
                      key as keyof BillingContactDetails
                    ].placeholder
                  }
                  id={key}
                  value={
                    billingStore.contactDetails[
                      key as keyof BillingContactDetails
                    ].value
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
          }
        )}
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
      <label className="block text-gray-700 text-lg font-bold underline">
        Past Records:
      </label>
      {/* <Table columns={tableColumns as []} /> */}
      <p className="text-center font-semibold">No records available</p>
    </form>
  );
};

export default Billing;