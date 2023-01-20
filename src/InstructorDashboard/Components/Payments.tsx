import { Table } from "antd";
import React, { useEffect, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import {
  ConsumptionRecord,
  ConsumptionTableColumns,
  PaymentRecords,
  PaymentsTableColumns,
} from "../../AppTypes";
import axios from "axios";
import { getLtiConsumptions, getLtiPayments } from "../../apiConfigs";
import { useAppStore } from "../../store/AppSotre";
import moment, { Moment } from "moment";

const Payments: React.FC = (): JSX.Element => {
  const { urlParamsData } = useAppStore((state) => state);
  const [allPayments, setAllPayments] = useState<any>(null);
  const [allConsumptions, setAllConsumptions] = useState<any>(null);
  const [fetchPayments, setFetchPayments] = useState<boolean>(false);
  const [fetchConsumptions, setFetchConsumptions] = useState<boolean>(false);
  const consumptionTableColumns: ColumnsType<ConsumptionTableColumns> = [
    {
      dataIndex: "quizId",
      key: "quizId",
      title: "Quiz Id",
    },
    {
      dataIndex: "userId",
      key: "userId",
      title: "User Id",
    },
    // {
    //   dataIndex: "",
    //   key: "",
    //   title: "First Name",
    // },
    // {
    //   dataIndex: "",
    //   key: "",
    //   title: "Last Name",
    // },
    {
      dataIndex: "userName",
      key: "userName",
      title: "Username",
    },
    {
      dataIndex: "email",
      key: "email",
      title: "Billing Email",
    },
    {
      dataIndex: "",
      key: "",
      title: "Billing Rate",
    },
    {
      dataIndex: "",
      key: "",
      title: "# of Hours",
    },
    {
      dataIndex: "",
      key: "",
      title: "Cost/ Quiz",
    },
    {
      dataIndex: "",
      key: "",
      title: "Quiz Date",
      render: (row: ConsumptionRecord) => {
        let timeZoneOffset: string = `.${Math.abs(
          moment().utcOffset()
        ).toString()}Z`;
        let date: Moment = moment(row.interactionDate + timeZoneOffset);
        return date.format("MM-DD-YYYY hh:mm a");
      },
    },
  ];

  const paymentsTableColumns: ColumnsType<PaymentsTableColumns> = [
    {
      dataIndex: "payerId",
      key: "payerId",
      title: "User Id",
    },
    {
      dataIndex: "firstName",
      key: "firstName",
      title: "First Name",
    },
    {
      dataIndex: "lastName",
      key: "lastName",
      title: "Last Name",
    },
    {
      dataIndex: "",
      key: "",
      title: "Billing Email",
      render: (row: PaymentRecords) => {
        if ("billingEmail" in row) {
          return row.billingEmail;
        }
        return "N/ A";
      },
    },
    {
      dataIndex: "",
      key: "",
      title: "Payment Amount",
      render: (row: PaymentRecords) => {
        return `$${Math.ceil(row.paymentAmount)}`;
      },
    },
    {
      dataIndex: "",
      key: "",
      title: "Ref. Number",
      render: (row: PaymentRecords) => {
        return row.paymentReferenceNumber;
      },
    },
    {
      dataIndex: "",
      key: "",
      title: "Payment Date",
      render: (row: PaymentRecords) => {
        let timeZoneOffset: string = `.${Math.abs(
          moment().utcOffset()
        ).toString()}Z`;
        let date: Moment = moment(row.paymentDate + timeZoneOffset);
        return date.format("MM-DD-YYYY hh:mm a");
      },
    },
  ];

  const getAllPaymentDetails = () => {
    setFetchPayments(true);
    axios
      .post(`${getLtiPayments}`, { guid: urlParamsData.guid })
      .then((response: any) => {
        let data = [...response.data];
        data.forEach((item: PaymentRecords, index: number) => {
          item["key"] = index;
        });
        setAllPayments(data);
        setFetchPayments(false);
      })
      .catch((error: any) => console.log(error));
  };

  const getAllConsumptionDetails = () => {
    setFetchConsumptions(true);
    axios
      .post(`${getLtiConsumptions}`, { guid: urlParamsData.guid })
      .then((response: any) => {
        let data = [...response.data];
        data.forEach((item: PaymentRecords, index: number) => {
          item["key"] = index;
        });
        setAllConsumptions(data);
        setFetchConsumptions(false);
      })
      .catch((error: any) => console.log(error));
  };

  useEffect(() => {
    getAllPaymentDetails();
    getAllConsumptionDetails();
  }, []);

  return (
    <div className="flex flex-col w-full justify-center gap-2 mt-2">
      <p className="text-center text-xl underline font-semibold mt-1">
        Consumptions
      </p>
      <div className="flex flex-row h-full w-full items-start justify-between gap-4 mt-2">
        <div className="flex flex-row h-full items-start gap-2">
          <p className="font-semibold text-[20px]">Email : </p>
          <div className="flex flex-row h-full items-center md:w-58">
            <input
              type="search"
              className="form-control relative flex-auto min-w-0 block w-full px-3 py-1 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              placeholder="Search"
              aria-label="Search"
              aria-describedby="button-addon2"
            />
            <span
              className="input-group-text flex items-center px-3 py-1.5 text-base font-normal text-gray-700 text-center whitespace-nowrap rounded"
              id="basic-addon2"
            >
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="search"
                className="w-4 cursor-pointer"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                onClick={() => console.log("clicked")}
              >
                <path
                  fill="currentColor"
                  d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
                ></path>
              </svg>
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={getAllConsumptionDetails}
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          className="btn px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700  focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex items-center"
        >
          Refresh Table
        </button>
      </div>
      <Table
        columns={consumptionTableColumns}
        className="mt-2"
        dataSource={allConsumptions}
        loading={fetchConsumptions}
      />
      <p className="text-center text-xl underline font-semibold mt-8">
        Payments
      </p>
      <div className="flex flex-row h-full w-full items-start justify-between gap-4 mt-2">
        <div className="flex flex-row h-full items-start gap-2">
          <p className="font-semibold text-[20px]">Email : </p>
          <div className="flex flex-row h-full items-center md:w-58">
            <input
              type="search"
              className="form-control relative flex-auto min-w-0 block w-full px-3 py-1 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              placeholder="Search"
              aria-label="Search"
              aria-describedby="button-addon2"
            />
            <span
              className="input-group-text flex items-center px-3 py-1.5 text-base font-normal text-gray-700 text-center whitespace-nowrap rounded"
              id="basic-addon2"
            >
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="search"
                className="w-4 cursor-pointer"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
                ></path>
              </svg>
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={getAllPaymentDetails}
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          className="btn px-6 py-2.5 bg-blue-600 place-content-end text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700  focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex items-center"
        >
          Refresh Table
        </button>
      </div>
      <Table
        columns={paymentsTableColumns}
        className="mt-2"
        dataSource={allPayments}
        loading={fetchPayments}
      />
    </div>
  );
};

export default Payments;
