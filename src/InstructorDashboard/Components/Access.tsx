import React from "react";
import type { ColumnsType } from "antd/es/table";
import { AdminTableDataTypes, InstructorTableDataTypes } from "../../AppTypes";
import { Table } from "antd";

const Access: React.FC = (): JSX.Element => {
  const adminColumns: ColumnsType<AdminTableDataTypes> = [
    {
      title: "User Id",
      key: "userId",
      dataIndex: "userId",
    },
    {
      title: "First Name",
      key: "firstName",
      dataIndex: "firstName",
    },
    {
      title: "Last Name",
      key: "lastName",
      dataIndex: "lastName",
    },
    {
      title: "Email",
      key: "email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      key: "phone",
      dataIndex: "phone",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
    },
    {
      title: "Create Date",
      key: "createDate",
      dataIndex: "createDate",
    },
  ];

  const instructorColumns: ColumnsType<InstructorTableDataTypes> = [
    {
      title: "User Id",
      key: "userId",
      dataIndex: "userId",
    },
    {
      title: "First Name",
      key: "firstName",
      dataIndex: "firstName",
    },
    {
      title: "Last Name",
      key: "lastName",
      dataIndex: "lastName",
    },
    {
      title: "Email",
      key: "email",
      dataIndex: "email",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
    },
    {
      title: "AI",
      key: "ai",
      dataIndex: "",
    },
    {
      title: "AI with Report",
      key: "aiWRep",
      dataIndex: "",
    },
    {
      title: "Live Launch",
      key: "launch",
      dataIndex: "",
    },
    {
      title: "Full Proctoring",
      key: "proctoring",
      dataIndex: "",
    },
    {
      title: "Lockdown Browser",
      key: "lockdown",
      dataIndex: "",
    },
  ];

  return (
    <div className="flex flex-col w-full justify-center">
      <p className="text-center text-xl font-semibold underline mt-2">
        Access Control
      </p>
      <p className="text-center text-lg font-semibold underline mt-8">Admin</p>
      <Table columns={adminColumns} className="mt-2" />
      <p className="text-center text-lg font-semibold underline mt-8">
        Instructor
      </p>
      <div className="flex flex-row h-full items-start mt-4">
        <p className="text-[20px] font-semibold">Email</p>
        <input
          type="text"
          className="
          form-control
          block
          ml-4
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
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
        "
          id="exampleFormControlInput4"
          placeholder="Search"
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
      <Table columns={instructorColumns} className="mt-2" />
    </div>
  );
};

export default Access;
