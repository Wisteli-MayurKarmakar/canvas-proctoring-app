import React, { useState } from "react";
import NeedHelp from "./NeedHelp";
import SystemCheck from "../../Tabs/SystemCheck";
import PrivacyPolicy from "../../Tabs/PrivacyPolicy";
import ImageMatchAuthentication from "../../AuthenticationScreens/ImageMatchAuthentication";
import UpdateProfile from "../../../CommonUtilites/Modals/UpdateProfile";
import { useCommonStudentDashboardStore } from "../../../store/StudentDashboardStore";
import { useWebCamStore } from "../../../store/globalStore";
import { useAppStore } from "../../../store/AppSotre";
import { Button, Modal } from "antd";
import AssibilityModal from "../../../CommonUtilites/Modals/AccessibilityModal";
import Payments from "./Payments";

const SideMenu: React.FC = (): JSX.Element => {
  const [showModal, setShowModal] = useState<JSX.Element | null>(null);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [showAccessibilityModal, setShowAccessibilityModal] =
    useState<boolean>(false);
  const [showUpdateProfileModal, setShowUpdateProfileModal] =
    useState<boolean>(false);
  let [closeStream, setCloseStream] = useState<boolean>(false);
  const enrollment = useCommonStudentDashboardStore(
    (state) => state.enrollments
  );
  const [showPayments, setShowPayments] = useState<boolean>(false);
  const urlParamsData = useAppStore((state) => state.urlParamsData);
  const tokenData = useAppStore((state) => state.tokenData);
  const stream = useWebCamStore((state) => state.stream);
  const closeWebCamResouce = useWebCamStore(
    (state) => state.closeWebCamResouce
  );

  const options: string[] = [
    "System Check",
    "Authentication Test",
    "Privacy Policy",
    "Update Profile",
    "Payment",
    "Accessiblity Options",
  ];

  const handleOpenUpdateProfile = (flag: boolean) => {
    if (flag) {
      console.log("flag", flag);
    }
  };

  const setModal = (modalName: string): void => {
    if (modalName === "Update Profile") {
      setShowUpdateProfileModal(true);
      return;
    }

    if (modalName === "Accessiblity Options") {
      setShowAccessibilityModal(true);
      return;
    }

    if (modalName === "Payment") {
      setShowPayments(!showPayments);
      return;
    }

    switch (modalName) {
      case "System Check":
        setModalTitle("System Check");
        setShowModal(
          <SystemCheck
            quizId={null}
            courseId={null}
            stuId={null}
            stuName={null}
            systemCheckStatus={() => {}}
            getSocketConnection={() => {}}
          />
        );
        break;
      case "Authentication Test":
        setModalTitle("Authentication Test");
        setShowModal(
          <ImageMatchAuthentication
            studentId={enrollment?.user_id}
            courseId={urlParamsData.courseId}
            closeStream={closeStream}
            authToken={tokenData.lmsAccessToken}
            guid={urlParamsData.guid}
            openUpdateProfile={handleOpenUpdateProfile}
          />
        );
        break;
      case "Privacy Policy":
        setModalTitle("Privacy Policy");
        setShowModal(<PrivacyPolicy isChecked={() => {}} showAgree={false} />);
        break;
      default:
        break;
    }
  };

  const handleClose = () => {
    if (modalTitle === "Authentication Test") {
      if (stream?.active) {
        closeWebCamResouce();
      }
    }
    setShowModal(null);
  };

  return (
    <div className="flex flex-col gap-4 w-5/12 xl:w-3/12 h-full items-center">
      <NeedHelp />
      {!urlParamsData.newTab && (
        <div className="flex flex-col w-full box-border border-1 rounded bg-gray-200 gap-2 p-2 justify-center">
          {options.map((item: string, index: number) => {
            return (
              <div
                className="flex space-x-2 space-y-4 text-center justify-center"
                key={index}
              >
                <p
                  className="font-semibold text-base w-full inline-block py-2 bg-transparent cursor-pointer leading-tight text-gray-500 hover:text-blue-500 hover:scale-125"
                  onClick={() => setModal(item)}
                >
                  {item}
                </p>
              </div>
            );
          })}
        </div>
      )}
      {showModal && (
        <Modal
          title={modalTitle}
          visible={showModal ? true : false}
          onCancel={handleClose}
          maskClosable={false}
          width={"90pc"}
          bodyStyle={{
            maxHeight: "50%",
            height: 600,
            overflowY: "scroll",
          }}
          footer={[
            modalTitle === "Help" ? (
              <Button key="submit" loading={true}>
                Submit
              </Button>
            ) : null,
          ]}
        >
          {showModal}
        </Modal>
      )}
      {showUpdateProfileModal && (
        <UpdateProfile
          show={true}
          close={() => setShowUpdateProfileModal(false)}
          authToken={tokenData.lmsAccessToken as any}
          guid={urlParamsData.guid as any}
          userId={enrollment?.user_id as any}
          title={"updateId"}
        />
      )}
      {showAccessibilityModal && urlParamsData.studentId && (
        <AssibilityModal
          visible={showAccessibilityModal}
          onClose={() => setShowAccessibilityModal(false)}
          studentId={urlParamsData.studentId}
        />
      )}
      {showPayments && (
        <Payments visible={showPayments} close={() => setShowPayments(false)} />
      )}
    </div>
  );
};

export default SideMenu;
