import { Button, message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { getAccessRecordsByGuid, useAppStore } from "../../store/AppSotre";
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
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [id, setId] = useState<string>("");
  const [status, setStatus] = useState<string>("Active");
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

  let isNumber = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      !/[0-9]/.test(e.key) &&
      !(e.key === "Backspace") &&
      !(e.key === "Delete")
    ) {
      e.preventDefault();
    }
  };

  const handleId = (event: any) => {
    setId(event.target.value);
  };

  const columns: ColumnsType<ColumnDataType> = [
    {
      dataIndex: "",
      title: "Id",
      key: "id",
      render: (_) => {
        return (
          <input
            type="text"
            disabled={isSaving}
            value={id}
            maxLength={5}
            onKeyDown={(e) => isNumber(e)}
            onChange={(e: any) => handleId(e)}
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
      title: "First Name",
      key: "firstName",
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
      render: (_) => {
        return <p>{status}</p>
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
        let records = await getAccessRecordsByGuid(
          urlParamsData.guid as string
        );
        useAppStore.setState({
          accessRecords: records,
        });
      }
    } catch (e) {
      setIsSaving(false);
    }
  };

  const createAccessRecord = async () => {
    if (id === "") {
      message.error("Please enter an id");
      return;
    }
    if (userAccessDetails) {
      let payload = {
        guid: urlParamsData.guid,
        userId: id,
        instructorId: userAccessDetails.instructorId,
        instituteId: tokenData.instituteId,
        accessType: "TeacherEnrollment",
        status: "Y",
        aiQuiz: "N",
        aiWithReport: "N",
        liveLaunch: "N",
        liveProctor: "N",
        lockdownBrowser: "N",
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
        <Table columns={columns} dataSource={dataSource} pagination={false} bordered/>
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
