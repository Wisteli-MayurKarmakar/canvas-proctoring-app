import React from "react";

interface Props {
    authConfigs: any;
}

const StudentIdDlVerification: React.FC<Props> = (props): JSX.Element => {
  return (
    <div>
      {props.authConfigs.studentPicture && (
        <div className="flex flex-col">
          <div className="box-border h-56 w-64 p-1 border-2 rounded"></div>
          <p className="text-center text-xl font-bold">Student Picture</p>
        </div>
      )}
      {props.authConfigs.studentIdDl && (
        <div className="flex flex-col">
          <div className="box-border h-56 w-64 p-1 border-2 rounded"></div>
          <p className="text-center text-xl font-bold">Student DL/ ID</p>
        </div>
      )}
    </div>
  );
};
export default StudentIdDlVerification;
