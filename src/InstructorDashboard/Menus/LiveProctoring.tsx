import React, { useState } from "react";
import ProctoringByQuiz from "../Components/ProctoringByQuiz";
import ProctoringByTime from "../Components/ProctoringByTime";


const LiveProctoring: React.FC = (): JSX.Element => {
  const [loadPage, setLoadPage] = useState<string>("byquiz");

  const handleClick = (page: string) => {
    setLoadPage(page);
  };

  return (
    <div className="flex flex-col h-full w-full items-center justify-center gap-8">
      <div className="flex flex-row h-full items-center gap-8">
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
          onClick={() => handleClick("bytime")}
          className={`inline-block px-7 py-3 font-medium text-sm leading-snug rounded ${
            loadPage === "bytime"
              ? "bg-blue-400 text-white"
              : "bg-gray-300 text-black hover:bg-blue-400 hover:text-white transition duration-150 ease-in-out"
          }`}
        >
          By Time
        </button>
      </div>

      <div className="flex flex-col tab-content w-full justify-center">
        {loadPage === "byquiz" && <ProctoringByQuiz />}
        {loadPage === "bytime" && <ProctoringByTime />}
      </div>
    </div>
  );
};

export default LiveProctoring;
