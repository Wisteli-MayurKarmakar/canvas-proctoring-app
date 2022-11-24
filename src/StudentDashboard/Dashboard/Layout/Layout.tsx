import React from "react";
import AssignmentsInfo from "../Components/AssignmentInformation";
import AssignmentsContainer from "../Components/AssignmentsContainer";
import HeaderMenus from "../Components/HeaderMenus";
import SideMenu from "../Components/SideMenu";
import AddToCalendarButton from "../../../CommonUtilites/AddToCalendarButton";
import { useAssignmentStore } from "../../../store/StudentDashboardStore";
import { useAppStore } from "../../../store/AppSotre";

const Layout: React.FC = (): JSX.Element => {
  const { selectedAssignment, assignments } = useAssignmentStore(
    (state) => state
  );
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

  return (
    <div className="flex flex-col h-full xl:h-screen w-full gap-4 justify-center px-4 py-4 xl:py-0 mt-4">
      <HeaderMenus />
      {showUserInfo && <AssignmentsInfo />}
      {selectedAssignment && !urlParamsData.newTab && (
        <AddToCalendarButton assignment={selectedAssignment as any} />
      )}
      <div className="flex flex-row w-full h-full gap-4 justify-center">
        <SideMenu />
        <AssignmentsContainer isNewTab={false} />
      </div>
    </div>
  );
};

export default Layout;
