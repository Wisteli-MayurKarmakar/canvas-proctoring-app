import { Tabs } from "antd";
import React from "react";
import Configuration from "./configuration";
import "antd/dist/antd.css";
import ProctoringExam from "./quizReport";
import Authentication from "./InstructorDashboard/Authentication";
import LiveProctoring from "./InstructorDashboard/Menus/LiveProctoring";

interface Props {
  auth: any;
  emailAsId: any;
  id: any;
  courseId: any;
  toolConsumerGuid: any;
}

const InstructorMenu: React.FunctionComponent<Props> = (props): JSX.Element => {
  let { TabPane } = Tabs;
  const onChange = (key: string) => {};
  return (
    <div className="container mx-auto w-4/5 justify-center">
      <Tabs
        defaultActiveKey="1"
        onChange={onChange}
        centered={true}
        tabBarGutter={40}
      >
        <TabPane tab="Quiz configuration" key="1">
          <Configuration
            auth={props.auth}
            id={props.id}
            courseId={props.courseId}
            reqToken={props.auth.data.access_token}
            toolConsumerGuid={props.toolConsumerGuid}
          />
        </TabPane>
        <TabPane tab="Authentication" key="2">
          <Authentication courseId={props.courseId} authData={props.auth} userId={props.id}/>
        </TabPane>
        <TabPane tab="Proctoring Exam" key="3">
          <LiveProctoring authData={props.auth} courseId={props.courseId} userId={props.id}/>
        </TabPane>
        <TabPane tab="Quiz reports" key="4">
          <ProctoringExam
            userId={props.emailAsId}
            courseId={props.courseId}
            reqToken={props.auth.data.access_token}
            toolConsumerGuid={props.toolConsumerGuid}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default InstructorMenu;
