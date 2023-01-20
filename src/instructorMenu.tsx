import { Tabs } from "antd";
import React from "react";
import Configuration from "./configuration";
import "antd/dist/antd.min.css";
import Reports from "./InstructorDashboard/Tabs/Reports/reports";
import Authentication from "./InstructorDashboard/Authentication";
import LiveProctoring from "./InstructorDashboard/Menus/LiveProctoring";
import Student from "./InstructorDashboard/Tabs/Student/Students";
import Admin from "./InstructorDashboard/Tabs/Admin";
import { useAppStore } from "./store/AppSotre";
import DummyPage from "./dummyPage";
import HelpAndSupport from "./InstructorDashboard/Components/HelpAndSupport";

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
      <div className="container mx-auto w-4/5 justify-center">
        <Tabs
          defaultActiveKey="1"
          onChange={onChange}
          centered={true}
          tabBarGutter={40}
        >
          <TabPane tab="Configuration" key="1">
            <Configuration
              auth={props.auth.lmsAccessToken}
              id={urlParamsData.userId}
              courseId={urlParamsData.courseId}
              reqToken={tokenData.lmsAccessToken}
              toolConsumerGuid={urlParamsData.guid}
            />
          </TabPane>
          <TabPane tab="Live Launch" key="2">
            <Authentication />
          </TabPane>
          <TabPane tab="Live Proctoring" key="3">
            <LiveProctoring />
          </TabPane>
          <TabPane tab="Reports" key="4">
            <Reports />
          </TabPane>
          <TabPane tab="Students" key="5">
            <Student />
          </TabPane>
          {isAdmin && <TabPane tab="Admin" key="6">
            <Admin />
          </TabPane>}
          <TabPane tab="Help & Support" key="7">
            <HelpAndSupport />
          </TabPane>
        </Tabs>
      </div>
    );
  }
  return <DummyPage />;
};

export default InstructorMenu;
