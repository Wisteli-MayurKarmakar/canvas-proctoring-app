import React, { useEffect, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import { AccessDetails } from "../../AppTypes";
import { Table } from "antd";
import axios from "axios";
import { updateLtiAccessRecord } from "../../apiConfigs";
import { getAccessRecordsByGuid, useAppStore } from "../../store/AppSotre";
import moment from "moment";
import WaitingModal from "../../CommonUtilites/WaitingModal";
import ConfirmModal from "../../CommonUtilites/Modals/ConfirmModal";
import AddInstructor from "../Modals/AddInstructor";

const Access: React.FC = (): JSX.Element => {
  const [admins, setAdmins] = useState<AccessDetails[]>([]);
  const [instructors, setInstructors] = useState<AccessDetails[]>([]);
  const { urlParamsData, accessRecords } = useAppStore((state) => state);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [showUpdateInfo, setShowUpdateInfo] = useState<boolean>(false);
  const [recordType, setRecordType] = useState<string>("all");
  const [showAddProctorModel, setShowAddProctorModel] =
    useState<boolean>(false);

  const waitMsg: JSX.Element = (
    <p className="text-center font-xl font-semibold">
      Updating access details. Please wait...
    </p>
  );

  const accessUpdateInfo: string =
    "This change may take 2-4 weeks to be effective. You will get an email from support team.";

  const updateLtiAccessRecordDetails = (record: AccessDetails) => {
    setIsUpdating(true);
    let payload = {
      guid: urlParamsData.guid,
      userId: record.userId,
      instructorId: record.instructorId,
      instituteId: record.instituteId,
      accessType: record.accessType,
      status: record.status,
      aiQuiz: record.aiQuiz,
      aiWithReport: record.aiWithReport,
      liveLaunch: record.liveLaunch,
      liveProctor: record.liveProctor,
      lockdownBrowser: record.lockdownBrowser,
    };

    axios
      .post(`${updateLtiAccessRecord}`, {
        ...payload,
      })
      .then(async () => {
        setIsUpdating(false);
        setShowUpdateInfo(true);
      })
      .catch((error) => {
        setIsUpdating(false);
      });
  };

  const handleOptionClick = (id: string, option: string) => {
    if (instructors) {
      let records: AccessDetails[] = [...instructors];
      records.forEach((item: AccessDetails, index: number) => {
        if (item.userId === id) {
          if (option === "aiQuiz") {
            item.aiQuiz = item.aiQuiz === "Y" ? "N" : "Y";
            if (item.aiQuiz === "N") {
              item.aiWithReport = "N";
              item.liveLaunch = "N";
              item.liveProctor = "N";
              item.lockdownBrowser = "N";
            }
          }
          if (option === "liveLaunch") {
            item.liveLaunch = item.liveLaunch === "Y" ? "N" : "Y";
          }
          if (option === "liveProctor") {
            item.liveProctor = item.liveProctor === "Y" ? "N" : "Y";
          }
          if (option === "aiWithReport") {
            item.aiWithReport = item.aiWithReport === "Y" ? "N" : "Y";
          }
          if (option === "lockdownBrowser") {
            item.lockdownBrowser = item.lockdownBrowser === "Y" ? "N" : "Y";
          }
          if (option === "status") {
            item.status = item.status === "Y" ? "N" : "Y";
          }
        }
      });
      setInstructors(records);
      let record: AccessDetails | undefined = records.find(
        (record) => record.userId === id
      );
      if (record) {
        updateLtiAccessRecordDetails(record);
      }
    }
  };

  const adminColumns: ColumnsType<AccessDetails> = [
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

  const instructorColumns: ColumnsType<AccessDetails> = [
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
      dataIndex: "",
      render: (row: AccessDetails) => {
        return (
          <select
            value={row.status}
            className="form-select appearance-none
              block
              w-full
              px-3
              py-1.5
              text-base
              font-normal
              text-black
              bg-white bg-clip-padding bg-no-repeat
              rounded
              m-0
             "
            aria-label="Default select example"
            onChange={() => handleOptionClick(row.userId, "status")}
          >
            <option value="Inactive">Inactive</option>
            <option value="Active">Active</option>
          </select>
        );
      },
    },
    {
      title: "Base Access",
      key: "ai",
      dataIndex: "",
      render: (row: AccessDetails) => {
        return (
          <input
            className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
            type="checkbox"
            id={`${row.idAccess}_ai`}
            defaultChecked={row.aiQuiz === "Y" ? true : false}
            onChange={() => handleOptionClick(row.userId, "aiQuiz")}
          ></input>
        );
      },
    },
    {
      title: "Report Review",
      key: "aiWRep",
      dataIndex: "",
      render: (row: AccessDetails) => {
        return (
          <input
            className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
            type="checkbox"
            id={`${row.idAccess}_aiWithReport`}
            disabled={row.aiQuiz === "Y" ? false : true}
            defaultChecked={row.aiWithReport === "Y" ? true : false}
            onChange={() => handleOptionClick(row.userId, "aiWithReport")}
          ></input>
        );
      },
    },
    {
      title: "Live Launch",
      key: "launch",
      dataIndex: "",
      render: (row: AccessDetails) => {
        return (
          <input
            className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
            type="checkbox"
            disabled={row.aiQuiz === "Y" ? false : true}
            id={`${row.idAccess}liveLaunch`}
            defaultChecked={row.liveLaunch === "Y" ? true : false}
            onChange={() => handleOptionClick(row.userId, "liveLaunch")}
          ></input>
        );
      },
    },
    {
      title: "Live Proctoring",
      key: "proctoring",
      dataIndex: "",
      render: (row: AccessDetails) => {
        return (
          <input
            className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
            type="checkbox"
            disabled={row.aiQuiz === "Y" ? false : true}
            id={`${row.idAccess}_ai`}
            defaultChecked={row.liveProctor === "Y" ? true : false}
            onChange={() => handleOptionClick(row.userId, "liveProctor")}
          ></input>
        );
      },
    },
    {
      title: "Lockdown Browser",
      key: "lockdown",
      dataIndex: "",
      render: (row: AccessDetails) => {
        return (
          <input
            className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
            type="checkbox"
            id={`${row.idAccess}_ai`}
            defaultChecked={row.lockdownBrowser === "Y" ? true : false}
            onChange={() => handleOptionClick(row.idAccess, "lockdownBrowser")}
          ></input>
        );
      },
    },
  ];

  const processAccessRecords = (processType: string) => {
    if (accessRecords) {
      let instructors: AccessDetails[] = [];
      let admins: AccessDetails[] = [];

      accessRecords.map((item: AccessDetails) => {
        if (item.status === "Y") {
          item.status = "Active";
        } else if (item.status === "N") {
          item.status = "Inactive";
        } else {
          item.status = "Not Active";
        }
        if (processType === "all" || processType === "INSTR") {
          if (
            item.accessType === "INSTR" ||
            item.accessType === "TeacherEnrollment"
          ) {
            let timezoneOffset: string = `.${Math.abs(moment().utcOffset())}Z`;
            item.createDate = moment(item.createDate + timezoneOffset).format(
              "MM-DD-YYYY hh:mm a"
            );
            item.key = item.idAccess;
            instructors.push(item);
          }
        }
        if (processType === "all" || processType === "ADMIN") {
          if (item.accessType === "ADMIN") {
            let timezoneOffset: string = `.${Math.abs(moment().utcOffset())}Z`;
            item.createDate = moment(item.createDate + timezoneOffset).format(
              "MM-DD-YYYY hh:mm a"
            );
            item.key = item.idAccess;
            admins.push(item);
          }
        }
      });
      setAdmins(admins);
      setInstructors(instructors);
    }
  };

  const handleReferesh = (refreshDataType: string) => {
    if (refreshDataType === "Admin") {
      setRecordType("ADMIN");
    } else {
      setRecordType("INSTR");
    }
    getAccessRecordsByGuid(urlParamsData.guid as string);
  };

  useEffect(() => {
    processAccessRecords(recordType);
  }, [accessRecords]);

  return (
    <div className="flex flex-col w-full justify-center">
      <p className="text-center text-xl font-semibold underline mt-2">
        Access Control
      </p>
      <p className="text-center text-lg font-semibold underline mt-8">Admin</p>
      <div className="flex flex-row h-full w-full items-center justify-end">
        <button
          type="button"
          onClick={() => handleReferesh("ADMIN")}
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          className="inline-block px-6 py-2.5 bg-blue-600
           text-white font-medium text-xs leading-tight
            rounded shadow-md"
        >
          Refresh Table
        </button>
      </div>
      <Table columns={adminColumns} className="mt-2" dataSource={admins} bordered/>
      <p className="text-center text-lg font-semibold underline mt-8">
        Instructor
      </p>
      <div className="flex flex-row h-full justify-between mt-4">
        <div className="flex flex-row h-full items-center gap-1">
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
        <div className="flex flex-row h-full items-center gap-4">
          <button
            type="button"
            onClick={() => setShowAddProctorModel(true)}
            data-mdb-ripple="true"
            data-mdb-ripple-color="light"
            className="inline-block px-6 py-2.5 bg-blue-600
           text-white font-medium text-xs leading-tight
            rounded shadow-md"
          >
            Add Instructor
          </button>
          <button
            type="button"
            onClick={() => handleReferesh("INSTR")}
            data-mdb-ripple="true"
            data-mdb-ripple-color="light"
            className="inline-block px-6 py-2.5 bg-blue-600
           text-white font-medium text-xs leading-tight
            rounded shadow-md"
          >
            Refresh Table
          </button>
        </div>
      </div>
      <Table
      bordered
        columns={instructorColumns}
        className="mt-2"
        dataSource={instructors}
      />
      {isUpdating && (
        <WaitingModal
          visible={isUpdating}
          title="Please wait"
          message={waitMsg}
        />
      )}
      {showUpdateInfo && (
        <ConfirmModal
          visible={showUpdateInfo}
          title={"Update Info"}
          close={() => setShowUpdateInfo(false)}
          message={accessUpdateInfo}
        />
      )}
      {showAddProctorModel && (
        <AddInstructor
          visible={showAddProctorModel}
          close={() => setShowAddProctorModel(false)}
        />
      )}
    </div>
  );
};

export default Access;
