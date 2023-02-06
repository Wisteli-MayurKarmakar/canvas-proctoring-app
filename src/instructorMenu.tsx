import { Tabs } from "antd";
import React, { lazy, Suspense } from "react";
// import Configuration from "./configuration";
import "antd/dist/antd.min.css";
// import Reports from "./InstructorDashboard/Tabs/Reports/reports";
// import Authentication from "./InstructorDashboard/Authentication";
// import LiveProctoring from "./InstructorDashboard/Menus/LiveProctoring";
// import Student from "./InstructorDashboard/Tabs/Student/Students";
// import Admin from "./InstructorDashboard/Tabs/Admin";
import LazyLoading from "./CommonUtilites/LazyLoadFallback";
import { useAppStore } from "./store/AppSotre";
import DummyPage from "./dummyPage";

interface Props {
  auth: any;
  emailAsId: any;
  id: any;
  courseId: any;
  toolConsumerGuid: any;
  studentId: string;
  invokeUrl: string;
  accountId: string;
}

const InstructorMenu: React.FunctionComponent<Props> = (props): JSX.Element => {
  let { TabPane } = Tabs;
  const onChange = (key: string) => {};
  const { urlParamsData, tokenData, isAdmin } = useAppStore((state) => state);
  const ConfigurationScreen = lazy(() => import("./configuration"));
  const LiveAuthScreen = lazy(
    () => import("./InstructorDashboard/Authentication")
  );
  const LiveProctoringScreen = lazy(
    () => import("./InstructorDashboard/Menus/LiveProctoring")
  );
  const StudentScreen = lazy(
    () => import("./InstructorDashboard/Tabs/Student/Students")
  );
  const AdminScreen = lazy(() => import("./InstructorDashboard/Tabs/Admin"));
  const ReportScreen = lazy(
    () => import("./InstructorDashboard/Tabs/Reports/reports")
  );

  if (
    urlParamsData.courseId &&
    urlParamsData.guid &&
    urlParamsData.userId &&
    urlParamsData.studentId &&
    urlParamsData.guid &&
    urlParamsData.accountId &&
    urlParamsData.invokeUrl &&
    tokenData.lmsAccessToken &&
    tokenData.instituteId
  ) {
    return (
      <div className="container mx-auto w-4/5 h-full justify-center">
        <Tabs
          defaultActiveKey="1"
          onChange={onChange}
          centered={true}
          tabBarGutter={40}
        >
          <TabPane tab="Configuration" key="1">
            {/* <Configuration
                auth={props.auth.lmsAccessToken}
                id={urlParamsData.userId}
                courseId={urlParamsData.courseId}
                reqToken={tokenData.lmsAccessToken}
                toolConsumerGuid={urlParamsData.guid}
              /> */}
            <Suspense fallback={<LazyLoading />}>
              <ConfigurationScreen
                auth={props.auth.lmsAccessToken}
                id={urlParamsData.userId}
                courseId={urlParamsData.courseId}
                reqToken={tokenData.lmsAccessToken}
                toolConsumerGuid={urlParamsData.guid}
              />
            </Suspense>
          </TabPane>
          <TabPane tab="Live Launch" key="2">
            {/* <Authentication /> */}
            <Suspense fallback={<LazyLoading />}>
              <LiveAuthScreen />
            </Suspense>
          </TabPane>
          <TabPane tab="Live Proctoring" key="3">
            {/* <LiveProctoring /> */}
            <Suspense fallback={<LazyLoading />}>
              <LiveProctoringScreen />
            </Suspense>
          </TabPane>
          <TabPane tab="Reports" key="4">
            {/* <Reports /> */}
            <Suspense fallback={<LazyLoading />}>
              <ReportScreen />
            </Suspense>
          </TabPane>
          <TabPane tab="Students" key="5">
            {/* <Student /> */}
            <Suspense fallback={<LazyLoading />}>
              <StudentScreen />
            </Suspense>
          </TabPane>
          {isAdmin && (
            <TabPane tab="Admin" key="6">
              <Suspense fallback={<LazyLoading />}>
                <AdminScreen />
              </Suspense>
              {/* <Admin /> */}
            </TabPane>
          )}
        </Tabs>
      </div>
    );
  }
  return <DummyPage />;
};

export default InstructorMenu;
