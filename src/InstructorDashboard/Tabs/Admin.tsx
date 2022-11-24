import React, { useState } from "react";
import Enrollments from "../Components/Enrollments";
import Institutions from "../Components/Institutions";
import Billing from "../Components/Billing";

const Admin: React.FC = (): JSX.Element => {
  const [subOptionSelected, setSubOptionSelected] = useState<string>("Enrollments");

  const subMenus: string[] = ["Institute", "Billing", "Enrollments"];

  const handleSubOptionSelection = (option: string) => {
    setSubOptionSelected(option);
  };

  return (
    <div className="flex flex-col h-full w-full items-center justify-center gap-4 mt-2">
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
      {subOptionSelected === "Enrollments" && <Enrollments />}
      {subOptionSelected === "Institute" && <Institutions />}
      {subOptionSelected === "Billing" && <Billing />}
    </div>
  );
};

export default Admin;
