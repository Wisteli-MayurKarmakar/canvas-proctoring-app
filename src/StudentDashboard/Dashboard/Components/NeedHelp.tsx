import React, { useState } from "react";
import StudentHelpDocument from "../../Modals/StudentHelpDocument";
import Help from "../../Tabs/Help";
import { useCommonStudentDashboardStore } from "../../../store/StudentDashboardStore";
import { useAppStore } from "../../../store/AppSotre";
type Props = {};

const NeedHelp: React.FC<Props> = (props): JSX.Element => {
  const [openModal, setOpenModal] = useState<string>("");
  const enrollment = useCommonStudentDashboardStore(
    (state) => state.enrollments
  );
  const tokenData = useAppStore((state) => state.tokenData);

  const handleSetModal = (modalName: string): void => {
    setOpenModal(modalName);
  };

  return (
    <div className="flex flex-col gap-2 w-full items-center bg-gray-200 rounded py-2">
      <div className="flex flex-row w-full gap-2 items-center justify-center pb-2 border-b-2 border-gray-400 rounded">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className=" bi bi-question-circle-fill fill-blue-400 w-6 h-6 self-center"
          viewBox="0 0 16 16"
        >
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247zm2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z" />
        </svg>
        <p className="font-semibold text-lg text-blue-500">Need Help?</p>
      </div>
      <p
        className="text-base font-semibold text-gray-500 hover:text-blue-500 hover:scale-110 cursor-pointer"
        onClick={() => handleSetModal("doc")}
      >
        Document
      </p>
      <p className="text-base font-semibold text-gray-500 cursor-not-allowed">
        Video
      </p>
      <p
        className="text-base font-semibold text-gray-500 hover:text-blue-500 hover:scale-110 cursor-pointer"
        onClick={() => handleSetModal("emailPh")}
      >
        Email/ Phone
      </p>
      {openModal === "doc" && (
        <StudentHelpDocument show={true} close={() => setOpenModal("")} />
      )}
      {openModal === "emailPh" && tokenData && (
        <Help
          visible={true}
          onCancel={() => setOpenModal("")}
          student={enrollment}
          authToken={tokenData.lmsAccessToken as any}
        />
      )}
    </div>
  );
};

export default NeedHelp;
