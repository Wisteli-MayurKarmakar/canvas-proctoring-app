import { message, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  fetchAccountsByCourseAndEnrollemntType,
  getLtiAccessibility,
} from "../../apiConfigs";
import { useAppStore } from "../../store/AppSotre";
import AcccessibilityModal from "../../CommonUtilites/Modals/AccessibilityModal";
import { useAccessiblityStore } from "../../store/globalStore";
import UpdateProfile from "../../CommonUtilites/Modals/UpdateProfile";

type Student = {
  id: string;
  login_id: string;
  name: string;
  status: string;
  phone?: any;
};

const Enrollments: React.FC = (): JSX.Element => {
  const [students, setStudents] = useState<Student[]>([]);
  const [getStudentsError, setGetStudentsError] = useState<boolean>(false);
  const [fetchingStudents, setFetchingStudents] = useState<boolean>(true);
  const [selectedAction, setSelectedAction] = useState<string>("");
  const { urlParamsData, tokenData } = useAppStore((state) => state);
  const [studentId, setStudentId] = useState<any>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<any>(null);
  const [showUpdateProfileModal, setShowUpdateProfileModal] =
    useState<boolean>(false);
  const setAccessibilityConfigurations = useAccessiblityStore(
    (state) => state.setAccessibilityConfigurations
  );

  const getStudentAccessibilityConfigurations = async (studentId: string) => {
    try {
      let payload: any = {
        instituteId: tokenData.instituteId,
        studentId: studentId,
      };
      let response = await axios.post(`${getLtiAccessibility}`, payload);

      if (response.status === 200) {
        setAccessibilityConfigurations(response.data);
      } else {
        message.error("No accessibility configuration found.");
      }
    } catch (err) {}
    setSelectedAction("accessibility");
  };

  const handleAction = (studentId: string) => {
    getStudentAccessibilityConfigurations(studentId);
    setStudentId(studentId);
  };

  const handleUpdateProfile = (id: string) => {
    setSelectedStudentId(id);
    setShowUpdateProfileModal(!showUpdateProfileModal);
  };

  const studentColumns = [
    {
      dataIndex: "name",
      key: "name",
      title: `Name`,
    },
    {
      dataIndex: "",
      key: "phone",
      title: "Phone",
      render: (row: Student) => {
        if ("phone" in row) {
          return <p className="text-semibold">{row.phone}</p>;
        }
        return <p className="text-semibold">N/A</p>;
      },
    },
    {
      dataIndex: "",
      key: "email",
      title: `Email`,
      render: (row: Student) => {
        if ("login_id" in row) {
          return <p className="text-semibold">{row.login_id}</p>;
        }
        return <p className="text-semibold">N/A</p>;
      },
    },
    {
      dataIndex: "",
      key: "idApproval",
      title: `ID Approval Status`,
      render: (row: Student) => {
        return <p className="text-semibold">N/A</p>;
      },
    },
    {
      dataIndex: "",
      key: "action",
      title: `Actions`,
      render: (row: Student) => {
        return (
          <div className="flex flex-row h-full items-center gap-8">
            <button key="accessiblity" onClick={() => handleAction(row.id)}>
              Accessibility
            </button>
            <button key="approveId" onClick={() => handleUpdateProfile(row.id)}>
              Id Approval
            </button>
            <button key="contact" className="cursor-not-allowed text-gray-300" onClick={() => handleAction(row.id)} disabled>
              Contact
            </button>
          </div>
        );
      },
    },
  ];

  const getStudentsByCourseId = async () => {
    let response = await axios.get(
      `${fetchAccountsByCourseAndEnrollemntType}/${urlParamsData.courseId}/student/${tokenData.instituteId}/${tokenData.lmsAccessToken}`
    );

    if (response.status === 200) {
      let data = response.data.map((item: any) => ({
        ...item,
        key: item.id,
        user_id: item.id,
        course_id: urlParamsData.courseId,
      }));
      setStudents(data);
    } else {
      setGetStudentsError(true);
    }
    setFetchingStudents(false);
  };

  useEffect(() => {
    getStudentsByCourseId();
  }, []);

  if (!fetchingStudents) {
    if (!getStudentsError) {
      if (students.length > 0) {
        return (
          <div className="flex flex-row w-full h-full items-center justify-center">
            <Table
              dataSource={students}
              columns={studentColumns}
              pagination={{ position: ["bottomRight"] }}
              bordered={true}
            />
            {selectedAction === "accessibility" && studentId && (
              <AcccessibilityModal
                visible={selectedAction === "accessibility" && true}
                onClose={() => setSelectedAction("")}
                studentId={studentId}
              />
            )}
            {showUpdateProfileModal &&
              tokenData.lmsAccessToken &&
              urlParamsData.guid &&
              selectedStudentId && (
                <UpdateProfile
                  show={showUpdateProfileModal}
                  close={() => setShowUpdateProfileModal(false)}
                  authToken={tokenData.lmsAccessToken}
                  guid={urlParamsData.guid}
                  userId={selectedStudentId}
                  title={"idApproval"}
                />
              )}
          </div>
        );
      }
      return (
        <p className="text-semibold mt-2 text-center">No students available</p>
      );
    }
    return (
      <p className="flex items-center justify-between text-red-600 text-center font-bold text-xl">
        Could not fetch students. Please refresh the page.
      </p>
    );
  }

  return (
    <p className="text-center font-semibold text-xl">
      Fetching Students. Please wait...
    </p>
  );
};

export default Enrollments;
