import React, { useState, lazy, Suspense } from "react";
import LazyLoading from "../../CommonUtilites/LazyLoadFallback";
import { useAppStore } from "../../store/AppSotre";
// import ProctoringByQuiz from "../Components/ProctoringByQuiz";
// import ProctoringByTime from "../Components/ProctoringByTime";

const LiveProctoring: React.FC = (): JSX.Element => {
  const [loadPage, setLoadPage] = useState<string>("By Quiz");
  const { courseDetails } = useAppStore.getState();
  const subMenus: string[] = ["By Time", "By Quiz"];
  const ProctoringByQuiz = lazy(() => import("../Components/ProctoringByQuiz"));
  const ProctoringByTime = lazy(() => import("../Components/ProctoringByTime"));

  const handleClick = (page: string) => {
    setLoadPage(page);
  };

  let courseName: string = "";
  if (courseDetails) {
    courseName = courseDetails.name;
  }

  return (
    <div className="flex flex-col h-full w-full items-center justify-center gap-8">
      {courseName !== "" && (
        <h2 className="text-center text-2xl underline">
          Course Name - {courseName}
        </h2>
      )}
      <div className="flex flex-row h-full items-center gap-8">
        {subMenus.map((item: string, index: number) => {
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleClick(item)}
              className={`inline-block px-6 py-2.5  font-medium text-xs leading-tight rounded-full shadow-md  ${
                loadPage === item
                  ? "bg-blue-400 text-white"
                  : `bg-gray-300 text-black hover:bg-blue-400 hover:text-white`
              }  transition duration-150 ease-in-out`}
            >
              {item}
            </button>
          );
        })}
      </div>
      <div className="flex flex-col tab-content w-full justify-center">
        <Suspense fallback={<LazyLoading />}>
          {loadPage === "By Quiz" && <ProctoringByQuiz />}
          {loadPage === "By Time" && <ProctoringByTime />}
        </Suspense>
      </div>
    </div>
  );
};

export default LiveProctoring;
