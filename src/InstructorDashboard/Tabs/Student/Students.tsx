import React, { lazy, Suspense, useState } from "react";
import LazyLoading from "../../../CommonUtilites/LazyLoadFallback";
import { useAppStore } from "../../../store/AppSotre";
// import Enrollments from "../../Components/Enrollments";
// import Notifications from "../../Components/Notifications";

const Student: React.FC = (): JSX.Element => {
  const [subOptionSelected, setSubOptionSelected] =
    useState<string>("Enrollments");
  const { courseDetails } = useAppStore((state) => state);
  const subMenus: string[] = ["Notifications", "Enrollments"];
  const Enrollments = lazy(() => import("../../Components/Enrollments"));
  const Notifications = lazy(() => import("../../Components/Notifications"));

  const handleSubOptionSelection = (option: string) => {
    setSubOptionSelected(option);
  };

  return (
    <div className="flex flex-col h-full w-full items-center justify-center gap-4 mt-2">
      <h2 className="text-center text-2xl underline">
        Course Name - {courseDetails.name}
      </h2>
      <div className="flex flex-row h-full items-center gap-8">
        {subMenus.map((item: string, index: number) => {
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleSubOptionSelection(item)}
              className={`inline-block px-6 py-2.5  font-medium text-xs leading-tight rounded-full shadow-md  ${
                subOptionSelected === item
                  ? "bg-blue-400 text-white"
                  : "bg-gray-300 text-black hover:bg-blue-400 hover:text-white"
              }  transition duration-150 ease-in-out`}
            >
              {item}
            </button>
          );
        })}
      </div>
      <Suspense fallback={<LazyLoading />}>
        {subOptionSelected === "Enrollments" && <Enrollments />}
        {subOptionSelected === "Notifications" && <Notifications />}
      </Suspense>
    </div>
  );
};

export default Student;
