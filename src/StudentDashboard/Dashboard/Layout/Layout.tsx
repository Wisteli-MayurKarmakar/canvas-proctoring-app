import React, { useState } from "react";
import AssignmentsInfo from "../Components/AssignmentInformation";
import AssignmentsContainer from "../Components/AssignmentsContainer";
import HeaderMenus from "../Components/HeaderMenus";
import SideMenu from "../Components/SideMenu";
import AddToCalendarButton from "../../../CommonUtilites/AddToCalendarButton";
import {
  useAssignmentStore,
  useCommonStudentDashboardStore,
} from "../../../store/StudentDashboardStore";
import { useAppStore } from "../../../store/AppSotre";
import ChatBox from "../../../CommonUtilites/ChatBox";

const Layout: React.FC = (): JSX.Element => {
  const { selectedAssignment, assignments } = useAssignmentStore(
    (state) => state
  );
  const [showChat, setShowChat] = useState<boolean>(false);
  const { enrollments } = useCommonStudentDashboardStore((state) => state);
  const urlParamsData = useAppStore((state) => state.urlParamsData);
  let showUserInfo: boolean = false;
  if (urlParamsData.assignmentId) {
    if (selectedAssignment) {
      showUserInfo = true;
    }
  } else {
    if (assignments && assignments.length > 0) {
      showUserInfo = true;
    }
  }

  let assignment = {assignmentId: urlParamsData.assignmentId}

  return (
    <div className="flex flex-col h-full xl:h-screen w-full gap-4 justify-center px-4 py-4 xl:py-0 mt-4">
      <HeaderMenus />
      {showUserInfo && <AssignmentsInfo />}
      {selectedAssignment && (
        <AddToCalendarButton assignment={selectedAssignment as any} showChat={() => setShowChat(!showChat)}/>
      )}
      
      <div className="flex flex-row w-full h-full gap-4 justify-center">
        <SideMenu />
        <AssignmentsContainer isNewTab={false} />
        {showChat && <ChatBox quiz={assignment} student={enrollments} classStyle={"flex flex-col items-center justify-center w-2/6 h-[28em] border-2 rounded-md p-2"} isStudent={true}/>}
      </div>
    </div>
  );
};

export default Layout;
