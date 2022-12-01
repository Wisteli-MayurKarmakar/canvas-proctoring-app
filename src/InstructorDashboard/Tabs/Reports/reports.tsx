import React, { useState } from "react";
import { useAppStore } from "../../../store/AppSotre";
import QuizReports from "./Components/quizReport";

const Reports: React.FC = (): JSX.Element => {
  const [loadPage, setLoadPage] = useState<string>("byquiz");

  const { urlParamsData, tokenData, courseDetails } = useAppStore(
    (state) => state
  );

  const handleClick = (value: string) => {
    setLoadPage(value);
  };

  let courseName: string = "";
  if (courseDetails) {
    courseName = courseDetails.name;
  }

  return (
    <div className="flex flex-col w-full justify-center gap-4">
      {courseName !== "" && (
        <h2 className="text-center text-2xl underline">
          Course Name - {courseName}
        </h2>
      )}
      <div className="flex flex-row h-full w-full items-center justify-center gap-8">
        <button
          type="button"
          onClick={() => handleClick("byquiz")}
          className={`inline-block px-7 py-3 font-medium text-sm leading-snug rounded ${
            loadPage === "byquiz"
              ? "bg-blue-400 text-white"
              : "bg-gray-300 text-black hover:bg-blue-400 hover:text-white transition duration-150 ease-in-out"
          }`}
        >
          By Quiz
        </button>
        <button
          type="button"
          disabled={true}
          onClick={() => handleClick("byuser")}
          className={`inline-block px-7 py-3 font-medium text-sm leading-snug rounded cursor-not-allowed bg-gray-300 text-black`}
        >
          By User
        </button>
      </div>
      {loadPage === "byquiz" && <QuizReports />}
    </div>
  );
};

export default Reports;
