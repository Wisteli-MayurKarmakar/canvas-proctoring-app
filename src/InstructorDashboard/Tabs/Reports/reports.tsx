import React, { SyntheticEvent, useState } from "react";
import { useAppStore } from "../../../store/AppSotre";
import QuizReports from "./Components/quizReport";

const Reports: React.FC = (): JSX.Element => {
  const [loadPage, setLoadPage] = useState<string>("By Quiz");
  const { courseDetails } = useAppStore((state) => state);
  const subMenus: string[] = ["By Quiz", "By Time"];

  const handleClick = (e: SyntheticEvent, value: string) => {
    if (value === "By Time") {
      e.preventDefault();
      return;
    }
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
        {subMenus.map((item: string, index: number) => {
          return (
            <button
              key={index}
              type="button"
              disabled={loadPage === "By Time" ? true : false}
              onClick={(e) => handleClick(e, item)}
              className={`inline-block px-6 py-2.5  font-medium text-xs leading-tight rounded-full shadow-md  ${
                loadPage === item
                  ? "bg-blue-400 text-white"
                  : `bg-gray-300 text-black ${
                      loadPage !== "By Quiz"
                        ? "hover:bg-blue-400 hover:text-white"
                        : "cursor-not-allowed"
                    }`
              }  transition duration-150 ease-in-out`}
            >
              {item}
            </button>
          );
        })}
      </div>
      {loadPage === "By Quiz" && <QuizReports />}
    </div>
  );
};

export default Reports;
