import { Button, message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useAppStore } from "../../store/AppSotre";
import axios from "axios";
import { saveLtiStudentProfile, updateLtiAccessRecord } from "../../apiConfigs";
import moment from "moment";
import WaitingModal from "../../CommonUtilites/WaitingModal";

type Props = {
  visible: boolean;
  close: () => void;
};
type ColumnDataType = {
  firstName: string;
  lastName: string;
  email: string;
  baseAccess: boolean;
  reportReview: boolean;
  liveLaunch: boolean;
  liveProctoring: boolean;
  lockdownBrowser: boolean;
  key: string;
};

const dataSource: ColumnDataType[] = [
  {
    firstName: "",
    lastName: "",
    email: "",
    baseAccess: false,
    reportReview: false,
    liveLaunch: false,
    liveProctoring: false,
    lockdownBrowser: false,
    key: "1",
  },
];

type FeildValidation = {
  firstName: {
    name: string;
    error: boolean;
  };
  lastName: {
    name: string;
    error: boolean;
  };
  email: {
    name: string;
    error: boolean;
  };
};
const AddInstructor: React.FC<Props> = ({ visible, close }): JSX.Element => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [baseAccess, setBaseAccess] = useState<boolean>(false);
  const [reportReview, setReportReview] = useState<boolean>(false);
  const [liveLaunch, setLiveLaunch] = useState<boolean>(false);
  const [liveProctoring, setLiveProctoring] = useState<boolean>(false);
  const [lockdownBrowser, setLockdownBrowser] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("Inactive");
  const [feildValidation, setFeildValidation] = useState<FeildValidation>({
    firstName: {
      name: "First Name",
      error: false,
    },
    lastName: {
      name: "Last Name",
      error: false,
    },
    email: {
      name: "Email",
      error: false,
    },
  });
  const addInstructorMsg: JSX.Element = (
    <div className="text-center text-lg font-semibold">
      Adding Instructor. Please wait...
    </div>
  );
  const { urlParamsData, tokenData, userAccessDetails } = useAppStore(
    (state) => state
  );

  const handleLDBSelect = (value: boolean) => {
    setLiveLaunch(false);
    setLiveProctoring(false);
    setReportReview(false);
    setLockdownBrowser(value);
  };

  const columns: ColumnsType<ColumnDataType> = [
    {
      dataIndex: "",
      title: "First Name",
      key: "firstName",
      className: "!px-1",
      render: (_) => {
        return (
          <input
            type="text"
            disabled={isSaving}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="
              form-control
              block
              w-full
              px-3
              py-1.5
              text-base
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
            id="firstName"
          />
        );
      },
    },
    {
      dataIndex: "",
      title: "Last Name",
      key: "lastName",
      className: "!px-1",
      render: (_) => {
        return (
          <input
            type="text"
            disabled={isSaving}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="
              form-control
              block
              w-full
              px-3
              py-1.5
              text-base
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
            id="lastName"
          />
        );
      },
    },
    {
      dataIndex: "",
      title: "Email",
      key: "email",
      className: "!px-1",
      render: (_) => {
        return (
          <input
            type="text"
            value={email}
            disabled={isSaving}
            onChange={(e) => setEmail(e.target.value)}
            className="
              form-control
              block
              w-full
              px-3
              py-1.5
              text-base
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
            id="email"
          />
        );
      },
    },
    {
      dataIndex: "",
      title: "Status",
      key: "status",
      width: "150px",
      className: "!px-0",
      render: (_) => {
        return (
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="form-select appearance-none
            block
            w-full
            px-3
            py-1.5
            text-base
            font-normal
            text-gray-700
            bg-white bg-clip-padding bg-no-repeat
            border border-solid border-gray-300
            rounded
            transition
            ease-in-out
            m-0
            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          >
            <option value="inactive">
              Inactive
            </option>
            <option value="active">Active</option>
          </select>
        );
      },
    },
    {
      dataIndex: "",
      title: "Base Access",
      key: "baseAccess",
      render: (_) => {
        return (
          <input
            id="default-checkbox"
            checked={baseAccess}
            disabled={isSaving}
            onChange={(e) => setBaseAccess(e.target.checked)}
            type="checkbox"
            value=""
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
        );
      },
    },
    {
      dataIndex: "",
      title: "Report Review",
      key: "reportReview",
      render: (_) => {
        return (
          <input
            id="default-checkbox"
            checked={reportReview}
            onChange={(e) => setReportReview(e.target.checked)}
            disabled={lockdownBrowser || !baseAccess || isSaving}
            type="checkbox"
            value=""
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
        );
      },
    },
    {
      dataIndex: "",
      title: "Live Launch",
      key: "liveLaunch",
      render: (_) => {
        return (
          <input
            id="default-checkbox"
            checked={liveLaunch}
            onChange={(e) => setLiveLaunch(e.target.checked)}
            disabled={lockdownBrowser || !baseAccess || isSaving}
            type="checkbox"
            value=""
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
        );
      },
    },
    {
      dataIndex: "",
      title: "Live Proctoring",
      key: "liveProctoring",
      render: (_) => {
        return (
          <input
            id="default-checkbox"
            checked={liveProctoring}
            onChange={(e) => setLiveProctoring(e.target.checked)}
            disabled={lockdownBrowser || !baseAccess || isSaving}
            type="checkbox"
            value=""
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
        );
      },
    },
    {
      dataIndex: "",
      title: "Lockdown Browser",
      key: "lockdownBrowser",
      render: (_) => {
        return (
          <input
            id="default-checkbox"
            disabled={!baseAccess || isSaving}
            checked={lockdownBrowser}
            onChange={(e) => handleLDBSelect(e.target.checked)}
            type="checkbox"
            value=""
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
        );
      },
    },
  ];

  const validateEmail = (): boolean => {
    const re =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    return String(email).toLowerCase().search(re) !== -1;
  };

  const validateData = (): boolean => {
    let res: boolean = false;
    let feildValidations: FeildValidation = { ...feildValidation };

    if (firstName.length === 0) {
      feildValidation.firstName.error = true;
      res = true;
    }

    if (lastName.length === 0) {
      feildValidation.lastName.error = true;
      res = true;
    }

    if (email.length === 0) {
      res = true;
      feildValidation.email.error = true;
    } else {
      let isValid: boolean = validateEmail();
      if (!isValid) {
        res = true;
        feildValidation.email.error = true;
      }
    }
    setFeildValidation({ ...feildValidations });
    return res;
  };

  const saveProfile = async (userId: string) => {
    let payload = {
      idLtiStudentProfile: "",
      guid: urlParamsData.guid,
      idUser: userId,
      firstName: firstName,
      lastName: lastName,
      email: email,
      idFileIndex1: "",
      idFileIndex2: "",
      idFileName1: "",
      idFileName2: "",
      status: 0,
      createUser: "System",
      createDate: moment().toISOString(),
      modifyUser: "System",
      modifyDate: moment().toISOString(),
      otp: "",
      otpCreateDate: "",
      idApprovalStatus: 0,
      userType: "TeacherEnrollment",
    };

    try {
      const response = await axios.post(
        `${saveLtiStudentProfile}/${tokenData.instituteId}`,
        [{ ...payload }]
      );
      if (response.status === 200) {
        message.success("Successfully added instructor");
        setIsSaving(false);
      }
    } catch (e) {
      setIsSaving(false);
    }
  };

  const createAccessRecord = async () => {
    if (userAccessDetails) {
      let payload = {
        guid: urlParamsData.guid,
        userId: 1,
        instructorId: userAccessDetails.instructorId,
        instituteId: tokenData.instituteId,
        accessType: "TeacherEnrollment",
        status: status === "Active" ? "1" : "N",
        aiQuiz: baseAccess ? "Y" : "N",
        aiWithReport: reportReview ? "Y" : "N",
        liveLaunch: liveLaunch ? "Y" : "N",
        liveProctor: liveProctoring ? "Y" : "N",
        lockdownBrowser: lockdownBrowser ? "Y" : "N",
      };

      try {
        const response = await axios.post(`${updateLtiAccessRecord}`, {
          ...payload,
        });

        if (response.status === 200) {
          saveProfile(response.data.data.userId);
        }
      } catch (e) {
        setIsSaving(false);
      }
    }
  };

  const handleSave = () => {
    let res: boolean = validateData();
    if (!res) {
      setIsSaving(true);
      createAccessRecord();
    } else {
      setError(true);
    }
  };

  return (
    <Modal
      closable
      width={"70pc"}
      maskClosable={false}
      onCancel={close}
      visible={visible}
      title="Add Instructor"
      footer={[
        <Button
          key="submit"
          loading={isSaving}
          onClick={handleSave}
          className="inline-block px-6 py-2.5 !bg-blue-600 !text-white font-medium text-xs rounded-sm"
        >
          {isSaving ? "Saving" : "Save"}
        </Button>,
      ]}
    >
      <div className="flex flex-col w-full justify-center gap-4">
        <p className="text-lg text-center font-semibold">
          Please fill up Instructor details
        </p>
        {error && (
          <small className="text-red-400">
            Incorrect/ not sufficient details entered.
          </small>
        )}
        <Table columns={columns} dataSource={dataSource} pagination={false} />
      </div>
      {isSaving && (
        <WaitingModal
          visible={isSaving}
          title="Adding Instructor"
          message={addInstructorMsg}
        />
      )}
    </Modal>
  );
};

export default AddInstructor;
