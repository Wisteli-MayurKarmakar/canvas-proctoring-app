import React, { useState } from "react";
import StudentProctoringForWeek from "../StudentProctoringForWeek";
import StudentProctoringFor3Hrs from "./StudentProctoringFor3Hrs";
import StudentProctoringForToday from "./StudentProctoringForToday";

const ProctoringByTime: React.FC = (): JSX.Element => {
  const [studentsByTime, setStudentsByTime] = useState<string>("threeHrs");

  return (
    <div className="flex flex-col w-full justify-center gap-8">
      <p className="text-xl font-semibold text-center underline">
        Proctoring for Students
      </p>
      <div className="flex flex-row h-full w-full items-center justify-center gap-16">
        <button
          type="button"
          onClick={() => setStudentsByTime("threeHrs")}
          className={`inline-block px-6 py-2.5  font-medium text-xs leading-tight rounded-full shadow-md  ${
            studentsByTime === "threeHrs"
              ? "bg-blue-400 text-white"
              : "bg-gray-300 text-black hover:bg-blue-400 hover:text-white"
          }  transition duration-150 ease-in-out`}
        >
          Next 3 hours
        </button>
        <button
          type="button"
          onClick={() => setStudentsByTime("today")}
          className={`inline-block px-6 py-2.5  font-medium text-xs leading-tight rounded-full shadow-md  ${
            studentsByTime === "today"
              ? "bg-blue-400 text-white"
              : "bg-gray-300 text-black hover:bg-blue-400 hover:text-white"
          }  transition duration-150 ease-in-out`}
        >
          Next 24 hours
        </button>
        <button
          type="button"
          onClick={() => setStudentsByTime("crWeek")}
          className={`inline-block px-6 py-2.5  font-medium text-xs leading-tight rounded-full shadow-md  ${
            studentsByTime === "crWeek"
              ? "bg-blue-400 text-white"
              : "bg-gray-300 text-black hover:bg-blue-400 hover:text-white"
          }  transition duration-150 ease-in-out`}
        >
          Next 7 days
        </button>
      </div>
      {studentsByTime === "threeHrs" && <StudentProctoringFor3Hrs />}
      {studentsByTime === "today" && <StudentProctoringForToday />}
      {studentsByTime === "crWeek" && <StudentProctoringForWeek />}
    </div>
  );
};

export default ProctoringByTime;
